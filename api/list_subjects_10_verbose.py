from api.firebase_config import get_db

def list_subjects_verbose(class_id):
    db = get_db()
    subs = db.collection("subjects").where("class_id", "==", class_id).get()
    print(f"Verbose Subject List for Class {class_id}:")
    for s in subs:
        data = s.to_dict()
        print(f"ID: {s.id} | Name: '{data.get('name')}'")

if __name__ == "__main__":
    list_subjects_verbose(21)
