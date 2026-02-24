from firebase_config import get_db

def list_academic_classes():
    db = get_db()
    docs = db.collection("academic_classes").get()
    print(f"Found {len(docs)} classes:")
    for doc in docs:
        data = doc.to_dict()
        print(f"ID: {doc.id}, Name: {data.get('name')}, Active: {data.get('is_active')}, Order: {data.get('order_index')}")

if __name__ == "__main__":
    list_academic_classes()
