from firebase_config import get_db

def list_collections():
    db = get_db()
    if not db:
        print("Firestore not initialized")
        return

    print("Listing collections...")
    collections = db.collections()
    for coll in collections:
        print(f"Collection: {coll.id}")

if __name__ == "__main__":
    list_collections()
