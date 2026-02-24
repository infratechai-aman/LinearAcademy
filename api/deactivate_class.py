from api.firebase_config import get_db

def deactivate_class(class_id):
    db = get_db()
    doc_ref = db.collection("academic_classes").document(str(class_id))
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({"is_active": False})
        print(f"Deactivated class {class_id}: {doc.to_dict().get('name')}")
    else:
        print(f"Class {class_id} not found.")

if __name__ == "__main__":
    deactivate_class(9)
