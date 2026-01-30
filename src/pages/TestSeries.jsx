import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, ClipboardList, ChevronRight, Download, Clock, Award, Users, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';

const TestSeries = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [testSeries, setTestSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [tests, setTests] = useState([]);
    const [activeTab, setActiveTab] = useState('pdfs');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const res = await endpoints.getClasses();
            setClasses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubjects = async (classId) => {
        try {
            const res = await endpoints.getSubjectsByClass(classId);
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadTestSeries = async (subjectId) => {
        try {
            const res = await endpoints.getTestSeriesBySubject(subjectId);
            setTestSeries(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSeriesContent = async (seriesId) => {
        try {
            console.log('Loading content for series ID:', seriesId);
            const [pdfsRes, testsRes] = await Promise.all([
                endpoints.getPDFsByTestSeries(seriesId),
                endpoints.getTestsByTestSeries(seriesId)
            ]);
            console.log('PDFs response:', pdfsRes.data);
            console.log('Tests response:', testsRes.data);
            setPdfs(pdfsRes.data);
            setTests(testsRes.data);
        } catch (error) {
            console.error('Error loading series content:', error);
        }
    };

    const handleClassSelect = (cls) => {
        setSelectedClass(cls);
        setSelectedSubject(null);
        setSelectedSeries(null);
        loadSubjects(cls.id);
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setSelectedSeries(null);
        loadTestSeries(subject.id);
    };

    const handleSeriesSelect = (series) => {
        setSelectedSeries(series);
        loadSeriesContent(series.id);
    };

    const handleBack = () => {
        if (selectedSeries) {
            setSelectedSeries(null);
            setPdfs([]);
            setTests([]);
        } else if (selectedSubject) {
            setSelectedSubject(null);
            setTestSeries([]);
        } else if (selectedClass) {
            setSelectedClass(null);
            setSubjects([]);
        }
    };

    const getBreadcrumb = () => {
        const items = ['Test Series'];
        if (selectedClass) items.push(selectedClass.display_name);
        if (selectedSubject) items.push(selectedSubject.name);
        if (selectedSeries) items.push(selectedSeries.title);
        return items;
    };

    return (
        <div className="pt-24 min-h-screen bg-luxury-black text-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-luxury-charcoal to-luxury-black py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-luxury-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-serif mb-4">
                            Test <span className="text-luxury-gold italic">Series</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Access comprehensive study materials and practice tests designed to help you excel
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                    {getBreadcrumb().map((item, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
                            <span className={index === getBreadcrumb().length - 1 ? 'text-luxury-gold' : 'text-gray-400'}>
                                {item}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <section className="container mx-auto px-6 py-8">
                {/* Back Button */}
                {(selectedClass || selectedSubject || selectedSeries) && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </motion.button>
                )}

                <AnimatePresence mode="wait">
                    {/* Class Selection */}
                    {!selectedClass && (
                        <motion.div
                            key="classes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-2xl font-serif mb-8">Select Your Class</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {classes.map((cls, index) => (
                                    <motion.div
                                        key={cls.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleClassSelect(cls)}
                                        className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-2xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group hover:shadow-lg hover:shadow-luxury-gold/10"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-7 h-7 text-luxury-gold" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{cls.display_name}</h3>
                                        {cls.stream && (
                                            <span className="text-xs text-luxury-gold uppercase tracking-wider">
                                                {cls.stream}
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Subject Selection */}
                    {selectedClass && !selectedSubject && (
                        <motion.div
                            key="subjects"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-2xl font-serif mb-2">{selectedClass.display_name}</h2>
                            <p className="text-gray-400 mb-8">Choose a subject to explore</p>

                            {subjects.length === 0 ? (
                                <div className="text-center py-16">
                                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No subjects available yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {subjects.map((subject, index) => (
                                        <motion.div
                                            key={subject.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleSubjectSelect(subject)}
                                            className="relative bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-2xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group overflow-hidden"
                                            style={{ borderColor: `${subject.color}30` }}
                                        >
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                                                style={{ backgroundColor: subject.color }}
                                            />
                                            <div className="relative z-10">
                                                <span className="text-4xl mb-4 block">{subject.icon}</span>
                                                <h3 className="text-lg font-bold">{subject.name}</h3>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Test Series Selection */}
                    {selectedSubject && !selectedSeries && (
                        <motion.div
                            key="series"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-2xl font-serif mb-2">{selectedSubject.name}</h2>
                            <p className="text-gray-400 mb-8">Select a test series to view resources</p>

                            {testSeries.length === 0 ? (
                                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                                    <ClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-2">No test series available yet</p>
                                    <p className="text-gray-500 text-sm">Content will be added soon</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {testSeries.map((series, index) => (
                                        <motion.div
                                            key={series.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleSeriesSelect(series)}
                                            className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all overflow-hidden group"
                                        >
                                            {series.thumbnail_url && (
                                                <div className="h-40 bg-gray-800 overflow-hidden">
                                                    <img src={series.thumbnail_url} alt={series.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-bold">{series.title}</h3>
                                                    {!series.is_free && (
                                                        <span className="text-luxury-gold text-sm font-bold">
                                                            ₹{series.discount_price || series.price}
                                                            {series.discount_price && (
                                                                <span className="text-gray-500 line-through ml-2 text-xs">₹{series.price}</span>
                                                            )}
                                                        </span>
                                                    )}
                                                    {series.is_free && (
                                                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">FREE</span>
                                                    )}
                                                </div>
                                                {series.description && (
                                                    <p className="text-gray-400 text-sm">{series.description}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Series Content (PDFs & Tests) */}
                    {selectedSeries && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-serif mb-2">{selectedSeries.title}</h2>
                                {selectedSeries.description && (
                                    <p className="text-gray-400">{selectedSeries.description}</p>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                                <button
                                    onClick={() => setActiveTab('pdfs')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'pdfs' ? 'bg-luxury-gold text-black' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <FileText className="w-5 h-5" />
                                    PDFs ({pdfs.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('tests')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'tests' ? 'bg-luxury-gold text-black' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <ClipboardList className="w-5 h-5" />
                                    MCQ Tests ({tests.length})
                                </button>
                            </div>

                            {/* PDFs Tab */}
                            {activeTab === 'pdfs' && (
                                <div>
                                    {pdfs.length === 0 ? (
                                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No PDFs available</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pdfs.map((pdf) => (
                                                <a
                                                    key={pdf.id}
                                                    href={pdf.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-luxury-gold transition-colors group"
                                                >
                                                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-red-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold group-hover:text-luxury-gold transition-colors">{pdf.title}</h4>
                                                        {pdf.description && (
                                                            <p className="text-gray-400 text-sm">{pdf.description}</p>
                                                        )}
                                                        <span className="text-gray-500 text-xs">{pdf.file_size}</span>
                                                    </div>
                                                    <Download className="w-5 h-5 text-gray-400 group-hover:text-luxury-gold" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tests Tab */}
                            {activeTab === 'tests' && (
                                <div>
                                    {tests.length === 0 ? (
                                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No tests available</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {tests.map((test) => (
                                                <div
                                                    key={test.id}
                                                    className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold transition-all"
                                                >
                                                    <h4 className="text-xl font-bold mb-4">{test.title}</h4>
                                                    {test.description && (
                                                        <p className="text-gray-400 text-sm mb-4">{test.description}</p>
                                                    )}
                                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                                        <div className="bg-black/30 p-3 rounded-lg text-center">
                                                            <span className="text-2xl font-bold text-luxury-gold">{test.total_questions}</span>
                                                            <p className="text-xs text-gray-400">Questions</p>
                                                        </div>
                                                        <div className="bg-black/30 p-3 rounded-lg text-center">
                                                            <span className="text-2xl font-bold text-luxury-gold">{test.total_marks}</span>
                                                            <p className="text-xs text-gray-400">Marks</p>
                                                        </div>
                                                        <div className="bg-black/30 p-3 rounded-lg text-center">
                                                            <span className="text-2xl font-bold text-luxury-gold">{test.duration_minutes}</span>
                                                            <p className="text-xs text-gray-400">Minutes</p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/test/${test.id}`}
                                                        className="block w-full py-3 bg-luxury-gold text-black font-bold text-center rounded-lg hover:bg-white transition-colors"
                                                    >
                                                        Start Test
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default TestSeries;
