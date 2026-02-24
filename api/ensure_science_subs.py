from api.firebase_config import get_db

def ensure_science_subjects(class_id):
    db = get_db()
    # Check Science 1
    s1_name = "Science and Technology Part 1"
    s1_query = db.collection("subjects").where("class_id", "==", class_id).where("name", "==", s1_name).get()
    if not s1_query:
        # Create
        print(f"Creating {s1_name}")
        # Need to find next ID
        all_subs = db.collection("subjects").order_by("id", direction="DESCENDING").limit(1).get()
        new_id = 1
        if all_subs:
            new_id = int(all_subs[0].id) + 1
        db.collection("subjects").document(str(new_id)).set({
            "id": new_id,
            "class_id": class_id,
            "name": s1_name,
            "is_active": True,
            "order_index": 1,
            "color": "#D4AF37"
        })
        s1_id = new_id
    else:
        s1_id = int(s1_query[0].id)
        print(f"Found {s1_name} with ID {s1_id}")

    # Check Science 2
    s2_name = "Science and Technology Part 2"
    s2_query = db.collection("subjects").where("class_id", "==", class_id).where("name", "==", s2_name).get()
    if not s2_query:
        # Create
        print(f"Creating {s2_name}")
        all_subs = db.collection("subjects").order_by("id", direction="DESCENDING").limit(1).get()
        new_id = 1
        if all_subs:
            new_id = int(all_subs[0].id) + 1
        db.collection("subjects").document(str(new_id)).set({
            "id": new_id,
            "class_id": class_id,
            "name": s2_name,
            "is_active": True,
            "order_index": 2,
            "color": "#D4AF37"
        })
        s2_id = new_id
    else:
        s2_id = int(s2_query[0].id)
        print(f"Found {s2_name} with ID {s2_id}")
    
    return s1_id, s2_id

if __name__ == "__main__":
    ensure_science_subjects(21)
