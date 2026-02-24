from firebase_config import get_db

def check_all_students_verbose():
    db = get_db()
    if not db:
        print("Firestore not initialized")
        return

    print("Checking 'students' collection (VERBOSE)...")
    docs = db.collection("students").get()
    
    if not docs:
        print("No students found.")
        return

    print(f"Found {len(docs)} student records.")
    for doc in docs:
        print(f"ID: {doc.id}")
        data = doc.to_dict()
        for k, v in data.items():
            val_str = str(v)
            if len(val_str) > 50:
                val_str = val_str[:50] + "..."
            print(f"  {k}: {val_str}")
        print("-" * 20)

if __name__ == "__main__":
    check_all_students_verbose()
