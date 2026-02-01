import axios from 'axios';

// Use environment variable in production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const endpoints = {
    // Config
    getConfig: () => api.get('/config'),
    updateConfig: (data) => api.post('/config', data),
    seedData: () => api.post('/seed'),

    // Students (Top Performers)
    getStudents: () => api.get('/students'),
    createStudent: (data) => api.post('/students', data),
    deleteStudent: (id) => api.delete(`/students/${id}`),

    // Enquiries
    createEnquiry: (data) => api.post('/enquiries', data),
    getEnquiries: () => api.get('/enquiries'),

    // Auth
    login: (data) => api.post('/login', data),

    // Upload
    uploadImage: (formData) => api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadPDF: (formData) => api.post('/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Demo Bookings
    createDemoBooking: (data) => api.post('/demo-bookings', data),
    getDemoBookings: () => api.get('/demo-bookings'),
    updateDemoBookingStatus: (id, status) => api.put(`/demo-bookings/${id}/status?status=${status}`),
    deleteDemoBooking: (id) => api.delete(`/demo-bookings/${id}`),

    // ================== TEST SERIES ==================

    // Academic Classes
    getClasses: () => api.get('/classes'),
    getClass: (id) => api.get(`/classes/${id}`),
    createClass: (data) => api.post('/classes', data),

    // Subjects
    getSubjectsByClass: (classId) => api.get(`/classes/${classId}/subjects`),
    getAllSubjects: () => api.get('/subjects'),
    getSubject: (id) => api.get(`/subjects/${id}`),
    createSubject: (data) => api.post('/subjects', data),

    // Test Series
    getTestSeriesBySubject: (subjectId) => api.get(`/subjects/${subjectId}/test-series`),
    getAllTestSeries: () => api.get('/test-series'),
    getTestSeries: (id) => api.get(`/test-series/${id}`),
    createTestSeries: (data) => api.post('/test-series', data),
    deleteTestSeries: (id) => api.delete(`/test-series/${id}`),

    // PDF Resources
    getPDFsByTestSeries: (seriesId) => api.get(`/test-series/${seriesId}/pdfs`),
    getAllPDFs: () => api.get('/pdfs'),
    createPDF: (data) => api.post('/pdfs', data),
    deletePDF: (id) => api.delete(`/pdfs/${id}`),

    // MCQ Tests
    getTestsByTestSeries: (seriesId) => api.get(`/test-series/${seriesId}/tests`),
    getAllTests: () => api.get('/tests'),
    getTest: (id) => api.get(`/tests/${id}`),  // Returns random questions for users
    getTestForAdmin: (id) => api.get(`/tests/${id}?admin=true`),  // Returns ALL questions for admin
    createTest: (data) => api.post('/tests', data),
    updateTest: (id, data) => api.put(`/tests/${id}`, data),
    deleteTest: (id) => api.delete(`/tests/${id}`),

    // MCQ Questions
    getQuestionsByTest: (testId) => api.get(`/tests/${testId}/questions`),
    createQuestion: (data) => api.post('/questions', data),
    updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
    deleteQuestion: (id) => api.delete(`/questions/${id}`),

    // Test Attempts & Scoring
    submitTest: (testId, data, timeTaken) => api.post(`/tests/${testId}/submit?time_taken=${timeTaken}`, data),
    getTestAttempts: (testId = null) => api.get(`/test-attempts${testId ? `?test_id=${testId}` : ''}`),

    // ================== COURSES ==================

    getCourses: (type = null) => api.get(`/courses${type ? `?type=${type}` : ''}`),
    getFreeCourses: () => api.get('/courses?type=free'),
    getPaidCourses: () => api.get('/courses?type=paid'),
    getCourse: (id) => api.get(`/courses/${id}`),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
};

export default api;
