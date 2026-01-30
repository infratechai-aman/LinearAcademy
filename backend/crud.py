from sqlalchemy.orm import Session
from . import models, schemas
import datetime

# --- Site Config ---
def get_site_config(db: Session):
    return db.query(models.SiteConfig).first()

def create_or_update_site_config(db: Session, config: schemas.SiteConfigCreate):
    db_config = db.query(models.SiteConfig).first()
    if db_config:
        # Update
        for key, value in config.dict().items():
            setattr(db_config, key, value)
    else:
        # Create
        db_config = models.SiteConfig(**config.dict())
        db.add(db_config)
    
    db.commit()
    db.refresh(db_config)
    return db_config

# --- Student ---
def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
    return db_student

# --- Enquiry ---
def create_enquiry(db: Session, enquiry: schemas.EnquiryCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_enquiry = models.Enquiry(**enquiry.dict(), created_at=created_at)
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return db_enquiry

def get_enquiries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Enquiry).order_by(models.Enquiry.id.desc()).offset(skip).limit(limit).all()

# --- Admin ---
def get_admin_by_username(db: Session, username: str):
    return db.query(models.Admin).filter(models.Admin.username == username).first()

def create_admin(db: Session, admin: schemas.AdminCreate):
    # Note: Password hashing should happen before calling this or inside this
    fake_hashed_password = admin.password + "notreallyhashed" 
    db_admin = models.Admin(username=admin.username, hashed_password=fake_hashed_password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# --- Demo Booking ---
def create_demo_booking(db: Session, booking: schemas.DemoBookingCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_booking = models.DemoBooking(**booking.dict(), created_at=created_at)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_demo_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DemoBooking).order_by(models.DemoBooking.id.desc()).offset(skip).limit(limit).all()

def update_demo_booking_status(db: Session, booking_id: int, status: str):
    db_booking = db.query(models.DemoBooking).filter(models.DemoBooking.id == booking_id).first()
    if db_booking:
        db_booking.status = status
        db.commit()
        db.refresh(db_booking)
    return db_booking

def delete_demo_booking(db: Session, booking_id: int):
    db_booking = db.query(models.DemoBooking).filter(models.DemoBooking.id == booking_id).first()
    if db_booking:
        db.delete(db_booking)
        db.commit()
    return db_booking


# ================== ACADEMIC CLASSES ==================

def get_academic_classes(db: Session):
    return db.query(models.AcademicClass).filter(models.AcademicClass.is_active == True).order_by(models.AcademicClass.order_index).all()

def get_academic_class(db: Session, class_id: int):
    return db.query(models.AcademicClass).filter(models.AcademicClass.id == class_id).first()

def create_academic_class(db: Session, academic_class: schemas.AcademicClassCreate):
    db_class = models.AcademicClass(**academic_class.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


# ================== SUBJECTS ==================

def get_subjects_by_class(db: Session, class_id: int):
    return db.query(models.Subject).filter(
        models.Subject.class_id == class_id,
        models.Subject.is_active == True
    ).order_by(models.Subject.order_index).all()

def get_subject(db: Session, subject_id: int):
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def get_all_subjects(db: Session):
    return db.query(models.Subject).filter(models.Subject.is_active == True).all()


# ================== TEST SERIES ==================

def get_test_series_by_subject(db: Session, subject_id: int):
    return db.query(models.TestSeries).filter(
        models.TestSeries.subject_id == subject_id,
        models.TestSeries.is_active == True
    ).order_by(models.TestSeries.order_index).all()

def get_test_series(db: Session, series_id: int):
    return db.query(models.TestSeries).filter(models.TestSeries.id == series_id).first()

def create_test_series(db: Session, series: schemas.TestSeriesCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_series = models.TestSeries(**series.dict(), created_at=created_at)
    db.add(db_series)
    db.commit()
    db.refresh(db_series)
    return db_series

def get_all_test_series(db: Session):
    return db.query(models.TestSeries).filter(models.TestSeries.is_active == True).all()

def delete_test_series(db: Session, series_id: int):
    db_series = db.query(models.TestSeries).filter(models.TestSeries.id == series_id).first()
    if db_series:
        db.delete(db_series)
        db.commit()
    return db_series


# ================== PDF RESOURCES ==================

def get_pdfs_by_test_series(db: Session, test_series_id: int):
    return db.query(models.PDFResource).filter(
        models.PDFResource.test_series_id == test_series_id,
        models.PDFResource.is_active == True
    ).all()

def create_pdf_resource(db: Session, pdf: schemas.PDFResourceCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_pdf = models.PDFResource(**pdf.dict(), created_at=created_at)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def delete_pdf_resource(db: Session, pdf_id: int):
    db_pdf = db.query(models.PDFResource).filter(models.PDFResource.id == pdf_id).first()
    if db_pdf:
        db.delete(db_pdf)
        db.commit()
    return db_pdf

def get_all_pdfs(db: Session):
    return db.query(models.PDFResource).filter(models.PDFResource.is_active == True).all()


# ================== MCQ TESTS ==================

def get_mcq_tests_by_test_series(db: Session, test_series_id: int):
    return db.query(models.MCQTest).filter(
        models.MCQTest.test_series_id == test_series_id,
        models.MCQTest.is_active == True
    ).all()

def get_mcq_test(db: Session, test_id: int):
    return db.query(models.MCQTest).filter(models.MCQTest.id == test_id).first()

def create_mcq_test(db: Session, test: schemas.MCQTestCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_test = models.MCQTest(**test.dict(), created_at=created_at)
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

def update_mcq_test(db: Session, test_id: int, test: schemas.MCQTestCreate):
    db_test = db.query(models.MCQTest).filter(models.MCQTest.id == test_id).first()
    if db_test:
        for key, value in test.dict().items():
            setattr(db_test, key, value)
        db.commit()
        db.refresh(db_test)
    return db_test

def delete_mcq_test(db: Session, test_id: int):
    db_test = db.query(models.MCQTest).filter(models.MCQTest.id == test_id).first()
    if db_test:
        # Also delete questions
        db.query(models.MCQQuestion).filter(models.MCQQuestion.test_id == test_id).delete()
        db.delete(db_test)
        db.commit()
    return db_test

def get_all_mcq_tests(db: Session):
    return db.query(models.MCQTest).filter(models.MCQTest.is_active == True).all()


# ================== MCQ QUESTIONS ==================

def get_questions_by_test(db: Session, test_id: int):
    return db.query(models.MCQQuestion).filter(
        models.MCQQuestion.test_id == test_id
    ).order_by(models.MCQQuestion.order_index).all()

def create_mcq_question(db: Session, question: schemas.MCQQuestionCreate):
    db_question = models.MCQQuestion(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    # Update test question count
    test = db.query(models.MCQTest).filter(models.MCQTest.id == question.test_id).first()
    if test:
        test.total_questions = db.query(models.MCQQuestion).filter(models.MCQQuestion.test_id == question.test_id).count()
        test.total_marks = sum([q.marks for q in db.query(models.MCQQuestion).filter(models.MCQQuestion.test_id == question.test_id).all()])
        db.commit()
    
    return db_question

def update_mcq_question(db: Session, question_id: int, question: schemas.MCQQuestionCreate):
    db_question = db.query(models.MCQQuestion).filter(models.MCQQuestion.id == question_id).first()
    if db_question:
        for key, value in question.dict().items():
            setattr(db_question, key, value)
        db.commit()
        db.refresh(db_question)
    return db_question

def delete_mcq_question(db: Session, question_id: int):
    db_question = db.query(models.MCQQuestion).filter(models.MCQQuestion.id == question_id).first()
    if db_question:
        test_id = db_question.test_id
        db.delete(db_question)
        db.commit()
        
        # Update test question count
        test = db.query(models.MCQTest).filter(models.MCQTest.id == test_id).first()
        if test:
            test.total_questions = db.query(models.MCQQuestion).filter(models.MCQQuestion.test_id == test_id).count()
            test.total_marks = sum([q.marks for q in db.query(models.MCQQuestion).filter(models.MCQQuestion.test_id == test_id).all()])
            db.commit()
    return db_question


# ================== TEST ATTEMPTS ==================

def create_test_attempt(db: Session, attempt: schemas.TestAttemptCreate, score: int, total_marks: int, 
                        correct: int, wrong: int, unanswered: int, time_taken: int):
    completed_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_attempt = models.TestAttempt(
        test_id=attempt.test_id,
        student_name=attempt.student_name,
        student_email=attempt.student_email,
        student_phone=attempt.student_phone,
        score=score,
        total_marks=total_marks,
        correct_answers=correct,
        wrong_answers=wrong,
        unanswered=unanswered,
        time_taken_seconds=time_taken,
        answers_json=attempt.answers_json,
        completed_at=completed_at
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

def get_test_attempts(db: Session, test_id: int = None):
    query = db.query(models.TestAttempt)
    if test_id:
        query = query.filter(models.TestAttempt.test_id == test_id)
    return query.order_by(models.TestAttempt.id.desc()).all()

def get_all_test_attempts(db: Session):
    return db.query(models.TestAttempt).order_by(models.TestAttempt.id.desc()).limit(100).all()


# ================== COURSES ==================

def get_courses(db: Session, is_free: bool = None):
    query = db.query(models.Course).filter(models.Course.is_active == True)
    if is_free is not None:
        query = query.filter(models.Course.is_free == is_free)
    return query.order_by(models.Course.order_index).all()

def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def create_course(db: Session, course: schemas.CourseCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_course = models.Course(**course.dict(), created_at=created_at)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: int, course: schemas.CourseCreate):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        for key, value in course.dict().items():
            setattr(db_course, key, value)
        db.commit()
        db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        db.delete(db_course)
        db.commit()
    return db_course


