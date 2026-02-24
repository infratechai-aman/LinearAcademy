import datetime
from google.cloud.firestore_v1.base_query import FieldFilter
from typing import List, Dict, Any, Optional
import schemas
from firebase_config import get_db

firestore_db = get_db()

def _doc_to_dict(doc) -> Optional[Dict[str, Any]]:
    if not doc.exists:
        return None
    data = doc.to_dict()
    # Ensure ID match if needed, though we set document name to id
    return data

def _docs_to_list(docs) -> List[Dict[str, Any]]:
    return [doc.to_dict() for doc in docs]

# --- Class to emulate SQLAlchemy objects for existing endpoints ---
# Because FastAPI endpoints use things like `student.id` or `student.name`
class FirestoreDict(dict):
    def __getattr__(self, name):
        if name in self:
            return self[name]
        return None
        
    def __setattr__(self, name, value):
        self[name] = value

def dict_to_obj(d):
    if d is None:
        return None
    return FirestoreDict(d)

def list_to_objs(l):
    return [FirestoreDict(d) for d in l]

# =====================================================================
# --- Site Config ---
def get_site_config(db):
    docs = firestore_db.collection("site_config").limit(1).get()
    if docs:
        return dict_to_obj(docs[0].to_dict())
    return None

def create_or_update_site_config(db, config: schemas.SiteConfigCreate):
    config_dict = config.dict()
    # Just grab the first one if we have it
    docs = firestore_db.collection("site_config").limit(1).get()
    
    if docs:
        doc_ref = docs[0].reference
        # We need to maintain the original ID if it previously existed
        config_dict['id'] = docs[0].to_dict().get('id', 1) 
        doc_ref.set(config_dict, merge=True)
    else:
        # Create new
        config_dict['id'] = 1
        firestore_db.collection("site_config").document("1").set(config_dict)
        
    return dict_to_obj(config_dict)

# --- Student ---
def get_students(db, skip: int = 0, limit: int = 100):
    docs = firestore_db.collection("students").order_by("id").offset(skip).limit(limit).get()
    return list_to_objs(_docs_to_list(docs))

