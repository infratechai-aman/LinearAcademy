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
def login(creds: LoginRequest):
    """
    Login endpoint - works even if database is down.
    Accepts JSON body via Pydantic model.
    """
    # Simple hardcoded auth to ensure admin access in emergency
    if creds.username == "amaan@linearacademy" and creds.password == "Amaan@786":
         # In a real scenario ideally we check DB, but this bypass allows fixing config 
         # even if DB connection is broken
        return {"access_token": "fake-token", "token_type": "bearer"}
    
    # If DB is available, we could check there too, but let's keep it simple for stability
    raise HTTPException(status_code=400, detail="Incorrect username or password")

# Try to import database modules - if this fails, we still have login working
DB_AVAILABLE = False
Base = None
engine = None
get_db = None
SessionLocal = None
models = None
schemas = None
crud = None

try:
    # Add current directory to path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    from database import Base as _Base, engine as _engine, get_db as _get_db, SessionLocal as _SessionLocal
    import models as _models
    import schemas as _schemas
    import crud as _crud
    
    Base = _Base
    engine = _engine
    get_db = _get_db
    SessionLocal = _SessionLocal
    models = _models
    schemas = _schemas
    crud = _crud
    
    if engine is not None:
        try:
            Base.metadata.create_all(bind=engine)
            DB_AVAILABLE = True
        except Exception as e:
            print(f"Error creating tables: {e}")
except Exception as e:
    print(f"WARNING: Database modules failed to load: {e}")
    # We continue without DB functionality

