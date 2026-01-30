import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import TestSeries from './pages/TestSeries';
import TakeTest from './pages/TakeTest';
import ScrollToTop from './components/ScrollToTop';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="test-series" element={<TestSeries />} />
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
        </Router>
    );
}

export default App;
