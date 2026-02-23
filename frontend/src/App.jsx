import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Contact = lazy(() => import('./pages/Contact'));
const TestSeries = lazy(() => import('./pages/TestSeries'));
const TakeTest = lazy(() => import('./pages/TakeTest'));
const QuestionBank = lazy(() => import('./pages/QuestionBank'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Loading component for Suspense
const PageLoader = () => (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
    </div>
);

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="test-series" element={<TestSeries />} />
                        <Route path="question-bank" element={<QuestionBank />} />
                        <Route path="contact" element={<Contact />} />
                    </Route>
                    {/* Test taking page - outside layout for fullscreen experience */}
                    <Route path="/test/:testId" element={<TakeTest />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
