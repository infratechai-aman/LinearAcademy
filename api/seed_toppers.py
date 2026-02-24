import os
import shutil
import re
import sqlite3
import json
from firebase_config import get_db

def parse_filename(filename):
    # Pattern: Name (Rank/Info).png
    match = re.match(r"(.+?)\s*\((.+?)\)", filename)
    if match:
        name = match.group(1).strip()
        rank = match.group(2).strip()
        return name, rank
    return filename, "Topper"

def seed_toppers():
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__)) # linear-classes/api
    toppers_dir = os.path.join(os.path.dirname(base_dir), "frontend", "dist", "Toppers")
    dest_dir = os.path.join(base_dir, "static", "uploads", "students")
    db_path = os.path.join(os.path.dirname(base_dir), "linear_academy.db")
    
    print(f"Using absolute DB path: {os.path.abspath(db_path)}")
    
    if not os.path.exists(toppers_dir):
        print(f"Toppers directory not found at {toppers_dir}")
        return

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir, exist_ok=True)

    # Initialize Firestore
    firestore_db = get_db()
    if not firestore_db:
        print("Firestore not initialized")
        return

    # Connect to SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Clearing existing students...")
    cursor.execute("DELETE FROM students")
    
    files = [f for f in os.listdir(toppers_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
    print(f"Found {len(files)} student images to process.")

    for i, filename in enumerate(files, 1):
        name, rank = parse_filename(filename)
        file_path = os.path.join(toppers_dir, filename)
        
        # New filename to avoid special characters if any, but keeps original mostly
        safe_filename = f"topper_{i}_{re.sub(r'[^a-zA-Z0-9]', '_', name)}.png"
        dest_path = os.path.join(dest_dir, safe_filename)
        
        print(f"Processing student {i}/{len(files)}: {name} ({rank})")
        
        try:
            # Copy file to static folder
            shutil.copy2(file_path, dest_path)
            
            # Database path relative to 'static'
            image_url = f"uploads/students/{safe_filename}"
            description = f"Linear Classes Top Performer - {rank}. Congratulations to {name} for their outstanding achievement!"
            
            # 1. Insert into SQLite
            cursor.execute("""
                INSERT INTO students (id, name, rank, image_url, description, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (i, name, rank, image_url, description, 1))
            print(f"  Inserted into SQLite, rowcount: {cursor.rowcount}")
            
            # 2. Insert into Firestore
            student_dict = {
                "id": i,
                "name": name,
                "rank": rank,
                "image_url": image_url, # Now stores the path, handled by backend endpoint
                "description": description,
                "is_active": True
            }
            firestore_db.collection("students").document(str(i)).set(student_dict)
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    conn.commit()
    
    # Final check
    cursor.execute("SELECT count(*) FROM students")
    final_count = cursor.fetchone()[0]
    print(f"Verified row count in students table: {final_count}")
    
    conn.close()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_toppers()
