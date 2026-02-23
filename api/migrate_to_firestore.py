import os
import sys
import sqlite3
from firebase_config import get_db

def migrate_table(cursor, table_name, collection_name, firestore_db):
    print(f"Migrating {table_name} to {collection_name}...")
    
    # Get column names
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Get all rows
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    count = 0
    for row in rows:
        # Create dictionary from row
        item_dict = dict(zip(columns, row))
        
        # Original ID as string
        if 'id' in item_dict and item_dict['id'] is not None:
            doc_id = str(item_dict['id'])
        else:
            continue
            
        # Push to Firestore
        firestore_db.collection(collection_name).document(doc_id).set(item_dict)
        count += 1
        
    print(f"Successfully migrated {count} records to {collection_name}.\n")

def run_migration():
    firestore_db = get_db()
    if not firestore_db:
        print("Could not initialize Firestore client.")
        return
        
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "linear_academy.db")
    
    if not os.path.exists(db_path):
        print(f"SQLite DB not found at {db_path}")
        return
        
    print(f"Connecting to SQLite DB at {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Table to Collection mapping
        migrations = [
            ("admins", "admins"),
            ("site_config", "site_config"),
            ("students", "students"),
            ("enquiries", "enquiries"),
            ("demo_bookings", "demo_bookings"),
            ("academic_classes", "academic_classes"),
            ("subjects", "subjects"),
            ("test_series", "test_series"),
            ("pdf_resources", "pdf_resources"),
            ("mcq_tests", "mcq_tests"),
            ("mcq_questions", "mcq_questions"),
            ("test_attempts", "test_attempts"),
            ("courses", "courses")
        ]
        
        for table_name, collection_name in migrations:
            # Check if table exists
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
            if cursor.fetchone():
                migrate_table(cursor, table_name, collection_name, firestore_db)
            else:
                print(f"Table {table_name} not found in SQLite DB. Skipping.")
                
        print("All data successfully migrated to Firestore!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()
