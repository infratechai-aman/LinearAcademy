from pydantic import BaseModel
from typing import Optional, List

# --- Site Config ---
class SiteConfigBase(BaseModel):
    phone_number: str
    email: str
    address: str
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    youtube_url: Optional[str] = None

class SiteConfigCreate(SiteConfigBase):
    pass

class SiteConfig(SiteConfigBase):
    id: int
    class Config:
        from_attributes = True

# --- Student ---
class StudentBase(BaseModel):
    name: str
    rank: str
    image_url: str
    description: str
    is_active: bool = True

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    class Config:
        from_attributes = True

# --- Enquiry ---
class EnquiryBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    course_interest: str
    message: str

class EnquiryCreate(EnquiryBase):
    pass

class Enquiry(EnquiryBase):
    id: int
    created_at: Optional[str] = None
    class Config:
        from_attributes = True

# --- Admin ---
class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Demo Booking ---
class DemoBookingBase(BaseModel):
    student_name: str
    parent_name: str
    email: str
    phone: str
    class_interested: str
    preferred_subject: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None

class DemoBookingCreate(DemoBookingBase):
    pass

class DemoBooking(DemoBookingBase):
    id: int
    status: str = "pending"
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# ================== TEST SERIES SCHEMAS ==================

# --- Academic Class ---
class AcademicClassBase(BaseModel):
    name: str
    display_name: str
    board: Optional[str] = None
    stream: Optional[str] = None
    order_index: int = 0
    is_active: bool = True

class AcademicClassCreate(AcademicClassBase):
    pass

class AcademicClass(AcademicClassBase):
    id: int
    class Config:
        from_attributes = True


# --- Subject ---
class SubjectBase(BaseModel):
    class_id: int
    name: str
    board: Optional[str] = None
    icon: Optional[str] = None
    color: str = "#D4AF37"
    order_index: int = 0
    is_active: bool = True

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    class Config:
        from_attributes = True


# --- Test Series ---
class TestSeriesBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    is_free: bool = True
    price: int = 0
    discount_price: Optional[int] = None
    thumbnail_url: Optional[str] = None
    order_index: int = 0
    is_active: bool = True

class TestSeriesCreate(TestSeriesBase):
    pass

class TestSeries(TestSeriesBase):
    id: int
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# --- PDF Resource ---
class PDFResourceBase(BaseModel):
    test_series_id: int
    title: str
    description: Optional[str] = None
    file_url: str
    file_size: Optional[str] = None

class PDFResourceCreate(PDFResourceBase):
    pass

class PDFResource(PDFResourceBase):
    id: int
    download_count: int = 0
    is_active: bool = True
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# --- MCQ Test ---
class MCQTestBase(BaseModel):
    test_series_id: int
    title: str
    description: Optional[str] = None
    total_questions: int = 0  # Total questions in bank
    questions_to_show: int = 10  # How many random questions shown to users
    total_marks: int = 0
    duration_minutes: int = 60
    passing_marks: int = 0
    is_active: bool = True

class MCQTestCreate(MCQTestBase):
    pass

class MCQTest(MCQTestBase):
    id: int
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# --- MCQ Question ---
class MCQQuestionBase(BaseModel):
    test_id: int
    question_text: str
    question_image_url: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str  # 'a', 'b', 'c', or 'd'
    marks: int = 1
    explanation: Optional[str] = None
    order_index: int = 0

class MCQQuestionCreate(MCQQuestionBase):
    pass

class MCQQuestion(MCQQuestionBase):
    id: int
    class Config:
        from_attributes = True


# --- Test Attempt ---
class TestAttemptBase(BaseModel):
    test_id: int
    student_name: str
    student_email: Optional[str] = None
    student_phone: Optional[str] = None

class TestAttemptCreate(TestAttemptBase):
    answers_json: str  # JSON string of answers

class TestAttempt(TestAttemptBase):
    id: int
    score: int = 0
    total_marks: int = 0
    correct_answers: int = 0
    wrong_answers: int = 0
    unanswered: int = 0
    time_taken_seconds: int = 0
    answers_json: Optional[str] = None
    completed_at: Optional[str] = None
    class Config:
        from_attributes = True


# ================== COURSES SCHEMAS ==================

class CourseBase(BaseModel):
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    class_id: Optional[int] = None
    is_free: bool = True
    price: int = 0
    discount_price: Optional[int] = None
    duration: Optional[str] = None
    lessons_count: int = 0
    instructor_name: Optional[str] = None
    video_url: Optional[str] = None
    order_index: int = 0
    is_active: bool = True

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# --- Full Test with Questions (for API response) ---
class MCQTestFull(MCQTest):
    questions: List[MCQQuestion] = []

class SubjectWithTestSeries(Subject):
    test_series: List[TestSeries] = []

class AcademicClassWithSubjects(AcademicClass):
    subjects: List[Subject] = []

# --- Question Bank PDF ---
class QuestionBankPDFBase(BaseModel):
    board: str
    class_name: str
    subject_name: str
    title: str
    description: Optional[str] = None
    file_url: str
    file_size: Optional[str] = None

class QuestionBankPDFCreate(QuestionBankPDFBase):
    pass

class QuestionBankPDF(QuestionBankPDFBase):
    id: int
    download_count: int = 0
    is_active: bool = True
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


