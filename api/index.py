"""
Linear Academy API - Main FastAPI Application
This file serves as the single entry point for all Vercel serverless functions.
ULTRA-DEFENSIVE: Wraps all imports to prevent crashes on Vercel.
"""
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
import os
import uuid
import json
import random
import sys
import os

try:
    from sqlalchemy.orm import Session
except ImportError:
    # Fallback for type hinting if sqlalchemy is missing
    class Session: pass

# Add the current directory to sys.path to ensure local imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database import engine, SessionLocal, Base
    import models
    import schemas
    DB_AVAILABLE = True
except ImportError:
    try:
        from .database import engine, SessionLocal, Base
        from . import models
        from . import schemas
        DB_AVAILABLE = True
    except ImportError:
        DB_AVAILABLE = False
        Base = None
        engine = None
        SessionLocal = None
        models = None
        schemas = None
        print("Database modules not found. Running in safe mode.")

# New Firestore imports
import crud
from firebase_config import get_db


# Create FastAPI app FIRST before any imports that might fail
app = FastAPI(title="Linear Academy API", version="2.0")

# CORS - Allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== ROOT ==================
@app.get("/")
def read_root():
    return {"message": "Linear Academy API is running", "version": "2.0", "db_status": "Connected" if DB_AVAILABLE else "Disconnected"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": DB_AVAILABLE, "framework": "fastapi"}

class LoginRequest(BaseModel):
    username: str
    password: str

# ================== ADMIN AUTH (No DB required) ==================
@app.post("/api/login")
def login(request: LoginRequest, db = Depends(get_db)):
    # Hardcoded admin check (ALWAYS allowed, helps in recovery)
    if request.username == "amaan@linearacademy" and request.password == "Amaan@786":
         return {"access_token": "admin-super-secret-token", "token_type": "bearer", "user": {"username": "admin", "role": "admin"}}
    
    # If DB is down and it's not the hardcoded admin, we can't do anything
    if db is None:
        raise HTTPException(status_code=503, detail="Database Unavailable. Please use emergency admin credentials.")

    try:
        user = crud.get_user_by_email(db, email=request.username)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        if not user.verify_password(request.password):
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        
        return {"access_token": "user-token", "token_type": "bearer", "user": {"username": user.email, "role": "user"}}
    except Exception as e:
        print(f"Login error: {e}")
        # If expected DB error, re-raise 500
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug-info")
def debug_info():
    return {
        "status": "alive",
        "python_version": sys.version,
        "cwd": os.getcwd(),
        "db_available": DB_AVAILABLE
    }

# Database is already imported above
if DB_AVAILABLE:
    try:
        if engine:
            models.Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Failed to connect to database: {e}")

# Only define database-dependent endpoints if DB is available
if DB_AVAILABLE and schemas is not None:
    # Removed sqlalchemy dependency 
    
    # ================== SITE CONFIG ==================
    @app.get("/api/config")
    def read_config(db = Depends(get_db)):
        try:
            config = crud.get_site_config(db)
            if config is None:
                return {
                    "id": 0,
                    "phone_number": "+91 87961 26936", 
                    "email": "info@linearclasses.com", 
                    "address": "Sr no 253 khese park, Lane number 18D lohegaon pune 411032"
                }
            
            # Hotfix: Enforce new contact info if old info is present
            if "Nagpur" in config.address or "98765" in config.phone_number or "7028" in config.phone_number:
                config.phone_number = "+91 87961 26936"
                config.address = "Sr no 253 khese park, Lane number 18D lohegaon pune 411032"
                try:
                    db.commit()
                    db.refresh(config)
                except:
                    pass # Ignore db errors, just return correct data
            
            return config
        except Exception as e:
             raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/config")
    def update_config(config: schemas.SiteConfigCreate, db = Depends(get_db)):
        return crud.create_or_update_site_config(db, config)

    # ================== STUDENTS ==================
    @app.get("/api/students")
    def read_students(skip: int = 0, limit: int = 100, db = Depends(get_db)):
        students = crud.get_students(db, skip=skip, limit=limit)
        # Transform to lightweight response (replace Base64 with URL)
        results = []
        for s in students:
            # construct a dict to avoid modifying the DB object
            s_dict = {
                "id": s.id,
                "name": s.name,
                "rank": s.rank,
                "description": s.description,
                "is_active": s.is_active,
                # If it has an image, point to the serving endpoint
                # If no image, keep it None or empty
                "image_url": f"/api/students/{s.id}/image" if s.image_url else None
            }
            results.append(s_dict)
        return results

    @app.get("/api/students/{student_id}/image")
    def serve_student_image(student_id: int, db = Depends(get_db)):
        import base64
        from fastapi.responses import Response
        
        student = crud.get_student(db, student_id)
        
        if not student or not student.get("image_url"):
            # Return a default placeholder or 404
            # For now, 404 is fine, frontend handles broken images
             return Response(status_code=404)

        try:
            # Check if it's really base64
            if "base64," in student.get("image_url", ""):
                header, encoded = student.get("image_url").split("base64,", 1)
                data = base64.b64decode(encoded)
                # Cache for 1 year (immutable images basically)
                return Response(content=data, media_type="image/jpeg", headers={"Cache-Control": "public, max-age=31536000"})
            else:
                # API consumer might have sent a normal URL (?) just redirect or 404
                return Response(status_code=404)
        except Exception as e:
            print(f"Image serving error: {e}")
            return Response(status_code=500)

    @app.post("/api/students")
    def create_student(student: schemas.StudentCreate, db = Depends(get_db)):
        return crud.create_student(db, student)

    @app.delete("/api/students/{student_id}")
    def delete_student(student_id: int, db = Depends(get_db)):
        return crud.delete_student(db, student_id)

    # ================== ENQUIRIES ==================
    @app.post("/api/enquiries")
    def create_enquiry(enquiry: schemas.EnquiryCreate, db = Depends(get_db)):
        return crud.create_enquiry(db, enquiry)

    @app.get("/api/enquiries")
    def read_enquiries(skip: int = 0, limit: int = 100, db = Depends(get_db)):
        return crud.get_enquiries(db, skip=skip, limit=limit)

    @app.delete("/api/enquiries/{enquiry_id}")
    def delete_enquiry(enquiry_id: int, db = Depends(get_db)):
        enq = crud.delete_enquiry(db, enquiry_id)
        if not enq:
            raise HTTPException(status_code=404, detail="Enquiry not found")
        return enq

    # ================== DEMO BOOKINGS ==================
    @app.post("/api/demo-bookings")
    def create_demo_booking(booking: schemas.DemoBookingCreate, db = Depends(get_db)):
        return crud.create_demo_booking(db, booking)

    @app.get("/api/demo-bookings")
    def read_demo_bookings(skip: int = 0, limit: int = 100, db = Depends(get_db)):
        return crud.get_demo_bookings(db, skip=skip, limit=limit)

    @app.put("/api/demo-bookings/{booking_id}/status")
    def update_booking_status(booking_id: int, status: str, db = Depends(get_db)):
        booking = crud.update_demo_booking_status(db, booking_id, status)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking

    @app.delete("/api/demo-bookings/{booking_id}")
    def delete_demo_booking(booking_id: int, db = Depends(get_db)):
        booking = crud.delete_demo_booking(db, booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return {"message": "Booking deleted successfully"}

    # ================== ACADEMIC CLASSES ==================
    @app.get("/api/classes")
    def read_classes(db = Depends(get_db)):
        return crud.get_academic_classes(db)

    @app.get("/api/classes/{class_id}")
    def read_class(class_id: int, db = Depends(get_db)):
        cls = crud.get_academic_class(db, class_id)
        if not cls:
            raise HTTPException(status_code=404, detail="Class not found")
        return cls

    @app.post("/api/classes")
    def create_class(academic_class: schemas.AcademicClassCreate, db = Depends(get_db)):
        return crud.create_academic_class(db, academic_class)

    # ================== SUBJECTS ==================
    @app.get("/api/classes/{class_id}/subjects")
    def read_subjects_by_class(class_id: int, db = Depends(get_db)):
        return crud.get_subjects_by_class(db, class_id)

    @app.get("/api/subjects")
    def read_all_subjects(db = Depends(get_db)):
        return crud.get_all_subjects(db)

    @app.get("/api/subjects/{subject_id}")
    def read_subject(subject_id: int, db = Depends(get_db)):
        subject = crud.get_subject(db, subject_id)
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        return subject

    @app.post("/api/subjects")
    def create_subject(subject: schemas.SubjectCreate, db = Depends(get_db)):
        return crud.create_subject(db, subject)

    # ================== TEST SERIES ==================
    @app.get("/api/subjects/{subject_id}/test-series")
    def read_test_series_by_subject(subject_id: int, db = Depends(get_db)):
        return crud.get_test_series_by_subject(db, subject_id)

    @app.get("/api/test-series")
    def read_all_test_series(db = Depends(get_db)):
        return crud.get_all_test_series(db)

    @app.get("/api/test-series/{series_id}")
    def read_test_series(series_id: int, db = Depends(get_db)):
        series = crud.get_test_series(db, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Test series not found")
        return series

    @app.post("/api/test-series")
    def create_test_series(series: schemas.TestSeriesCreate, db = Depends(get_db)):
        return crud.create_test_series(db, series)

    @app.delete("/api/test-series/{series_id}")
    def delete_test_series(series_id: int, db = Depends(get_db)):
        series = crud.delete_test_series(db, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Test series not found")
        return {"message": "Test series deleted"}

    # ================== PDF RESOURCES ==================
    @app.get("/api/test-series/{series_id}/pdfs")
    def read_pdfs_by_series(series_id: int, db = Depends(get_db)):
        return crud.get_pdfs_by_test_series(db, series_id)

    @app.get("/api/pdfs")
    def read_all_pdfs(db = Depends(get_db)):
        return crud.get_all_pdfs(db)

    @app.post("/api/pdfs")
    def create_pdf(pdf: schemas.PDFResourceCreate, db = Depends(get_db)):
        return crud.create_pdf_resource(db, pdf)

    @app.delete("/api/pdfs/{pdf_id}")
    def delete_pdf(pdf_id: int, db = Depends(get_db)):
        pdf = crud.delete_pdf_resource(db, pdf_id)
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        return {"message": "PDF deleted"}

    # ================== MCQ TESTS ==================
    @app.get("/api/test-series/{series_id}/tests")
    def read_tests_by_series(series_id: int, db = Depends(get_db)):
        return crud.get_mcq_tests_by_test_series(db, series_id)

    @app.get("/api/tests")
    def read_all_tests(db = Depends(get_db)):
        return crud.get_all_mcq_tests(db)

    @app.get("/api/tests/{test_id}")
    def read_test(test_id: int, admin: bool = False, db = Depends(get_db)):
        test = crud.get_mcq_test(db, test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        all_questions = crud.get_questions_by_test(db, test_id)
        
        if admin:
            questions = [q.__dict__ for q in all_questions]
        else:
            questions_to_show = getattr(test, 'questions_to_show', 10) or 10
            if len(all_questions) <= questions_to_show:
                selected = all_questions
            else:
                selected = random.sample(all_questions, questions_to_show)
            questions = [q.__dict__ for q in selected]
        
        return {
            **test.__dict__,
            "questions": questions,
            "total_questions_in_bank": len(all_questions)
        }

    @app.post("/api/tests")
    def create_test(test: schemas.MCQTestCreate, db = Depends(get_db)):
        return crud.create_mcq_test(db, test)

    @app.put("/api/tests/{test_id}")
    def update_test(test_id: int, test: schemas.MCQTestCreate, db = Depends(get_db)):
        updated = crud.update_mcq_test(db, test_id, test)
        if not updated:
            raise HTTPException(status_code=404, detail="Test not found")
        return updated

    @app.delete("/api/tests/{test_id}")
    def delete_test(test_id: int, db = Depends(get_db)):
        test = crud.delete_mcq_test(db, test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        return {"message": "Test deleted"}

    # ================== MCQ QUESTIONS ==================
    @app.get("/api/tests/{test_id}/questions")
    def read_questions(test_id: int, db = Depends(get_db)):
        return crud.get_questions_by_test(db, test_id)

    @app.post("/api/questions")
    def create_question(question: schemas.MCQQuestionCreate, db = Depends(get_db)):
        return crud.create_mcq_question(db, question)

    @app.put("/api/questions/{question_id}")
    def update_question(question_id: int, question: schemas.MCQQuestionCreate, db = Depends(get_db)):
        updated = crud.update_mcq_question(db, question_id, question)
        if not updated:
            raise HTTPException(status_code=404, detail="Question not found")
        return updated

    @app.delete("/api/questions/{question_id}")
    def delete_question(question_id: int, db = Depends(get_db)):
        question = crud.delete_mcq_question(db, question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"message": "Question deleted"}

    @app.post("/api/seed")
    def seed_database(db = Depends(get_db)):
        messages = []
        try:
            # 0. RUN MIGRATION (Fix Image Uploads)
            try:
                from sqlalchemy import text
                # We use the existing engine from database module
                if engine.dialect.name != 'sqlite':
                    with engine.connect() as conn:
                        trans = conn.begin()
                        try:
                            conn.execute(text("ALTER TABLE students ALTER COLUMN image_url TYPE TEXT;"))
                            conn.execute(text("ALTER TABLE test_series ALTER COLUMN thumbnail_url TYPE TEXT;"))
                            conn.execute(text("ALTER TABLE mcq_questions ALTER COLUMN question_image_url TYPE TEXT;"))
                            conn.execute(text("ALTER TABLE courses ALTER COLUMN thumbnail_url TYPE TEXT;"))
                            trans.commit()
                            messages.append("Database Schema Migrated (Image Uploads Fixed).")
                        except Exception as e:
                            trans.rollback()
                            # Ignore error if columns are already TEXT
                            messages.append(f"Migration Note: {str(e)}")
            except Exception as e:
                messages.append(f"Migration Skipped: {str(e)}")

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

            for cls_info in classes:
                exists = db.query(models.AcademicClass).filter(models.AcademicClass.name == cls_info["name"]).first()
                if not exists:
                    db_cls = models.AcademicClass(
                        name=cls_info["name"],
                        display_name=cls_info["display_name"],
                        stream=cls_info.get("stream"),
                        order_index=cls_info["order"]
                    )
                    db.add(db_cls)
            db.commit()
            messages.append("Classes Seeded.")

            # 2. Seed Basic Subjects (Example for Class 10)
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
                        db_sub = models.Subject(
                            class_id=class_10.id,
                            name=sub["name"],
                            icon=sub["icon"],
                            color=sub["color"]
                        )
                        db.add(db_sub)
            
            db.commit()
            messages.append("Subjects Seeded.")
            
            return {"message": "Success", "details": messages}
        except Exception as e:
            print(f"Seeding error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    # ================== TEST ATTEMPTS & SCORING ==================
    @app.post("/api/tests/{test_id}/submit")
    def submit_test(test_id: int, attempt: schemas.TestAttemptCreate, time_taken: int = 0, db = Depends(get_db)):
        test = crud.get_mcq_test(db, test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        
        questions = crud.get_questions_by_test(db, test_id)
        
        try:
            student_answers = json.loads(attempt.answers_json)
        except:
            raise HTTPException(status_code=400, detail="Invalid answers format")
        
        score = 0
        correct = 0
        wrong = 0
        total_marks = 0
        
        for q in questions:
            total_marks += q.marks
            answer = student_answers.get(str(q.id))
            if answer:
                if answer.lower() == q.correct_option.lower():
                    score += q.marks
                    correct += 1
                else:
                    wrong += 1
        
        unanswered = len(questions) - correct - wrong
        
        db_attempt = crud.create_test_attempt(
            db, attempt, score, total_marks, correct, wrong, unanswered, time_taken
        )
        
        return {
            "id": db_attempt.id,
            "score": score,
            "total_marks": total_marks,
            "correct_answers": correct,
            "wrong_answers": wrong,
            "unanswered": unanswered,
            "percentage": round((score / total_marks * 100) if total_marks > 0 else 0, 2),
            "passed": score >= test.passing_marks
        }

    @app.get("/api/test-attempts")
    def read_test_attempts(test_id: Optional[int] = None, db = Depends(get_db)):
        if test_id:
            return crud.get_test_attempts(db, test_id)
        return crud.get_all_test_attempts(db)

    # ================== COURSES ==================
    @app.get("/api/courses")
    def read_courses(type: Optional[str] = None, db = Depends(get_db)):
        if type == "free":
            return crud.get_courses(db, is_free=True)
        elif type == "paid":
            return crud.get_courses(db, is_free=False)
        return crud.get_courses(db)

    @app.get("/api/courses/{course_id}")
    def read_course(course_id: int, db = Depends(get_db)):
        course = crud.get_course(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    @app.post("/api/courses")
    def create_course(course: schemas.CourseCreate, db = Depends(get_db)):
        return crud.create_course(db, course)

    @app.put("/api/courses/{course_id}")
    def update_course(course_id: int, course: schemas.CourseCreate, db = Depends(get_db)):
        updated = crud.update_course(db, course_id, course)
        if not updated:
            raise HTTPException(status_code=404, detail="Course not found")
        return updated

    @app.delete("/api/courses/{course_id}")
    def delete_course(course_id: int, db = Depends(get_db)):
        course = crud.delete_course(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return {"message": "Course deleted"}

    # ================== FILE UPLOAD ==================
    @app.post("/api/upload")
    @app.post("/api/upload")
    async def upload_image(file: UploadFile = File(...)):
        import base64
        contents = await file.read()
        encoded_string = base64.b64encode(contents).decode('utf-8')
        # Determine mime type roughly
        content_type = file.content_type if file.content_type else "image/jpeg"
        data_uri = f"data:{content_type};base64,{encoded_string}"
        return {"url": data_uri, "message": "Image converted to Base64 (Serverless compatible)"}


    @app.post("/api/upload-pdf")
    async def upload_pdf(file: UploadFile = File(...)):
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        return {
            "url": f"https://placeholder.com/{uuid.uuid4()}.pdf",
            "file_size": "Unknown",
            "message": "Use cloud storage in production"
        }

    # ================== EMERGENCY DATA FIX ==================
    @app.post("/api/fix-server-images")
    def fix_server_images(db = Depends(get_db)):
        """
        Emergency Tool: Compresses all existing heavy student images in the database.
        Call this ONCE to fix the 'disappearing students' issue.
        """
        try:
            from PIL import Image
            import io
            import base64
        except ImportError:
            return {"error": "Pillow not installed. Please add 'Pillow' to requirements.txt"}

        students = crud.get_students(db, limit=1000)
        report = []
        
        for s in students:
            if s.get("image_url") and s.get("image_url").startswith("data:image"):
                try:
                    # 1. Decode
                    header, encoded = s.get("image_url").split(",", 1)
                    data = base64.b64decode(encoded)
                    
                    # 2. Check size (skip if already small < 500KB)
                    if len(data) < 500 * 1024:
                        report.append(f"Skipped Student {s.get('id')} (Size ok: {len(data)//1024}KB)")
                        continue

                    # 3. Compress (Aggressive for LocalStorage)
                    img = Image.open(io.BytesIO(data))
                    img = img.convert("RGB") # Ensure RGB for JPEG
                    img.thumbnail((400, 400)) # Resize to matching card size
                    
                    buffer = io.BytesIO()
                    img.save(buffer, format="JPEG", quality=50, optimize=True)
                    new_data = buffer.getvalue()
                    
                    # 4. Re-encode
                    new_base64 = base64.b64encode(new_data).decode('utf-8')
                    # Update in firestore
                    new_url = f"data:image/jpeg;base64,{new_base64}"
                    crud.firestore_db.collection("students").document(str(s.get('id'))).update({"image_url": new_url})
                    
                    report.append(f"Fixed Student {s.get('id')}: {len(data)//1024}KB -> {len(new_data)//1024}KB")
                except Exception as e:
                    report.append(f"Error Student {s.get('id')}: {str(e)}")
        
        return {"status": "Complete", "report": report}


# ================== BOARDS DATA (No DB required) ==================
try:
    from boards_data import BOARDS_DATA
except ImportError:
    try:
        from .boards_data import BOARDS_DATA
    except ImportError:
        BOARDS_DATA = {}

@app.get("/api/boards")
def get_boards():
    """Return the full board → class → subject → chapter hierarchy"""
    return BOARDS_DATA

class GenerateMCQRequest(BaseModel):
    board: str
    class_name: str
    subject: str
    chapter: str
    api_key: str = ""

@app.post("/api/generate-mcq")
def generate_mcq(request: GenerateMCQRequest, db = Depends(get_db)):
    """Generate 10 MCQ questions using OpenAI for a given board/class/subject/chapter"""
    import datetime
    
    # Validate the inputs against boards data
    if request.board not in BOARDS_DATA:
        raise HTTPException(status_code=400, detail=f"Invalid board: {request.board}")
    board_data = BOARDS_DATA[request.board]
    if request.class_name not in board_data:
        raise HTTPException(status_code=400, detail=f"Invalid class: {request.class_name}")
    class_data = board_data[request.class_name]
    if request.subject not in class_data:
        raise HTTPException(status_code=400, detail=f"Invalid subject: {request.subject}")
    chapters = class_data[request.subject]
    if request.chapter not in chapters:
        raise HTTPException(status_code=400, detail=f"Invalid chapter: {request.chapter}")
    
    # Use provided API key or fallback to hardcoded
    api_key = request.api_key.strip() if request.api_key.strip() else os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=400, detail="OpenAI API key is required")
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
    except ImportError:
        raise HTTPException(status_code=500, detail="OpenAI package not installed. Add 'openai' to requirements.txt")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI initialization failed: {str(e)}")
    
    # Build the prompt
    prompt = f"""You are an expert teacher creating MCQ questions for students.

Board: {request.board}
Class: {request.class_name}
Subject: {request.subject}
Chapter: {request.chapter}

Generate exactly 10 multiple choice questions for this chapter. The questions should:
- Be appropriate for the class level
- Cover key concepts from the chapter
- Have 4 options (A, B, C, D) each
- Have exactly one correct answer
- Include a brief explanation for the correct answer
- Mix easy, medium, and hard difficulty levels

Return ONLY a valid JSON array with exactly 10 objects. Each object must have these exact keys:
[
  {{
    "question": "The question text",
    "option_a": "Option A text",
    "option_b": "Option B text",
    "option_c": "Option C text",
    "option_d": "Option D text",
    "correct_option": "a",
    "explanation": "Brief explanation of why this is correct"
  }}
]

The correct_option must be lowercase: "a", "b", "c", or "d".
Return ONLY the JSON array, no other text."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a JSON-only question generator. Return ONLY valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000,
        )
        
        content = response.choices[0].message.content.strip()
        # Clean up markdown code blocks if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
        
        questions_data = json.loads(content)
        
        if not isinstance(questions_data, list) or len(questions_data) == 0:
            raise HTTPException(status_code=500, detail="OpenAI returned invalid format")
            
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse OpenAI response as JSON: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    
    # Now save to database
    if not DB_AVAILABLE or db is None:
        # Return without saving if DB is down
        return {
            "message": "Generated but DB unavailable - questions not saved",
            "questions": questions_data
        }
    
    try:
        now = datetime.datetime.now().isoformat()
        
        # Find or create academic class
        classes = crud.get_academic_classes(db)
        db_class = next((c for c in classes if c.get("name") == request.class_name), None)
        
        if not db_class:
            db_class = crud.create_academic_class(db, schemas.AcademicClassCreate(
                name=request.class_name,
                display_name=request.class_name,
                stream="science" if any(s in request.subject.lower() for s in ["physics", "chemistry", "biology"]) else None,
                order_index=0
            ))
        
        # Find or create subject
        subjects = crud.get_subjects_by_class(db, db_class.id)
        db_subject = next((s for s in subjects if s.get("name") == request.subject), None)
        
        if not db_subject:
            icons = {"Mathematics": "📐", "Physics": "⚡", "Chemistry": "🧪", "Biology": "🧬", "Science": "🔬", "English": "📖", "Social Science": "🌍"}
            colors = {"Mathematics": "#4CAF50", "Physics": "#2196F3", "Chemistry": "#FF9800", "Biology": "#8BC34A", "Science": "#2196F3", "English": "#9C27B0", "Social Science": "#FF5722"}
            db_subject = crud.create_subject(db, schemas.SubjectCreate(
                class_id=db_class.id,
                name=request.subject,
                icon=icons.get(request.subject, "📚"),
                color=colors.get(request.subject, "#D4AF37"),
                order_index=0
            ))
        
        # Find or create test series for this subject
        series_title = f"{request.board} - {request.class_name} {request.subject}"
        series_list = crud.get_test_series_by_subject(db, db_subject.id)
        db_series = next((s for s in series_list if s.get("title") == series_title), None)
        
        if not db_series:
            db_series = crud.create_test_series(db, schemas.TestSeriesCreate(
                subject_id=db_subject.id,
                title=series_title,
                description=f"AI-Generated MCQ tests for {request.board} {request.class_name} - {request.subject}",
                is_free=True,
                price=0,
                order_index=0
            ))
        
        # Create the MCQ test
        test_title = f"{request.chapter} ({request.board})"
        num_questions = len(questions_data)
        
        db_test = crud.create_mcq_test(db, schemas.MCQTestCreate(
            test_series_id=db_series.id,
            title=test_title,
            description=f"AI-Generated MCQ test for {request.board} - {request.class_name} - {request.subject} - {request.chapter}",
            total_questions=num_questions,
            questions_to_show=num_questions,
            total_marks=num_questions,
            duration_minutes=15,
            passing_marks=int(num_questions * 0.4),
            is_active=True
        ))
        
        # Create all questions
        saved_questions = []
        for idx, q in enumerate(questions_data):
            db_question = crud.create_mcq_question(db, schemas.MCQQuestionCreate(
                test_id=db_test.id,
                question_text=q.get("question", ""),
                option_a=q.get("option_a", ""),
                option_b=q.get("option_b", ""),
                option_c=q.get("option_c", ""),
                option_d=q.get("option_d", ""),
                correct_option=q.get("correct_option", "a").lower(),
                marks=1,
                explanation=q.get("explanation", ""),
                order_index=idx
            ))
            saved_questions.append({
                "question_text": db_question.question_text,
                "option_a": db_question.option_a,
                "option_b": db_question.option_b,
                "option_c": db_question.option_c,
                "option_d": db_question.option_d,
                "correct_option": db_question.correct_option,
                "explanation": db_question.explanation
            })
        
        return {
            "message": "MCQ test generated and saved successfully!",
            "test": {
                "id": db_test.id,
                "title": db_test.title,
                "description": db_test.description,
                "total_questions": db_test.total_questions,
                "duration_minutes": db_test.duration_minutes,
                "board": request.board,
                "class_name": request.class_name,
                "subject": request.subject,
                "chapter": request.chapter,
                "series_title": series_title
            },
            "questions": saved_questions
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save to database: {str(e)}")


@app.get("/api/generated-tests")
def get_generated_tests(db = Depends(get_db)):
    """List all MCQ tests with their series info, most recent first"""
    if not DB_AVAILABLE or db is None:
        return []
    try:
        tests = crud.get_all_mcq_tests(db)
        tests.sort(key=lambda x: x.get("id", 0), reverse=True)
        result = []
        for t in tests:
            series = crud.get_test_series(db, t.get("test_series_id"))
            result.append({
                "id": t.get("id"),
                "title": t.get("title"),
                "description": t.get("description"),
                "total_questions": t.get("total_questions"),
                "total_marks": t.get("total_marks"),
                "duration_minutes": t.get("duration_minutes"),
                "created_at": t.get("created_at"),
                "series_title": series.get("title") if series else "Unknown"
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/generated-tests/{test_id}")
def delete_generated_test(test_id: int, db = Depends(get_db)):
    """Delete a generated test and all its questions"""
    if not DB_AVAILABLE or db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        crud.delete_mcq_test(db, test_id)
        # Note: delete_mcq_test already deletes questions natively. Wait, we also need to delete TestAttempts?
        # We can implement that dynamically
        docs = firestore_db.collection("test_attempts").where(filter=FieldFilter("test_id", "==", test_id)).get()
        for doc in docs:
            doc.reference.delete()
        
        return {"message": "Test deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
