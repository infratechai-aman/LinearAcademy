from api.firebase_config import get_db

def list_subjects_full(class_id):
    db = get_db()
    subs = db.collection("subjects").where("class_id", "==", class_id).get()
    print(f"Full Subject List for Class {class_id}:")
    for s in subs:
        data = s.to_dict()
        print(f"ID: {s.id} | Name: {data.get('name')} | Active: {data.get('is_active')}")

if __name__ == "__main__":
    list_subjects_full(21)
