"""
Linear Academy API - Main FastAPI Application
This file serves as the single entry point for all Vercel serverless functions.
"""
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
import json
import random

# Import local modules
from .database import Base, engine, get_db, SessionLocal
from . import models, schemas, crud

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Seed default data
def seed_data():
    db = SessionLocal()
    try:
        # Seed students
        if db.query(models.Student).count() == 0:
            default_student = models.Student(
                name="Aarav Patel",
                rank="98.5% - Class 10th",
                image_url="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop",
                description="Aarav consistently topped his class with dedication and hard work."
            )
            db.add(default_student)
            db.commit()
        
        # Seed Academic Classes
        if db.query(models.AcademicClass).count() == 0:
            classes_data = [
                {"name": "class_8", "display_name": "Class 8th", "stream": None, "order_index": 1},
                {"name": "class_9", "display_name": "Class 9th", "stream": None, "order_index": 2},
                {"name": "class_10", "display_name": "Class 10th", "stream": None, "order_index": 3},
                {"name": "class_11_science", "display_name": "Class 11th - Science", "stream": "science", "order_index": 4},
                {"name": "class_11_commerce", "display_name": "Class 11th - Commerce", "stream": "commerce", "order_index": 5},
                {"name": "class_12_science", "display_name": "Class 12th - Science", "stream": "science", "order_index": 6},
                {"name": "class_12_commerce", "display_name": "Class 12th - Commerce", "stream": "commerce", "order_index": 7},
            ]
            for cls in classes_data:
                db.add(models.AcademicClass(**cls))
            db.commit()
            
            # Seed Subjects for each class
            classes = db.query(models.AcademicClass).all()
            
            subjects_8_to_10 = [
                {"name": "Science 1", "icon": "🔬", "color": "#4CAF50"},
                {"name": "Science 2", "icon": "🧪", "color": "#2196F3"},
                {"name": "Maths 1", "icon": "📐", "color": "#FF9800"},
                {"name": "Maths 2", "icon": "📊", "color": "#9C27B0"},
            ]
            
            subjects_science = [
                {"name": "Physics", "icon": "⚛️", "color": "#3F51B5"},
                {"name": "Chemistry", "icon": "🧪", "color": "#E91E63"},
                {"name": "Biology", "icon": "🧬", "color": "#4CAF50"},
                {"name": "Mathematics", "icon": "📐", "color": "#FF5722"},
            ]
            
            subjects_commerce = [
                {"name": "Accountancy", "icon": "📒", "color": "#795548"},
                {"name": "Economics", "icon": "📈", "color": "#009688"},
                {"name": "Business Studies", "icon": "💼", "color": "#607D8B"},
                {"name": "Mathematics", "icon": "📐", "color": "#FF5722"},
            ]
            
            for cls in classes:
                if cls.stream is None:  # Class 8-10
                    for idx, subj in enumerate(subjects_8_to_10):
                        db.add(models.Subject(class_id=cls.id, order_index=idx, **subj))
                elif cls.stream == "science":
                    for idx, subj in enumerate(subjects_science):
                        db.add(models.Subject(class_id=cls.id, order_index=idx, **subj))
                elif cls.stream == "commerce":
                    for idx, subj in enumerate(subjects_commerce):
                        db.add(models.Subject(class_id=cls.id, order_index=idx, **subj))
            
            db.commit()
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

# Initialize seed data
try:
    seed_data()
except:
    pass  # Ignore errors during cold start

# Create FastAPI app
app = FastAPI(title="Linear Academy API", version="2.0")

# CORS - Allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================== ROOT ==================

@app.get("/")
def read_root():
    return {"message": "Linear Academy API is running", "version": "2.0"}


# ================== SITE CONFIG ==================

@app.get("/api/config", response_model=schemas.SiteConfig)
def read_config(db: Session = Depends(get_db)):
    config = crud.get_site_config(db)
    if config is None:
        return schemas.SiteConfig(
            id=0,
            phone_number="+91 98765 43210", 
            email="info@linearclasses.com", 
            address="191, Nagpur Chawl, Yerawada, Pune - 411006, Maharashtra, India"
        )
    return config

@app.post("/api/config", response_model=schemas.SiteConfig)
def update_config(config: schemas.SiteConfigCreate, db: Session = Depends(get_db)):
    return crud.create_or_update_site_config(db, config)


# ================== STUDENTS ==================

