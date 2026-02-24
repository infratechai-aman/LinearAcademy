import sqlite3
import os

def list_all_tables():
    db_path = "linear_academy.db"
    if not os.path.exists(db_path):
        print(f"SQLite DB not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [t[0] for t in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables:")
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"  {table}: {count} rows")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_all_tables()