# Only define database-dependent endpoints if DB is available
if DB_AVAILABLE and schemas is not None:
    from sqlalchemy.orm import Session
    
    # ================== SITE CONFIG ==================
    @app.get("/api/config")
    def read_config(db: Session = Depends(get_db)):
        try:
            config = crud.get_site_config(db)
            if config is None:
                return {
                    "id": 0,
                    "phone_number": "+91 98765 43210", 
                    "email": "info@linearclasses.com", 
                    "address": "191, Nagpur Chawl, Yerawada, Pune - 411006, Maharashtra, India"
                }
            return config
        except Exception as e:
             raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/config")
    def update_config(config: schemas.SiteConfigCreate, db: Session = Depends(get_db)):
        return crud.create_or_update_site_config(db, config)

    # ================== STUDENTS ==================
    @app.get("/api/students")
    def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        return crud.get_students(db, skip=skip, limit=limit)

    @app.post("/api/students")
    def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
        return crud.create_student(db, student)

    @app.delete("/api/students/{student_id}")
    def delete_student(student_id: int, db: Session = Depends(get_db)):
        return crud.delete_student(db, student_id)

    # ================== ENQUIRIES ==================
    @app.post("/api/enquiries")
    def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(get_db)):
        return crud.create_enquiry(db, enquiry)

    @app.get("/api/enquiries")
    def read_enquiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        return crud.get_enquiries(db, skip=skip, limit=limit)

    # ================== DEMO BOOKINGS ==================
    @app.post("/api/demo-bookings")
    def create_demo_booking(booking: schemas.DemoBookingCreate, db: Session = Depends(get_db)):
        return crud.create_demo_booking(db, booking)

    @app.get("/api/demo-bookings")
    def read_demo_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        return crud.get_demo_bookings(db, skip=skip, limit=limit)

    @app.put("/api/demo-bookings/{booking_id}/status")
    def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
        booking = crud.update_demo_booking_status(db, booking_id, status)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking

    @app.delete("/api/demo-bookings/{booking_id}")
    def delete_demo_booking(booking_id: int, db: Session = Depends(get_db)):
        booking = crud.delete_demo_booking(db, booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return {"message": "Booking deleted successfully"}

    # ================== ACADEMIC CLASSES ==================
    @app.get("/api/classes")
    def read_classes(db: Session = Depends(get_db)):
        return crud.get_academic_classes(db)

    @app.get("/api/classes/{class_id}")
    def read_class(class_id: int, db: Session = Depends(get_db)):
        cls = crud.get_academic_class(db, class_id)
        if not cls:
            raise HTTPException(status_code=404, detail="Class not found")
        return cls

    @app.post("/api/classes")
    def create_class(academic_class: schemas.AcademicClassCreate, db: Session = Depends(get_db)):
        return crud.create_academic_class(db, academic_class)

    # ================== SUBJECTS ==================
    @app.get("/api/classes/{class_id}/subjects")
    def read_subjects_by_class(class_id: int, db: Session = Depends(get_db)):
        return crud.get_subjects_by_class(db, class_id)

    @app.get("/api/subjects")
    def read_all_subjects(db: Session = Depends(get_db)):
        return crud.get_all_subjects(db)

    @app.get("/api/subjects/{subject_id}")
    def read_subject(subject_id: int, db: Session = Depends(get_db)):
        subject = crud.get_subject(db, subject_id)
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        return subject

    @app.post("/api/subjects")
    def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
        return crud.create_subject(db, subject)

    # ================== TEST SERIES ==================
    @app.get("/api/subjects/{subject_id}/test-series")
    def read_test_series_by_subject(subject_id: int, db: Session = Depends(get_db)):
        return crud.get_test_series_by_subject(db, subject_id)

    @app.get("/api/test-series")
    def read_all_test_series(db: Session = Depends(get_db)):
        return crud.get_all_test_series(db)

    @app.get("/api/test-series/{series_id}")
    def read_test_series(series_id: int, db: Session = Depends(get_db)):
        series = crud.get_test_series(db, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Test series not found")
        return series

    @app.post("/api/test-series")
    def create_test_series(series: schemas.TestSeriesCreate, db: Session = Depends(get_db)):
        return crud.create_test_series(db, series)

    @app.delete("/api/test-series/{series_id}")
    def delete_test_series(series_id: int, db: Session = Depends(get_db)):
        series = crud.delete_test_series(db, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Test series not found")
        return {"message": "Test series deleted"}

    # ================== PDF RESOURCES ==================
    @app.get("/api/test-series/{series_id}/pdfs")
    def read_pdfs_by_series(series_id: int, db: Session = Depends(get_db)):
        return crud.get_pdfs_by_test_series(db, series_id)

    @app.get("/api/pdfs")
    def read_all_pdfs(db: Session = Depends(get_db)):
        return crud.get_all_pdfs(db)

    @app.post("/api/pdfs")
    def create_pdf(pdf: schemas.PDFResourceCreate, db: Session = Depends(get_db)):
        return crud.create_pdf_resource(db, pdf)

    @app.delete("/api/pdfs/{pdf_id}")
    def delete_pdf(pdf_id: int, db: Session = Depends(get_db)):
        pdf = crud.delete_pdf_resource(db, pdf_id)
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        return {"message": "PDF deleted"}

    # ================== MCQ TESTS ==================
    @app.get("/api/test-series/{series_id}/tests")
    def read_tests_by_series(series_id: int, db: Session = Depends(get_db)):
        return crud.get_mcq_tests_by_test_series(db, series_id)

    @app.get("/api/tests")
    def read_all_tests(db: Session = Depends(get_db)):
        return crud.get_all_mcq_tests(db)

    @app.get("/api/tests/{test_id}")
    def read_test(test_id: int, admin: bool = False, db: Session = Depends(get_db)):
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
    def create_test(test: schemas.MCQTestCreate, db: Session = Depends(get_db)):
        return crud.create_mcq_test(db, test)

    @app.put("/api/tests/{test_id}")
    def update_test(test_id: int, test: schemas.MCQTestCreate, db: Session = Depends(get_db)):
        updated = crud.update_mcq_test(db, test_id, test)
        if not updated:
            raise HTTPException(status_code=404, detail="Test not found")
        return updated

    @app.delete("/api/tests/{test_id}")
    def delete_test(test_id: int, db: Session = Depends(get_db)):
        test = crud.delete_mcq_test(db, test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        return {"message": "Test deleted"}

    # ================== MCQ QUESTIONS ==================
    @app.get("/api/tests/{test_id}/questions")
    def read_questions(test_id: int, db: Session = Depends(get_db)):
        return crud.get_questions_by_test(db, test_id)

    @app.post("/api/questions")
    def create_question(question: schemas.MCQQuestionCreate, db: Session = Depends(get_db)):
        return crud.create_mcq_question(db, question)

    @app.put("/api/questions/{question_id}")
    def update_question(question_id: int, question: schemas.MCQQuestionCreate, db: Session = Depends(get_db)):
        updated = crud.update_mcq_question(db, question_id, question)
        if not updated:
            raise HTTPException(status_code=404, detail="Question not found")
        return updated

    @app.delete("/api/questions/{question_id}")
    def delete_question(question_id: int, db: Session = Depends(get_db)):
        question = crud.delete_mcq_question(db, question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"message": "Question deleted"}

    # ================== TEST ATTEMPTS & SCORING ==================
    @app.post("/api/tests/{test_id}/submit")
    def submit_test(test_id: int, attempt: schemas.TestAttemptCreate, time_taken: int = 0, db: Session = Depends(get_db)):
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
    def read_test_attempts(test_id: Optional[int] = None, db: Session = Depends(get_db)):
        if test_id:
            return crud.get_test_attempts(db, test_id)
        return crud.get_all_test_attempts(db)

    # ================== COURSES ==================
    @app.get("/api/courses")
    def read_courses(type: Optional[str] = None, db: Session = Depends(get_db)):
        if type == "free":
            return crud.get_courses(db, is_free=True)
        elif type == "paid":
            return crud.get_courses(db, is_free=False)
        return crud.get_courses(db)

    @app.get("/api/courses/{course_id}")
    def read_course(course_id: int, db: Session = Depends(get_db)):
        course = crud.get_course(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    @app.post("/api/courses")
    def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
        return crud.create_course(db, course)

    @app.put("/api/courses/{course_id}")
    def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
        updated = crud.update_course(db, course_id, course)
        if not updated:
            raise HTTPException(status_code=404, detail="Course not found")
        return updated

    @app.delete("/api/courses/{course_id}")
    def delete_course(course_id: int, db: Session = Depends(get_db)):
        course = crud.delete_course(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return {"message": "Course deleted"}

    # ================== FILE UPLOAD ==================
    @app.post("/api/upload")
    async def upload_image(file: UploadFile = File(...)):
        return {"url": f"https://placeholder.com/{uuid.uuid4()}.jpg", "message": "Use cloud storage in production"}

    @app.post("/api/upload-pdf")
    async def upload_pdf(file: UploadFile = File(...)):
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        return {
            "url": f"https://placeholder.com/{uuid.uuid4()}.pdf",
            "file_size": "Unknown",
            "message": "Use cloud storage in production"
        }

# Vercel handler
handler = app
