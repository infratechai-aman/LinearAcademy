import sqlite3
import os

def inspect_test_attempts():
    db_path = "linear_academy.db"
    if not os.path.exists(db_path):
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM test_attempts LIMIT 5")
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        
        print(f"Inspecting 5 rows of test_attempts:")
        for row in rows:
            d = dict(zip(columns, row))
            print(d)
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    inspect_test_attempts()
