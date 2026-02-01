import sys
import os
from sqlalchemy import create_engine, text

# Add current directory to path
sys.path.append(os.getcwd())

from api.database import DATABASE_URL

def migrate_to_text():
    print(f"--- Migrating Database for Base64 Images ---")
    print(f"Target DB: {DATABASE_URL}")
    
    # Connect
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL)
    else:
        # Postgres
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("Altering 'students' table...")
            # SQLite doesn't support ALTER COLUMN easily, but for Text it's often okay or requires recreation.
            # Postgres supports specific syntax.
            
            if "sqlite" in DATABASE_URL:
                print("SQLite detected: No action needed for String vs Text length usually, but verifying...")
                # SQLite is dynamic type, so String can hold Text. We just updated models.py for application logic.
                print("SQLite allows long strings in VARCHAR columns natively. Skipping ALTER.")
            else:
                # Postgres
                conn.execute(text("ALTER TABLE students ALTER COLUMN image_url TYPE TEXT;"))
                print("Updated students.image_url")
                
                conn.execute(text("ALTER TABLE test_series ALTER COLUMN thumbnail_url TYPE TEXT;"))
                print("Updated test_series.thumbnail_url")
                
                conn.execute(text("ALTER TABLE mcq_questions ALTER COLUMN question_image_url TYPE TEXT;"))
                print("Updated mcq_questions.question_image_url")
                
                conn.execute(text("ALTER TABLE courses ALTER COLUMN thumbnail_url TYPE TEXT;"))
                print("Updated courses.thumbnail_url")

            trans.commit()
            print("Migration Successful!")
            
        except Exception as e:
            print(f"Migration Failed: {e}")
            trans.rollback()

if __name__ == "__main__":
    migrate_to_text()
