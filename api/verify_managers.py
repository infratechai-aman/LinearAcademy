import sys
import os
import random

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database import SessionLocal, engine, Base
    import models
    import crud
    import schemas
except ImportError as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

def verify_managers():
    db = SessionLocal()
    try:
        print("--- Verifying Test Series & MCQ Managers ---")

        # 1. Create Academic Class
        print("\n1. Creating Academic Class...")
        cls_data = schemas.AcademicClassCreate(name="Test Class 10", display_name="Class 10 Test", order_index=99)
        cls = crud.create_academic_class(db, cls_data)
        print(f"   Created Class: {cls.id} - {cls.display_name}")

        # 2. Create Subject
        print("\n2. Creating Subject...")
        sub_data = schemas.SubjectCreate(class_id=cls.id, name="Test Physics", icon="⚛️", order_index=1)
        sub = crud.create_subject(db, sub_data)
        print(f"   Created Subject: {sub.id} - {sub.name}")

        # 3. Create Test Series
        print("\n3. Creating Test Series...")
        series_data = schemas.TestSeriesCreate(
            subject_id=sub.id, 
            title="Physics Master Series", 
            description="Master Physics for Class 10",
            is_free=True
        )
        series = crud.create_test_series(db, series_data)
        print(f"   Created Series: {series.id} - {series.title}")

        # 4. Create MCQ Test
        print("\n4. Creating MCQ Test...")
        test_data = schemas.MCQTestCreate(
            test_series_id=series.id,
            title="Kinematics Unit Test",
            description="Test your motion knowledge",
            duration_minutes=30,
            questions_to_show=5
        )
        test = crud.create_mcq_test(db, test_data)
        print(f"   Created Test: {test.id} - {test.title}")

        # 5. Add Questions
        print("\n5. Adding Questions...")
        q_data = schemas.MCQQuestionCreate(
            test_id=test.id,
            question_text="What is the unit of velocity?",
            option_a="m/s", option_b="m/s^2", option_c="kg", option_d="Joule",
            correct_option="a", marks=4
        )
        q1 = crud.create_mcq_question(db, q_data)
        print(f"   Created Q1: {q1.id}")

        q_data2 = schemas.MCQQuestionCreate(
            test_id=test.id,
            question_text="Acceleration is change in?",
            option_a="Position", option_b="Velocity", option_c="Force", option_d="Mass",
            correct_option="b", marks=4
        )
        q2 = crud.create_mcq_question(db, q_data2)
        print(f"   Created Q2: {q2.id}")

        # 6. Verify Counts
        print("\n6. Verifying Test Counts (Questions & Marks)...")
        # Refresh test from DB to check triggers/updates
        updated_test = crud.get_mcq_test(db, test.id)
        print(f"   Test Total Questions: {updated_test.total_questions} (Expected: 2)")
        print(f"   Test Total Marks: {updated_test.total_marks} (Expected: 8)")

        if updated_test.total_questions != 2:
            print("   [FAILED] Total questions count mismatch!")
        elif updated_test.total_marks != 8:
            print("   [FAILED] Total marks mismatch!")
        else:
            print("   [SUCCESS] Counts verified!")

        # 7. Cleanup (Optional, but good for repeatability)
        print("\n7. Cleaning up test data...")
        crud.delete_mcq_test(db, test.id)
        crud.delete_test_series(db, series.id)
        # Note: Delete subject/class logic might not be recursive in crud, so skip for safety or add later
        
        print("\n--- Verification Complete ---")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_managers()
