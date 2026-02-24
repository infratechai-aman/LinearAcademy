import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))
from firebase_config import get_db

def fix_mappings():
    db = get_db()
    
    classes_ref = db.collection("academic_classes").get()
    classes = [c.to_dict() for c in classes_ref]
    
    class_map = {}
    for c in classes:
        board = c.get("board")
        name = c.get("name")
        is_active = c.get("is_active")
        if is_active in [1, True, "true", "True"] and board and name:
            class_map[(board, name)] = c.get("id")
            print(f"Mapped: {board} - {name} -> ID {c.get('id')}")
            
    subjects_ref = db.collection("subjects").get()
    
    updated_count = 0
    for doc in subjects_ref:
        s = doc.to_dict()
        board = s.get("board")
        name = s.get("name")
        current_class_id = s.get("class_id")
        
        # We need to map Science 1, Science 2, Maths 1, Maths 2, Science and Technology Part 1, History & Civics, Science and Technology Part 2
        # to their respective boards Class 10.
        
        target_board = None
        target_class = "Class 10"
        
        if name in ["Science and Technology Part 1", "History & Civics", "Science and Technology Part 2"]:
            target_board = "Maharashtra Board"
        elif name in ["Science 1", "Science 2", "Maths 1", "Maths 2"]:
            # If the board isn't already set, we might need to deduce it, but let's assume if it was CBSE before, it stays CBSE
            target_board = "CBSE" if board == "CBSE" else "Maharashtra Board" # fallback because Science 1/2 is also MH
            if not board:
               # In diag_results, Science 1 (ID 5, 9) board CBSE. Let's force them to CBSE Class 10. 
               target_board = "CBSE"
        
        if target_board:
            new_id = class_map.get((target_board, target_class))
            if new_id and current_class_id != new_id:
                print(f"Updating {name} to class_id {new_id} ({target_board})")
                db.collection("subjects").document(str(s.get("id"))).update({"class_id": new_id, "board": target_board})
                updated_count += 1
                
    print(f"Fixed mappings for {updated_count} subjects.")

if __name__ == "__main__":
    fix_mappings()