def get_student(db, student_id: int):
    doc = firestore_db.collection("students").document(str(student_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_student(db, student: schemas.StudentCreate):
    student_dict = student.dict()
    # Generate an ID since Firestore normally auto-generates string IDs, but we need integers to match legacy
    docs = firestore_db.collection("students").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    student_dict["id"] = new_id
    if "is_active" not in student_dict:
        student_dict["is_active"] = True
        
    firestore_db.collection("students").document(str(new_id)).set(student_dict)
    return dict_to_obj(student_dict)

def delete_student(db, student_id: int):
    doc_ref = firestore_db.collection("students").document(str(student_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None

# --- Enquiry ---
def create_enquiry(db, enquiry: schemas.EnquiryCreate):
    enquiry_dict = enquiry.dict()
    docs = firestore_db.collection("enquiries").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    enquiry_dict["id"] = new_id
    enquiry_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    firestore_db.collection("enquiries").document(str(new_id)).set(enquiry_dict)
    return dict_to_obj(enquiry_dict)

def get_enquiries(db, skip: int = 0, limit: int = 100):
    docs = firestore_db.collection("enquiries").order_by("id", direction="DESCENDING").offset(skip).limit(limit).get()
    return list_to_objs(_docs_to_list(docs))

def delete_enquiry(db, enquiry_id: int):
    doc_ref = firestore_db.collection("enquiries").document(str(enquiry_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None

# --- Admin ---
def get_user_by_email(db, email: str): # Replacing getting admin by getting user by email which was used in login
    # In index.py login uses crud.get_user_by_email(db, email=request.username)
    # Check admins collection
    docs = firestore_db.collection("admins").where(filter=FieldFilter("username", "==", email)).limit(1).get()
    if docs:
        admin_data = docs[0].to_dict()
        # Add a verify_password mock method to pass the FastAPI dependency
        obj = dict_to_obj(admin_data)
        # Assuming admin password checking in fastAPI
        class UserPassWrapper:
            def __init__(self, data):
                self.email = data.get("username")
                self.role = "admin"
                self.data = data
            def verify_password(self, password):
                # For demo, match hashes or simple string check 
                # (SQLAlchemy had hashed_password)
                return self.data.get("hashed_password") == password or self.data.get("hashed_password") == (password + "notreallyhashed")
        return UserPassWrapper(admin_data)
    return None

def create_admin(db, admin: schemas.AdminCreate):
    admin_dict = admin.dict()
    docs = firestore_db.collection("admins").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    admin_dict["id"] = new_id
    admin_dict["hashed_password"] = admin.password + "notreallyhashed"
    firestore_db.collection("admins").document(str(new_id)).set(admin_dict)
    return dict_to_obj(admin_dict)

# --- Demo Booking ---
def create_demo_booking(db, booking: schemas.DemoBookingCreate):
    bk_dict = booking.dict()
    docs = firestore_db.collection("demo_bookings").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    bk_dict["id"] = new_id
    if "status" not in bk_dict:
        bk_dict["status"] = "pending"
    bk_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    firestore_db.collection("demo_bookings").document(str(new_id)).set(bk_dict)
    return dict_to_obj(bk_dict)

def get_demo_bookings(db, skip: int = 0, limit: int = 100):
    docs = firestore_db.collection("demo_bookings").order_by("id", direction="DESCENDING").offset(skip).limit(limit).get()
    return list_to_objs(_docs_to_list(docs))

def update_demo_booking_status(db, booking_id: int, status: str):
    doc_ref = firestore_db.collection("demo_bookings").document(str(booking_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        data["status"] = status
        doc_ref.update({"status": status})
        return dict_to_obj(data)
    return None

def delete_demo_booking(db, booking_id: int):
    doc_ref = firestore_db.collection("demo_bookings").document(str(booking_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None


# ================== ACADEMIC CLASSES ==================

def get_academic_classes(db):
    docs = firestore_db.collection("academic_classes").where(filter=FieldFilter("is_active", "==", True)).get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("order_index", 0))
    return objs

def get_academic_class(db, class_id: int):
    doc = firestore_db.collection("academic_classes").document(str(class_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_academic_class(db, academic_class: schemas.AcademicClassCreate):
    cls_dict = academic_class.dict()
    docs = firestore_db.collection("academic_classes").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    cls_dict["id"] = new_id
    if "is_active" not in cls_dict:
        cls_dict["is_active"] = True
    if "order_index" not in cls_dict:
        cls_dict["order_index"] = 0
        
    firestore_db.collection("academic_classes").document(str(new_id)).set(cls_dict)
    return dict_to_obj(cls_dict)


# ================== SUBJECTS ==================

def get_subjects_by_class(db, class_id: int):
    docs = firestore_db.collection("subjects").where(filter=FieldFilter("class_id", "==", class_id)).where(filter=FieldFilter("is_active", "==", True)).get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("order_index", 0))
    return objs

def get_subject(db, subject_id: int):
    doc = firestore_db.collection("subjects").document(str(subject_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_subject(db, subject: schemas.SubjectCreate):
    sub_dict = subject.dict()
    docs = firestore_db.collection("subjects").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    sub_dict["id"] = new_id
    if "is_active" not in sub_dict:
        sub_dict["is_active"] = True
    if "order_index" not in sub_dict:
        sub_dict["order_index"] = 0
        
    firestore_db.collection("subjects").document(str(new_id)).set(sub_dict)
    return dict_to_obj(sub_dict)

def get_all_subjects(db):
    docs = firestore_db.collection("subjects").where(filter=FieldFilter("is_active", "==", True)).get()
    return list_to_objs(_docs_to_list(docs))


# ================== TEST SERIES ==================

def get_test_series_by_subject(db, subject_id: int):
    docs = firestore_db.collection("test_series").where(filter=FieldFilter("subject_id", "==", subject_id)).where(filter=FieldFilter("is_active", "==", True)).get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("order_index", 0))
    return objs

def get_test_series(db, series_id: int):
    doc = firestore_db.collection("test_series").document(str(series_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_test_series(db, series: schemas.TestSeriesCreate):
    ser_dict = series.dict()
    docs = firestore_db.collection("test_series").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    ser_dict["id"] = new_id
    if "is_active" not in ser_dict:
        ser_dict["is_active"] = True
    if "order_index" not in ser_dict:
        ser_dict["order_index"] = 0
    ser_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    firestore_db.collection("test_series").document(str(new_id)).set(ser_dict)
    return dict_to_obj(ser_dict)

def get_all_test_series(db):
    docs = firestore_db.collection("test_series").where(filter=FieldFilter("is_active", "==", True)).get()
    return list_to_objs(_docs_to_list(docs))

def delete_test_series(db, series_id: int):
    doc_ref = firestore_db.collection("test_series").document(str(series_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None


# ================== PDF RESOURCES ==================

def get_pdfs_by_test_series(db, test_series_id: int):
    docs = firestore_db.collection("pdf_resources").where(filter=FieldFilter("test_series_id", "==", test_series_id)).where(filter=FieldFilter("is_active", "==", True)).get()
    return list_to_objs(_docs_to_list(docs))

def create_pdf_resource(db, pdf: schemas.PDFResourceCreate):
    pdf_dict = pdf.dict()
    docs = firestore_db.collection("pdf_resources").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    pdf_dict["id"] = new_id
    if "is_active" not in pdf_dict:
        pdf_dict["is_active"] = True
    pdf_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    firestore_db.collection("pdf_resources").document(str(new_id)).set(pdf_dict)
    return dict_to_obj(pdf_dict)

def delete_pdf_resource(db, pdf_id: int):
    doc_ref = firestore_db.collection("pdf_resources").document(str(pdf_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None

def get_all_pdfs(db):
    docs = firestore_db.collection("pdf_resources").where(filter=FieldFilter("is_active", "==", True)).get()
    return list_to_objs(_docs_to_list(docs))


# ================== MCQ TESTS ==================

def get_mcq_tests_by_test_series(db, test_series_id: int):
    docs = firestore_db.collection("mcq_tests").where(filter=FieldFilter("test_series_id", "==", test_series_id)).where(filter=FieldFilter("is_active", "==", True)).get()
    return list_to_objs(_docs_to_list(docs))

def get_mcq_test(db, test_id: int):
    doc = firestore_db.collection("mcq_tests").document(str(test_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_mcq_test(db, test: schemas.MCQTestCreate):
    test_dict = test.dict()
    docs = firestore_db.collection("mcq_tests").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    test_dict["id"] = new_id
    if "is_active" not in test_dict:
        test_dict["is_active"] = True
    test_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    firestore_db.collection("mcq_tests").document(str(new_id)).set(test_dict)
    return dict_to_obj(test_dict)

def update_mcq_test(db, test_id: int, test: schemas.MCQTestCreate):
    doc_ref = firestore_db.collection("mcq_tests").document(str(test_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        for key, value in test.dict().items():
            if value is not None:
                data[key] = value
        doc_ref.update(data)
        return dict_to_obj(data)
    return None

def delete_mcq_test(db, test_id: int):
    doc_ref = firestore_db.collection("mcq_tests").document(str(test_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        
        # Also delete questions
        qs = firestore_db.collection("mcq_questions").where(filter=FieldFilter("test_id", "==", test_id)).get()
        for q in qs:
            q.reference.delete()
            
        doc_ref.delete()
        return dict_to_obj(data)
    return None

def get_all_mcq_tests(db):
    docs = firestore_db.collection("mcq_tests").where(filter=FieldFilter("is_active", "==", True)).get()
    return _docs_to_list(docs)


# ================== MCQ QUESTIONS ==================

def get_questions_by_test(db, test_id: int):
    docs = firestore_db.collection("mcq_questions").where(filter=FieldFilter("test_id", "==", test_id)).get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("order_index", 0))
    return objs

def create_mcq_question(db, question: schemas.MCQQuestionCreate):
    q_dict = question.dict()
    docs = firestore_db.collection("mcq_questions").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    q_dict["id"] = new_id
    if "order_index" not in q_dict:
        q_dict["order_index"] = 0
    if "marks" not in q_dict:
        q_dict["marks"] = 1
        
    firestore_db.collection("mcq_questions").document(str(new_id)).set(q_dict)
    
    # Update test question count
    test_doc = firestore_db.collection("mcq_tests").document(str(question.test_id)).get()
    if test_doc.exists:
        all_qs = firestore_db.collection("mcq_questions").where(filter=FieldFilter("test_id", "==", question.test_id)).get()
        total_questions = len(all_qs)
        total_marks = sum([q.to_dict().get("marks", 1) for q in all_qs])
        
        test_doc.reference.update({
            "total_questions": total_questions,
            "total_marks": total_marks
        })
    
    return dict_to_obj(q_dict)

def update_mcq_question(db, question_id: int, question: schemas.MCQQuestionCreate):
    doc_ref = firestore_db.collection("mcq_questions").document(str(question_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        for key, value in question.dict().items():
            if value is not None:
                data[key] = value
        doc_ref.update(data)
        
        # update test question count and marks in background ideally, but we'll do it synchronously
        test_doc = firestore_db.collection("mcq_tests").document(str(data.get("test_id"))).get()
        if test_doc.exists:
            all_qs = firestore_db.collection("mcq_questions").where(filter=FieldFilter("test_id", "==", data.get("test_id"))).get()
            total_marks = sum([q.to_dict().get("marks", 1) for q in all_qs])
            test_doc.reference.update({
                "total_marks": total_marks
            })
            
        return dict_to_obj(data)
    return None

def delete_mcq_question(db, question_id: int):
    doc_ref = firestore_db.collection("mcq_questions").document(str(question_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        test_id = data.get("test_id")
        doc_ref.delete()
        
        # Update test question count
        test_doc = firestore_db.collection("mcq_tests").document(str(test_id)).get()
        if test_doc.exists:
            all_qs = firestore_db.collection("mcq_questions").where(filter=FieldFilter("test_id", "==", test_id)).get()
            total_questions = len(all_qs)
            total_marks = sum([q.to_dict().get("marks", 1) for q in all_qs])
            
            test_doc.reference.update({
                "total_questions": total_questions,
                "total_marks": total_marks
            })
            
        return dict_to_obj(data)
    return None


# ================== TEST ATTEMPTS ==================

def create_test_attempt(db, attempt: schemas.TestAttemptCreate, score: int, total_marks: int, 
                        correct: int, wrong: int, unanswered: int, time_taken: int):
    att_dict = attempt.dict()
    docs = firestore_db.collection("test_attempts").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    att_dict["id"] = new_id
    att_dict["score"] = score
    att_dict["total_marks"] = total_marks
    att_dict["correct_answers"] = correct
    att_dict["wrong_answers"] = wrong
    att_dict["unanswered"] = unanswered
    att_dict["time_taken_seconds"] = time_taken
    att_dict["completed_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    firestore_db.collection("test_attempts").document(str(new_id)).set(att_dict)
    return dict_to_obj(att_dict)

def get_test_attempts(db, test_id: int = None):
    query = firestore_db.collection("test_attempts")
    if test_id:
        query = query.where(filter=FieldFilter("test_id", "==", test_id))
    docs = query.get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("id", 0), reverse=True)
    return objs

def get_all_test_attempts(db):
    docs = firestore_db.collection("test_attempts").get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("id", 0), reverse=True)
    return objs[:100]


# ================== COURSES ==================

def get_courses(db, is_free: bool = None):
    query = firestore_db.collection("courses").where(filter=FieldFilter("is_active", "==", True))
    if is_free is not None:
        query = query.where(filter=FieldFilter("is_free", "==", is_free))
    docs = query.get()
    objs = list_to_objs(_docs_to_list(docs))
    objs.sort(key=lambda x: x.get("order_index", 0))
    return objs

def get_course(db, course_id: int):
    doc = firestore_db.collection("courses").document(str(course_id)).get()
    return dict_to_obj(_doc_to_dict(doc))

def create_course(db, course: schemas.CourseCreate):
    course_dict = course.dict()
    docs = firestore_db.collection("courses").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    course_dict["id"] = new_id
    if "is_free" not in course_dict:
        course_dict["is_free"] = True
    if "is_active" not in course_dict:
        course_dict["is_active"] = True
    if "order_index" not in course_dict:
        course_dict["order_index"] = 0
    course_dict["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    firestore_db.collection("courses").document(str(new_id)).set(course_dict)
    return dict_to_obj(course_dict)

def update_course(db, course_id: int, course: schemas.CourseCreate):
    doc_ref = firestore_db.collection("courses").document(str(course_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        for key, value in course.dict().items():
            if value is not None:
                data[key] = value
        doc_ref.update(data)
        return dict_to_obj(data)
    return None

def delete_course(db, course_id: int):
    doc_ref = firestore_db.collection("courses").document(str(course_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None

# --- Question Bank PDF ---
def create_question_bank_pdf(db, pdf: schemas.QuestionBankPDFCreate):
    pdf_dict = pdf.dict()
    docs = firestore_db.collection("question_bank_pdfs").order_by("id", direction="DESCENDING").limit(1).get()
    new_id = 1
    if docs:
        new_id = docs[0].to_dict().get("id", 0) + 1
        
    pdf_dict["id"] = new_id
    pdf_dict["created_at"] = datetime.datetime.now().isoformat()
    pdf_dict["download_count"] = 0
    pdf_dict["is_active"] = True
    
    firestore_db.collection("question_bank_pdfs").document(str(new_id)).set(pdf_dict)
    return dict_to_obj(pdf_dict)

def get_question_bank_pdfs(db, board: str = None, class_name: str = None, subject_name: str = None):
    query = firestore_db.collection("question_bank_pdfs")
    if board:
        query = query.where(filter=FieldFilter("board", "==", board))
    if class_name:
        query = query.where(filter=FieldFilter("class_name", "==", class_name))
    if subject_name:
        query = query.where(filter=FieldFilter("subject_name", "==", subject_name))
    
    docs = query.order_by("id", direction="DESCENDING").get()
    return list_to_objs(_docs_to_list(docs))

def delete_question_bank_pdf(db, pdf_id: int):
    doc_ref = firestore_db.collection("question_bank_pdfs").document(str(pdf_id))
    doc = doc_ref.get()
    if doc.exists:
        data = doc.to_dict()
        doc_ref.delete()
        return dict_to_obj(data)
    return None
