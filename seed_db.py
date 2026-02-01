import sys
import os
import sys

# Add the current directory to the python path so api modules can be imported
sys.path.append(os.getcwd())

from api import database, models, crud, schemas
from api.database import SessionLocal, engine

def seed_data():
    print("--- Seeding Initial Data ---")
    db = SessionLocal()
    
    try:
        # 1. Seed Academic Classes
        classes = [
            {"name": "Class 8", "display_name": "Class 8th", "order": 1},
            {"name": "Class 9", "display_name": "Class 9th", "order": 2},
            {"name": "Class 10", "display_name": "Class 10th", "order": 3},
            {"name": "Class 11 Science", "display_name": "Class 11th (Science)", "stream": "science", "order": 4},
            {"name": "Class 11 Commerce", "display_name": "Class 11th (Commerce)", "stream": "commerce", "order": 5},
            {"name": "Class 11 Arts", "display_name": "Class 11th (Arts)", "stream": "arts", "order": 6},
            {"name": "Class 12 Science", "display_name": "Class 12th (Science)", "stream": "science", "order": 7},
            {"name": "Class 12 Commerce", "display_name": "Class 12th (Commerce)", "stream": "commerce", "order": 8},
            {"name": "Class 12 Arts", "display_name": "Class 12th (Arts)", "stream": "arts", "order": 9},
        ]

        print("Checking Classes...")
        for cls_info in classes:
            exists = db.query(models.AcademicClass).filter(models.AcademicClass.name == cls_info["name"]).first()
            if not exists:
                print(f"  Creating {cls_info['display_name']}...")
                db_cls = models.AcademicClass(
                    name=cls_info["name"],
                    display_name=cls_info["display_name"],
                    stream=cls_info.get("stream"),
                    order_index=cls_info["order"]
                )
                db.add(db_cls)
        db.commit()

        # 2. Seed Basic Subjects (Example)
        class_10 = db.query(models.AcademicClass).filter(models.AcademicClass.name == "Class 10").first()
        if class_10:
            subjects = [
                {"name": "Mathematics", "icon": "📐", "color": "#4CAF50"},
                {"name": "Science", "icon": "🔬", "color": "#2196F3"},
                {"name": "Social Science", "icon": "🌍", "color": "#FF9800"},
                {"name": "English", "icon": "📖", "color": "#9C27B0"},
            ]
            
            for sub in subjects:
                exists = db.query(models.Subject).filter(
                    models.Subject.class_id == class_10.id,
                    models.Subject.name == sub["name"]
                ).first()
                if not exists:
                    print(f"  Creating {sub['name']}...")
                    db_sub = models.Subject(
                        class_id=class_10.id,
                        name=sub["name"],
                        icon=sub["icon"],
                        color=sub["color"]
                    )
                    db.add(db_sub)
        
        db.commit()
        print("--- Seeding Complete ---")

    except Exception as e:
        print(f"Error Seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