@app.get("/api/students", response_model=list[schemas.Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_students(db, skip=skip, limit=limit)

@app.post("/api/students", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db, student)

@app.delete("/api/students/{student_id}", response_model=schemas.Student)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    return crud.delete_student(db, student_id)


# ================== ENQUIRIES ==================

@app.post("/api/enquiries", response_model=schemas.Enquiry)
def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(get_db)):
    return crud.create_enquiry(db, enquiry)

@app.get("/api/enquiries", response_model=list[schemas.Enquiry])
def read_enquiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_enquiries(db, skip=skip, limit=limit)


# ================== ADMIN AUTH ==================

@app.post("/api/login")
def login(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    # Simple hardcoded auth for now
    if admin.username == "amaan@linearacademy" and admin.password == "Amaan@786":
        return {"access_token": "fake-token", "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")


# ================== DEMO BOOKINGS ==================

@app.post("/api/demo-bookings", response_model=schemas.DemoBooking)
def create_demo_booking(booking: schemas.DemoBookingCreate, db: Session = Depends(get_db)):
    return crud.create_demo_booking(db, booking)

@app.get("/api/demo-bookings", response_model=list[schemas.DemoBooking])
def read_demo_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_demo_bookings(db, skip=skip, limit=limit)

@app.put("/api/demo-bookings/{booking_id}/status")
def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = crud.update_demo_booking_status(db, booking_id, status)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@app.delete("/api/demo-bookings/{booking_id}")
def delete_demo_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = crud.delete_demo_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}


# ================== ACADEMIC CLASSES ==================

@app.get("/api/classes", response_model=list[schemas.AcademicClass])
def read_classes(db: Session = Depends(get_db)):
    return crud.get_academic_classes(db)

@app.get("/api/classes/{class_id}", response_model=schemas.AcademicClass)
def read_class(class_id: int, db: Session = Depends(get_db)):
    cls = crud.get_academic_class(db, class_id)
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return cls

@app.post("/api/classes", response_model=schemas.AcademicClass)
def create_class(academic_class: schemas.AcademicClassCreate, db: Session = Depends(get_db)):
    return crud.create_academic_class(db, academic_class)


# ================== SUBJECTS ==================

@app.get("/api/classes/{class_id}/subjects", response_model=list[schemas.Subject])
def read_subjects_by_class(class_id: int, db: Session = Depends(get_db)):
    return crud.get_subjects_by_class(db, class_id)

@app.get("/api/subjects", response_model=list[schemas.Subject])
def read_all_subjects(db: Session = Depends(get_db)):
    return crud.get_all_subjects(db)

@app.get("/api/subjects/{subject_id}", response_model=schemas.Subject)
def read_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = crud.get_subject(db, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@app.post("/api/subjects", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    return crud.create_subject(db, subject)


# ================== TEST SERIES ==================

@app.get("/api/subjects/{subject_id}/test-series", response_model=list[schemas.TestSeries])
def read_test_series_by_subject(subject_id: int, db: Session = Depends(get_db)):
    return crud.get_test_series_by_subject(db, subject_id)

@app.get("/api/test-series", response_model=list[schemas.TestSeries])
def read_all_test_series(db: Session = Depends(get_db)):
    return crud.get_all_test_series(db)

@app.get("/api/test-series/{series_id}", response_model=schemas.TestSeries)
def read_test_series(series_id: int, db: Session = Depends(get_db)):
    series = crud.get_test_series(db, series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Test series not found")
    return series

@app.post("/api/test-series", response_model=schemas.TestSeries)
def create_test_series(series: schemas.TestSeriesCreate, db: Session = Depends(get_db)):
    return crud.create_test_series(db, series)

@app.delete("/api/test-series/{series_id}")
def delete_test_series(series_id: int, db: Session = Depends(get_db)):
    series = crud.delete_test_series(db, series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Test series not found")
    return {"message": "Test series deleted"}


# ================== PDF RESOURCES ==================

@app.get("/api/test-series/{series_id}/pdfs", response_model=list[schemas.PDFResource])
def read_pdfs_by_series(series_id: int, db: Session = Depends(get_db)):
    return crud.get_pdfs_by_test_series(db, series_id)

@app.get("/api/pdfs", response_model=list[schemas.PDFResource])
def read_all_pdfs(db: Session = Depends(get_db)):
    return crud.get_all_pdfs(db)

@app.post("/api/pdfs", response_model=schemas.PDFResource)
def create_pdf(pdf: schemas.PDFResourceCreate, db: Session = Depends(get_db)):
    return crud.create_pdf_resource(db, pdf)

@app.delete("/api/pdfs/{pdf_id}")
def delete_pdf(pdf_id: int, db: Session = Depends(get_db)):
    pdf = crud.delete_pdf_resource(db, pdf_id)
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    return {"message": "PDF deleted"}


# ================== MCQ TESTS ==================

@app.get("/api/test-series/{series_id}/tests", response_model=list[schemas.MCQTest])
def read_tests_by_series(series_id: int, db: Session = Depends(get_db)):
    return crud.get_mcq_tests_by_test_series(db, series_id)

@app.get("/api/tests", response_model=list[schemas.MCQTest])
def read_all_tests(db: Session = Depends(get_db)):
    return crud.get_all_mcq_tests(db)

@app.get("/api/tests/{test_id}")
def read_test(test_id: int, admin: bool = False, db: Session = Depends(get_db)):
    """
    Get a test with questions.
    - admin=true: Returns ALL questions (for admin panel to manage questions)
    - admin=false: Returns RANDOM subset of questions based on questions_to_show
    """
    test = crud.get_mcq_test(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    all_questions = crud.get_questions_by_test(db, test_id)
    
    if admin:
        # Admin mode: return all questions
        questions = [q.__dict__ for q in all_questions]
    else:
        # User mode: return random subset
        questions_to_show = getattr(test, 'questions_to_show', 10) or 10
        if len(all_questions) <= questions_to_show:
            selected = all_questions
        else:
            selected = random.sample(all_questions, questions_to_show)
        questions = [q.__dict__ for q in selected]
    
    return {
        **test.__dict__,
        "questions": questions,
        "total_questions_in_bank": len(all_questions)
    }

@app.post("/api/tests", response_model=schemas.MCQTest)
def create_test(test: schemas.MCQTestCreate, db: Session = Depends(get_db)):
    return crud.create_mcq_test(db, test)

@app.put("/api/tests/{test_id}", response_model=schemas.MCQTest)
def update_test(test_id: int, test: schemas.MCQTestCreate, db: Session = Depends(get_db)):
    updated = crud.update_mcq_test(db, test_id, test)
    if not updated:
        raise HTTPException(status_code=404, detail="Test not found")
    return updated

@app.delete("/api/tests/{test_id}")
def delete_test(test_id: int, db: Session = Depends(get_db)):
    test = crud.delete_mcq_test(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted"}


# ================== MCQ QUESTIONS ==================

@app.get("/api/tests/{test_id}/questions", response_model=list[schemas.MCQQuestion])
def read_questions(test_id: int, db: Session = Depends(get_db)):
    return crud.get_questions_by_test(db, test_id)

@app.post("/api/questions", response_model=schemas.MCQQuestion)
def create_question(question: schemas.MCQQuestionCreate, db: Session = Depends(get_db)):
    return crud.create_mcq_question(db, question)

@app.put("/api/questions/{question_id}", response_model=schemas.MCQQuestion)
def update_question(question_id: int, question: schemas.MCQQuestionCreate, db: Session = Depends(get_db)):
    updated = crud.update_mcq_question(db, question_id, question)
    if not updated:
        raise HTTPException(status_code=404, detail="Question not found")
    return updated

@app.delete("/api/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = crud.delete_mcq_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted"}


# ================== TEST ATTEMPTS & SCORING ==================

@app.post("/api/tests/{test_id}/submit")
def submit_test(test_id: int, attempt: schemas.TestAttemptCreate, time_taken: int = 0, db: Session = Depends(get_db)):
    # Get test and questions
    test = crud.get_mcq_test(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    questions = crud.get_questions_by_test(db, test_id)
    
    # Parse student answers
    try:
        student_answers = json.loads(attempt.answers_json)
    except:
        raise HTTPException(status_code=400, detail="Invalid answers format")
    
    # Calculate score
    score = 0
    correct = 0
    wrong = 0
    total_marks = 0
    
    for q in questions:
        total_marks += q.marks
        answer = student_answers.get(str(q.id))
        if answer:
            if answer.lower() == q.correct_option.lower():
                score += q.marks
                correct += 1
            else:
                wrong += 1
    
    unanswered = len(questions) - correct - wrong
    
    # Save attempt
    db_attempt = crud.create_test_attempt(
        db, attempt, score, total_marks, correct, wrong, unanswered, time_taken
    )
    
    return {
        "id": db_attempt.id,
        "score": score,
        "total_marks": total_marks,
        "correct_answers": correct,
        "wrong_answers": wrong,
        "unanswered": unanswered,
        "percentage": round((score / total_marks * 100) if total_marks > 0 else 0, 2),
        "passed": score >= test.passing_marks
    }

@app.get("/api/test-attempts", response_model=list[schemas.TestAttempt])
def read_test_attempts(test_id: Optional[int] = None, db: Session = Depends(get_db)):
    if test_id:
        return crud.get_test_attempts(db, test_id)
    return crud.get_all_test_attempts(db)


# ================== COURSES ==================

@app.get("/api/courses", response_model=list[schemas.Course])
def read_courses(type: Optional[str] = None, db: Session = Depends(get_db)):
    if type == "free":
        return crud.get_courses(db, is_free=True)
    elif type == "paid":
        return crud.get_courses(db, is_free=False)
    return crud.get_courses(db)

@app.get("/api/courses/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/api/courses", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db, course)

@app.put("/api/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    updated = crud.update_course(db, course_id, course)
    if not updated:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.delete_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted"}


# ================== FILE UPLOAD (For Production use cloud storage) ==================
# Note: For Vercel, file uploads should go to a cloud storage service like AWS S3 or Cloudinary
# This endpoint is for local development only

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    # For production, implement cloud storage upload
    # For now, return a placeholder
    return {"url": f"https://placeholder.com/{uuid.uuid4()}.jpg", "message": "Use cloud storage in production"}

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # For production, implement cloud storage upload
    # For now, return a placeholder
    return {
        "url": f"https://placeholder.com/{uuid.uuid4()}.pdf",
        "file_size": "Unknown",
        "message": "Use cloud storage in production"
    }


# Vercel handler
handler = app
