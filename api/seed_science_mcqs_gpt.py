import os
import json
import datetime
import requests
from api.firebase_config import get_db
from api import crud, models, schemas, boards_data

def call_openai_api(api_key, prompt):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a JSON-only question generator."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.7,
        "max_tokens": 4000
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    return result["choices"][0]["message"]["content"]

def generate_and_seed_science_mcqs():
    # Firestore-based crud doesn't strictly need a SQLAlchemy session for most ops
    db = None 
    board = "Maharashtra Board"
    class_name = "Class 10"
    
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment")
        return
    
    # Get chapters from boards_data
    science_1_name = "Science and Technology Part 1"
    science_2_name = "Science and Technology Part 2"
    
    science_subjects = [science_1_name, science_2_name]
    
    # Ensure Class exists
    classes = crud.get_academic_classes(db)
    db_class = next((c for c in classes if c.name == class_name), None)
    if not db_class:
        print(f"Class {class_name} not found.")
        return

    for subject_name in science_subjects:
        # 1. Ensure Subject exists
        subjects = crud.get_subjects_by_class(db, db_class.id)
        db_subject = next((s for s in subjects if s.name == subject_name), None)
        if not db_subject:
            print(f"Subject {subject_name} not found in DB.")
            continue
            
        print(f"\nProcessing Subject: {subject_name} (ID: {db_subject.id})")
        
        # 2. Ensure Test Series exists
        series_title = f"{board} - {class_name} {subject_name}"
        series_list = crud.get_test_series_by_subject(db, db_subject.id)
        db_series = next((s for s in series_list if s.title == series_title), None)
        
        if not db_series:
            print(f"Creating Test Series: {series_title}")
            db_series = crud.create_test_series(db, schemas.TestSeriesCreate(
                subject_id=db_subject.id,
                title=series_title,
                description=f"AI-Generated MCQ tests for {board} {class_name} - {subject_name}",
                is_free=True,
                price=0,
                order_index=0
            ))
        else:
            print(f"Found existing Test Series: {series_title}")

        # 3. Get chapters
        chapters = boards_data.BOARDS_DATA[board][class_name][subject_name]
        
        for chapter in chapters:
            test_title = f"{chapter} ({board})"
            
            # Check if test already exists in this series
            existing_tests = crud.firestore_db.collection("mcq_tests").where("test_series_id", "==", db_series.id).where("title", "==", test_title).get()
            if existing_tests:
                print(f"  - Test already exists: {test_title}. Skipping.")
                continue
            
            print(f"  - Generating test for chapter: {chapter}")
            
            prompt = f"""You are an expert teacher creating MCQ questions for students.

Board: {board}
Class: {class_name}
Subject: {subject_name}
Chapter: {chapter}

Generate exactly 10 multiple choice questions for this chapter. The questions should:
- Be appropriate for the class level
- Cover key concepts from the chapter
- Have 4 options (A, B, C, D) each
- Have exactly one correct answer
- Include a brief explanation for the correct answer
- Mix easy, medium, and hard difficulty levels

Return ONLY a valid JSON object with a single key "questions" containing exactly 10 objects. Each object must have these exact keys:
{{
  "questions": [
    {{
      "question": "The question text",
      "option_a": "Option A text",
      "option_b": "Option B text",
      "option_c": "Option C text",
      "option_d": "Option D text",
      "correct_option": "a",
      "explanation": "Brief explanation of why this is correct"
    }}
  ]
}}

The correct_option must be lowercase: "a", "b", "c", or "d".
Return ONLY the JSON object, no other text."""

            try:
                content = call_openai_api(api_key, prompt)
                parsed_data = json.loads(content)
                questions_data = parsed_data.get("questions", [])
                
                if not isinstance(questions_data, list) or len(questions_data) < 10:
                    print(f"    Error: OpenAI returned invalid number of questions ({len(questions_data)}).")
                    continue
                
                # Create the MCQ test
                num_questions = len(questions_data)
                db_test = crud.create_mcq_test(db, schemas.MCQTestCreate(
                    test_series_id=db_series.id,
                    title=test_title,
                    description=f"AI-Generated MCQ test for {board} - {class_name} - {subject_name} - {chapter}",
                    total_questions=num_questions,
                    questions_to_show=num_questions,
                    total_marks=num_questions,
                    duration_minutes=15,
                    passing_marks=int(num_questions * 0.4),
                    is_active=True
                ))
                
                # Create all questions
                for idx, q in enumerate(questions_data):
                    crud.create_mcq_question(db, schemas.MCQQuestionCreate(
                        test_id=db_test.id,
                        question_text=q.get("question", ""),
                        option_a=q.get("option_a", ""),
                        option_b=q.get("option_b", ""),
                        option_c=q.get("option_c", ""),
                        option_d=q.get("option_d", ""),
                        correct_option=q.get("correct_option", "a").lower(),
                        marks=1,
                        explanation=q.get("explanation", ""),
                        order_index=idx
                    ))
                
                print(f"    Success: Created test with {num_questions} questions.")
                
            except Exception as e:
                print(f"    Error generating/saving test for {chapter}: {str(e)}")

if __name__ == "__main__":
    generate_and_seed_science_mcqs()
