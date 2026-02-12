import sys
import os
from dotenv import load_dotenv

# Load env from .env.local or .env
load_dotenv('.env.local')
load_dotenv()

try:
    from api import database, models, crud, schemas
    from api.database import SessionLocal, engine
except ImportError as e:
    with open("verification_output.txt", "w", encoding="utf-8") as f:
        f.write(f"Error importing api modules: {e}")
    sys.exit(1)

def verify_managers():
    with open("verification_output.txt", "w", encoding="utf-8") as log_file:
        def log(msg):
            print(msg)
            log_file.write(msg + "\n")
            
        log("--- Verifying Test Series & MCQ Managers ---")
        
        # Ensure tables exist (for SQLite)
        models.Base.metadata.create_all(bind=engine)

        db = SessionLocal()
        try:
            # 1. Create Academic Class
            log("\n1. Creating Academic Class...")
            # Use unique name to avoid errors if repeated
            unique_suffix = os.urandom(2).hex()
            cls_data = schemas.AcademicClassCreate(
                name=f"Test Class {unique_suffix}", 
                display_name=f"Class Test {unique_suffix}", 
                order_index=99
            )
            cls = crud.create_academic_class(db, cls_data)
            log(f"   Created Class: {cls.id} - {cls.display_name}")

            # 2. Create Subject
            log("\n2. Creating Subject...")
            sub_data = schemas.SubjectCreate(class_id=cls.id, name="Test Physics", icon="⚛️", order_index=1)
            sub = crud.create_subject(db, sub_data)
            log(f"   Created Subject: {sub.id} - {sub.name}")

            # 3. Create Test Series
            log("\n3. Creating Test Series...")
            series_data = schemas.TestSeriesCreate(
                subject_id=sub.id, 
                title="Physics Master Series", 
                description="Master Physics",
                is_free=True
            )
            series = crud.create_test_series(db, series_data)
            log(f"   Created Series: {series.id} - {series.title}")

            # 4. Create MCQ Test
            log("\n4. Creating MCQ Test...")
            test_data = schemas.MCQTestCreate(
                test_series_id=series.id,
                title="Kinematics Unit Test",
                description="Test your motion knowledge",
                duration_minutes=30,
                questions_to_show=5
            )
            test = crud.create_mcq_test(db, test_data)
            log(f"   Created Test: {test.id} - {test.title}")

            # 5. Add Questions
            log("\n5. Adding Questions...")
            q_data = schemas.MCQQuestionCreate(
                test_id=test.id,
                question_text="What is the unit of velocity?",
                option_a="m/s", option_b="m/s^2", option_c="kg", option_d="Joule",
                correct_option="a", marks=4
            )
            q1 = crud.create_mcq_question(db, q_data)
            log(f"   Created Q1: {q1.id}")

            q_data2 = schemas.MCQQuestionCreate(
                test_id=test.id,
                question_text="Acceleration is change in?",
                option_a="Position", option_b="Velocity", option_c="Force", option_d="Mass",
                correct_option="b", marks=4
            )
            q2 = crud.create_mcq_question(db, q_data2)
            log(f"   Created Q2: {q2.id}")

            # 6. Verify Counts
            log("\n6. Verifying Test Counts (Questions & Marks)...")
            # Refresh test from DB to check triggers/updates
            # We need to query again or refresh
            db.refresh(test) 
            
            log(f"   Test Total Questions: {test.total_questions} (Expected: 2)")
            log(f"   Test Total Marks: {test.total_marks} (Expected: 8)")

            if test.total_questions != 2:
                log("   [FAILED] Total questions count mismatch!")
            elif test.total_marks != 8:
                log("   [FAILED] Total marks mismatch!")
            else:
                log("   [SUCCESS] Counts verified!")

            # 7. Cleanup
            log("\n7. Cleaning up test data...")
            crud.delete_mcq_test(db, test.id)
            crud.delete_test_series(db, series.id)
            # Note: Delete subject/class logic omitted for brevity, but IDs are returning
            
            log("\n--- Verification Complete ---")

        except Exception as e:
            import traceback
            traceback.print_exc()
            log(f"An error occurred: {e}")
        finally:
            db.close()

if __name__ == "__main__":
    verify_managers()
