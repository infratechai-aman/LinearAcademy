from sqlalchemy import Boolean, Column, Integer, String, Text
from .database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, default="+91 98765 43210")
    email = Column(String, default="info@linearclasses.com")
    address = Column(Text, default="191, Nagpur Chawl, Yerawada, Pune - 411006, Maharashtra, India")
    facebook_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    whatsapp_number = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    rank = Column(String) # e.g., "98.5% - Class 10"
    image_url = Column(Text)
    description = Column(Text)
    is_active = Column(Boolean, default=True)

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    phone = Column(String)
    course_interest = Column(String)
    message = Column(Text)
    created_at = Column(String) # Storing as string or datetime

class DemoBooking(Base):
    __tablename__ = "demo_bookings"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String)
    parent_name = Column(String)
    email = Column(String)
    phone = Column(String)
    class_interested = Column(String)  # e.g., "Class 9th", "Class 10th", etc.
    preferred_subject = Column(String)  # Topic they want to learn
    preferred_date = Column(String)
    preferred_time = Column(String)
    message = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    created_at = Column(String)


# ================== TEST SERIES MODELS ==================

class AcademicClass(Base):
    """Academic classes from 8th to 12th with streams"""
    __tablename__ = "academic_classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # e.g., "Class 8th", "Class 11th Science"
    display_name = Column(String)  # e.g., "8th Standard", "11th Science"
    stream = Column(String, nullable=True)  # "science", "commerce", or null for 8-10
    order_index = Column(Integer, default=0)  # For sorting
    is_active = Column(Boolean, default=True)


class Subject(Base):
    """Subjects within each class"""
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, index=True)  # ForeignKey to AcademicClass
    name = Column(String)  # e.g., "Science 1", "Physics"
    icon = Column(String, nullable=True)  # Icon name or emoji
    color = Column(String, default="#D4AF37")  # Subject color
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


class TestSeries(Base):
    """Test series container for a subject"""
    __tablename__ = "test_series"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, index=True)  # ForeignKey to Subject
    title = Column(String)
    description = Column(Text, nullable=True)
    is_free = Column(Boolean, default=True)
    price = Column(Integer, default=0)  # Price in INR
    discount_price = Column(Integer, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(String)


class PDFResource(Base):
    """PDF study materials"""
    __tablename__ = "pdf_resources"

    id = Column(Integer, primary_key=True, index=True)
    test_series_id = Column(Integer, index=True)  # ForeignKey to TestSeries
    title = Column(String)
    description = Column(Text, nullable=True)
    file_url = Column(String)  # URL or path to PDF
    file_size = Column(String, nullable=True)  # e.g., "2.5 MB"
    download_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(String)


class MCQTest(Base):
    """MCQ test within a test series"""
    __tablename__ = "mcq_tests"

    id = Column(Integer, primary_key=True, index=True)
    test_series_id = Column(Integer, index=True)  # ForeignKey to TestSeries
    title = Column(String)
    description = Column(Text, nullable=True)
    total_questions = Column(Integer, default=0)  # Total questions in bank
    questions_to_show = Column(Integer, default=10)  # How many to show per test (random selection)
    total_marks = Column(Integer, default=0)
    duration_minutes = Column(Integer, default=60)
    passing_marks = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(String)



class MCQQuestion(Base):
    """Individual MCQ question"""
    __tablename__ = "mcq_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, index=True)  # ForeignKey to MCQTest
    question_text = Column(Text)
    question_image_url = Column(Text, nullable=True)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_option = Column(String)  # 'a', 'b', 'c', or 'd'
    marks = Column(Integer, default=1)
    explanation = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)


class TestAttempt(Base):
    """Student test attempt record"""
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, index=True)  # ForeignKey to MCQTest
    student_name = Column(String)
    student_email = Column(String, nullable=True)
    student_phone = Column(String, nullable=True)
    score = Column(Integer, default=0)
    total_marks = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    unanswered = Column(Integer, default=0)
    time_taken_seconds = Column(Integer, default=0)
    answers_json = Column(Text, nullable=True)  # JSON string of answers
    completed_at = Column(String)


# ================== COURSES MODELS ==================

class Course(Base):
    """Courses (Free and Paid)"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    thumbnail_url = Column(Text, nullable=True)
    class_id = Column(Integer, nullable=True)  # Optional class association
    is_free = Column(Boolean, default=True)
    price = Column(Integer, default=0)
    discount_price = Column(Integer, nullable=True)
    duration = Column(String, nullable=True)  # e.g., "12 hours"
    lessons_count = Column(Integer, default=0)
    instructor_name = Column(String, nullable=True)
    video_url = Column(String, nullable=True)  # YouTube or video link
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(String)


