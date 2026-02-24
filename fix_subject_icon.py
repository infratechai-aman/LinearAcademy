import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))
from firebase_config import get_db

def fix_icon():
    db = get_db()
    
    subjects_ref = db.collection("subjects").where("is_active", "==", True).get()
    
    icon_to_copy = None
    target_id = None
    
    for doc in subjects_ref:
        s = doc.to_dict()
        if s.get("name") == "Science and Technology Part 1":
            icon_to_copy = s.get("icon")
            
        if s.get("name") == "Science and Technology Part 2":
            target_id = s.get("id")
            
    if icon_to_copy and target_id:
        print(f"Copying icon '{icon_to_copy}' to Subject ID {target_id}")
        db.collection("subjects").document(str(target_id)).update({"icon": icon_to_copy})
        print("Done.")
    else:
        print("Could not find source icon or target subject.")

if __name__ == "__main__":
    fix_icon()
