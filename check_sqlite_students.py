import sqlite3
import os

def check_sqlite_students():
    db_path = "linear_academy.db"
    if not os.path.exists(db_path):
        print(f"SQLite DB not found at {db_path}")
        return

    print(f"Checking SQLite DB at {db_path}...")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM students")
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        
        if not rows:
            print("No students found in SQLite DB.")
            return

        print(f"Found {len(rows)} students in SQLite DB:")
        for row in rows:
            student_dict = dict(zip(columns, row))
            print(f"Student: {student_dict.get('name')} (ID: {student_dict.get('id')})")
            for key, value in student_dict.items():
                if key not in ['name', 'id']:
                    val_str = str(value)
                    if len(val_str) > 50:
                        val_str = val_str[:50] + "..."
                    print(f"  {key}: {val_str}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_sqlite_students()
