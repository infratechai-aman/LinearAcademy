from api.firebase_config import get_db
import datetime

def cleanup():
    db = get_db()
    
    # 1. Define standard classes for each board
    # We want Class 5, 6, 7, 8, 9, 10
    
    standard_classes = []
    board_names = ["CBSE", "Maharashtra Board", "ICSE"]
    
    # We will use IDs from 100 onwards for standardized classes to avoid collision
    # Actually, we can just update existing ones if they match.
    
    # Let map existing classes to boards
    classes_ref = db.collection("academic_classes")
    all_classes = [c.to_dict() for c in classes_ref.get()]
    
    print(f"Found {len(all_classes)} existing classes.")
    
    # Subjects
    subjects_ref = db.collection("subjects")
    all_subjects = [s.to_dict() for s in subjects_ref.get()]
    
    # Logic:
    # Class 10 (ID 21) has Science and Technology Part 1 -> Maharashtra Board
    # Class 10th (ID 14) has Mathematics, Science -> CBSE
    
    mappings = {
        "21": "Maharashtra Board",
        "14": "CBSE",
        "3": "CBSE", # Assuming class_10 is CBSE default
        "2": "CBSE",
        "1": "CBSE",
        # We can try to infer more
    }
    
    # To be safe and clean, let's create 18 standardized classes (3 boards * 6 classes)
    # but that might break existing TestSeries/MCQTests.
    
    # Better: Update 'academic_classes' with a 'board' field.
    # And create missing ones.
    
    for board in board_names:
        for i in range(5, 11):
            class_name = f"Class {i}"
            display_name = f"{i}th Standard"
            if i == 10: display_name = "10th Standard"
            
            # Find if it already exists for this board
            exists = False
            for c in all_classes:
                if c.get("name") == class_name and c.get("board") == board:
                    exists = True
                    break
            
            if not exists:
                # Create it
                # Logic to find next ID
                max_id = 0
                for c in all_classes:
                    try:
                        max_id = max(max_id, int(c.get("id", 0)))
                    except: pass
                new_id = max_id + 1
                
                new_class = {
                    "id": new_id,
                    "name": class_name,
                    "display_name": display_name,
                    "board": board,
                    "order_index": i,
                    "is_active": True
                }
                db.collection("academic_classes").document(str(new_id)).set(new_class)
                all_classes.append(new_class)
                print(f"Created: {board} {class_name}")

    # tag existing subjects if they belong to a class that now has a board
    for s in all_subjects:
        class_id = str(s.get("class_id"))
        board = mappings.get(class_id)
        if board:
            db.collection("subjects").document(str(s.get("id"))).update({"board": board})

    print("Cleanup part 1 (board fields) complete.")

if __name__ == "__main__":
    cleanup()
