from api.firebase_config import get_db

def check_mcq_data():
    db = get_db()
    tests = db.collection("mcq_tests").get()
    print(f"Found {len(tests)} MCQ Tests:")
    for test in tests:
        t_data = test.to_dict()
        print(f"Test ID: {test.id}, Title: {t_data.get('title')}, Questions: {t_data.get('total_questions')}")
        
    questions = db.collection("mcq_questions").get()
    print(f"\nFound {len(questions)} MCQ Questions in total.")

if __name__ == "__main__":
    check_mcq_data()
