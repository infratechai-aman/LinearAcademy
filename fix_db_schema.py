import sqlite3
import os

DB_FILE = "linear_academy.db"

def fix_schema():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found. Nothing to fix.")
        return

    print(f"Connecting to {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Check if 'questions_to_show' exists in 'mcq_tests'
        cursor.execute("PRAGMA table_info(mcq_tests)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "questions_to_show" not in columns:
            print("Adding missing column 'questions_to_show' to 'mcq_tests'...")
            # Default to 10 as per schema, not null? Schema didn't say strict not null but good to have default
            cursor.execute("ALTER TABLE mcq_tests ADD COLUMN questions_to_show INTEGER DEFAULT 10")
            print("Column added successfully.")
        else:
            print("Column 'questions_to_show' already exists.")
            
        # Also check 'total_questions' and 'total_marks' just in case
        if "total_questions" not in columns:
            print("Adding missing column 'total_questions'...")
            cursor.execute("ALTER TABLE mcq_tests ADD COLUMN total_questions INTEGER DEFAULT 0")
        
        if "total_marks" not in columns:
            print("Adding missing column 'total_marks'...")
            cursor.execute("ALTER TABLE mcq_tests ADD COLUMN total_marks INTEGER DEFAULT 0")

        conn.commit()
        print("Schema fix complete.")

    except Exception as e:
        print(f"Error updating schema: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_schema()
