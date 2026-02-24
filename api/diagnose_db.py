from api.firebase_config import get_db

def diagnose():
    db = get_db()
    with open("diag_results.txt", "w", encoding="utf-8") as f:
        f.write("=== ACADEMIC CLASSES ===\n")
        classes_ref = db.collection("academic_classes")
        classes = [c.to_dict() for c in classes_ref.get()]
        classes.sort(key=lambda x: x.get('order_index', 0))
        for c in classes:
            line = f"ID: {c.get('id')}, Name: {c.get('name')}, Display: {c.get('display_name')}, Board: {c.get('board')}, Active: {c.get('is_active')}, Order: {c.get('order_index')}\n"
            f.write(line)

        f.write("\n=== SUBJECTS ===\n")
        subjects_ref = db.collection("subjects")
        subjects = [s.to_dict() for s in subjects_ref.get()]
        for s in subjects:
            line = f"ID: {s.get('id')}, ClassID: {s.get('class_id')}, Name: {s.get('name')}, Board: {s.get('board')}, Active: {s.get('is_active')}\n"
            f.write(line)

if __name__ == "__main__":
    diagnose()
