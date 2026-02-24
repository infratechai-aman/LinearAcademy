import sqlite3
import os

def check_test_attempts():
    db_path = "linear_academy.db"
    if not os.path.exists(db_path):
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT DISTINCT student_name FROM test_attempts")
        names = [n[0] for n in cursor.fetchall()]
        
        print(f"Found {len(names)} unique student names in test_attempts:")
        for name in names:
            print(f" - {name}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_test_attempts()
