import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Play, Clock, BookOpen, User, Lock, ExternalLink } from 'lucide-react';
import { endpoints } from '../services/api';

const Courses = () => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('academic');
    const [freeCourses, setFreeCourses] = useState([]);
    const [paidCourses, setPaidCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const [freeRes, paidRes] = await Promise.all([
                endpoints.getFreeCourses(),
                endpoints.getPaidCourses()
            ]);
            setFreeCourses(freeRes.data);
            setPaidCourses(paidRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const academicPrograms = [
        {
            title: "Class 9th & 10th Foundation",
            board: "State Board & CBSE",
            description: "Our Foundation program is meticulously crafted to bridge the gap between school curriculum and competitive exams. We focus on building a robust conceptual framework in Mathematics and Science (Physics, Chemistry, Biology). The course includes daily practice problems, weekly objective tests, and personalized doubt-clearing sessions to ensure every student masters the fundamentals required for future success in JEE/NEET.",
            subjects: ["Mathematics", "Science", "English", "Social Studies", "Mental Ability"],
            features: ["Concept Clarity", "Regular Testing", "Olympiad Prep", "Foundation for JEE/NEET"]
        },
        {
            title: "Class 11th & 12th Science",
            board: "State Board & CBSE",
            description: "A comprehensive two-year program designed for aspirants of Engineering (JEE) and Medical (NEET) entrance exams, as well as Board excellence. We provide in-depth coverage of the syllabus with a focus on problem-solving techniques. Our experienced faculty uses modern teaching aids to simplify complex topics. The course includes rigorous test series, detailed performance analysis, and one-on-one mentorship.",
            subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
            features: ["NEET/JEE Basics", "Lab Practical Guidance", "Doubt Solving Sessions", "Entrance Exam Strategy"]
        },
        {
            title: "Class 11th & 12th Commerce",
            board: "State Board & CBSE",
            description: "Unlock your potential in the world of finance and business. Our Commerce program offers expert guidance in Accountancy, Economics, and Business Studies. We emphasize real-world applications, case studies, and financial literacy. This course is ideal for students aiming for CA, CS, CMA, or top management colleges. We ensure concept clarity and strong answer-writing skills for board exams.",
            subjects: ["Accountancy", "Economics", "Business Studies", "Mathematics", "English"],
            features: ["CA Foundation Prep", "Financial Literacy", "Case Studies", "Career Counseling"]
        }
    ];

    return (
        <div className="pt-24 min-h-screen bg-luxury-black text-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-luxury-charcoal to-luxury-black py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-luxury-gold/10 rounded-full blur-3xl" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif mb-6"
                    >
                        Our <span className="text-luxury-gold italic">Courses</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Comprehensive programs designed by experts to help you excel in academics and beyond
                    </p>
                </div>
            </section>

            {/* Course Tabs */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex justify-center gap-4 mb-12">
                    {['academic', 'free', 'paid'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === tab
                                ? 'bg-luxury-gold text-black'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                        >
                            {tab === 'free' && 'Free Courses'}
                            {tab === 'paid' && 'Premium Courses'}
                            {tab === 'academic' && 'Academic Programs'}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Free Courses */}
                    {activeTab === 'free' && (
                        <motion.div
                            key="free"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif mb-4">Free Video Courses</h2>
                                <p className="text-gray-400">Start learning today with our free educational content</p>
                            </div>

                            {freeCourses.length === 0 ? (
                                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-2">No free courses available yet</p>
                                    <p className="text-gray-500 text-sm">Check back soon for free learning resources</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.isArray(freeCourses) && freeCourses.map((course, index) => (
                                        <CourseCard key={course.id} course={course} index={index} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Paid Courses */}
                    {activeTab === 'paid' && (
                        <motion.div
                            key="paid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif mb-4">Premium Courses</h2>
                                <p className="text-gray-400">In-depth courses with complete curriculum and mentorship</p>
                            </div>

                            {paidCourses.length === 0 ? (
                                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-2">Premium courses coming soon</p>
                                    <p className="text-gray-500 text-sm">We're preparing exclusive content for you</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.isArray(paidCourses) && paidCourses.map((course, index) => (
                                        <CourseCard key={course.id} course={course} index={index} isPaid />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Academic Programs */}
                    {activeTab === 'academic' && (
                        <motion.div
                            key="academic"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Special Offer Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-luxury-gold/20 to-luxury-charcoal backdrop-blur-sm p-8 border border-luxury-gold hover:border-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-luxury-gold/30 group rounded-xl flex flex-col justify-between relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 bg-luxury-gold text-black text-xs font-bold px-3 py-1 rounded-bl-lg">LIMITED OFFER</div>
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold text-white mb-2">1-on-1 Demo Class</h3>
                                        <div className="text-5xl font-bold text-luxury-gold mb-4">₹29<span className="text-lg text-gray-400 font-normal">/session</span></div>
                                        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                                            Experience our premium teaching quality firsthand. Book a personalized 1-on-1 session with our expert faculty.
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-luxury-gold" /> Topic of your choice</li>
                                            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-luxury-gold" /> Personal doubt solving</li>
                                            <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-luxury-gold" /> Career guidance</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => setShowBookingModal(true)}
                                        className="w-full py-3 bg-luxury-gold text-black font-bold tracking-widest hover:bg-white transition-colors rounded-lg uppercase text-sm"
                                    >
                                        Book Now
                                    </button>
                                </motion.div>

                                {academicPrograms.map((course, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-luxury-gold transition-all duration-300 shadow-lg hover:shadow-luxury-gold/20 group rounded-xl"
                                    >
                                        <div className="h-1 w-20 bg-luxury-gold mb-6 group-hover:w-full transition-all duration-500" />
                                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 block">{course.board}</span>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-4">{course.title}</h3>
                                        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                                            {course.description}
                                        </p>

                                        <div className="mb-6">
                                            <h4 className="font-bold text-sm uppercase tracking-wider mb-3 text-luxury-gold">Subjects</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {course.subjects.map((sub, i) => (
                                                    <span key={i} className="bg-white/10 text-gray-200 text-xs px-3 py-1 rounded-full font-medium border border-white/5">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wider mb-3 text-luxury-gold">Key Features</h4>
                                            <ul className="space-y-2">
                                                {course.features.map((feat, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                        <CheckCircle className="w-4 h-4 text-luxury-gold" />
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <DemoBookingModal onClose={() => setShowBookingModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

// Course Card Component
const CourseCard = ({ course, index, isPaid = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 hover:border-luxury-gold transition-all overflow-hidden group"
        >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-luxury-charcoal to-luxury-black overflow-hidden">
                {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-700" />
                    </div>
                )}
                {course.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-black ml-1" />
                        </div>
                    </div>
                )}
                {isPaid && (
                    <div className="absolute top-3 right-3 bg-luxury-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                        ₹{course.discount_price || course.price}
                        {course.discount_price && (
                            <span className="line-through ml-1 opacity-70">₹{course.price}</span>
                        )}
                    </div>
                )}
                {!isPaid && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        FREE
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-luxury-gold transition-colors">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {course.duration && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                        </span>
                    )}
                    {course.lessons_count > 0 && (
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons_count} Lessons
                        </span>
                    )}
                </div>

                {course.instructor_name && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-luxury-gold" />
                        </div>
                        <span className="text-sm text-gray-400">{course.instructor_name}</span>
                    </div>
                )}

                {course.video_url ? (
                    <a
                        href={course.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-luxury-gold text-black font-bold rounded-lg hover:bg-white transition-colors"
                    >
                        <Play className="w-5 h-5" />
                        Watch Now
                    </a>
                ) : (
                    <button className="w-full py-3 border border-luxury-gold text-luxury-gold font-bold rounded-lg hover:bg-luxury-gold hover:text-black transition-colors">
                        Learn More
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// Demo Booking Modal Component
const DemoBookingModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        student_name: '',
        parent_name: '',
        email: '',
        phone: '',
        class_interested: 'Class 9th',
        preferred_subject: '',
        preferred_date: '',
        preferred_time: '10:00 AM',
        message: ''
    });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await endpoints.createDemoBooking(formData);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
    ];

    const classes = [
        'Class 8th', 'Class 9th', 'Class 10th',
        'Class 11th Science', 'Class 12th Science',
        'Class 11th Commerce', 'Class 12th Commerce'
    ];

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-luxury-charcoal border border-luxury-gold/30 rounded-2xl p-8 max-w-md w-full text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">Booking Confirmed!</h3>
                    <p className="text-gray-400 mb-6">
                        Thank you for booking a demo class! Our team will contact you shortly to confirm the session details.
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-luxury-gold text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors"
                    >
                        Done
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-luxury-charcoal border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white">Book 1-on-1 Demo Class</h3>
                        <p className="text-luxury-gold text-sm mt-1">₹29 per session</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Student Name *</label>
                            <input
                                required
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                                placeholder="Enter student name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Parent/Guardian Name *</label>
                            <input
                                required
                                name="parent_name"
                                value={formData.parent_name}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                                placeholder="Enter parent name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Email *</label>
                            <input
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone Number *</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Class Interested *</label>
                            <select
                                name="class_interested"
                                value={formData.class_interested}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                            >
                                {classes.map((cls) => (
                                    <option key={cls} value={cls} className="bg-luxury-charcoal">{cls}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Preferred Subject/Topic *</label>
                            <input
                                required
                                name="preferred_subject"
                                value={formData.preferred_subject}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                                placeholder="e.g., Algebra, Physics"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Preferred Date *</label>
                            <input
                                required
                                name="preferred_date"
                                value={formData.preferred_date}
                                onChange={handleChange}
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Preferred Time *</label>
                            <select
                                name="preferred_time"
                                value={formData.preferred_time}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                            >
                                {timeSlots.map((time) => (
                                    <option key={time} value={time} className="bg-luxury-charcoal">{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Additional Message (Optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
                            placeholder="Any specific topics or doubts you'd like to discuss?"
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <p className="text-red-400 text-sm">Failed to submit booking. Please try again.</p>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg font-bold hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="flex-1 py-3 bg-luxury-gold text-black rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Submitting...' : 'Book Demo Class'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Courses;
