import React, { useState, useEffect } from 'react';
import { endpoints, downloadBase64Pdf } from '../services/api';
import { FileText, ChevronRight, BookOpen, Download, Loader, Search, Brain, Filter, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionBank = () => {
    const [boardsData, setBoardsData] = useState({});
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBoardsData();
    }, []);

    useEffect(() => {
        if (selectedBoard && selectedClass && selectedSubject) {
            loadPdfs();
        }
    }, [selectedBoard, selectedClass, selectedSubject]);

    const loadBoardsData = async () => {
        try {
            const res = await endpoints.getBoards();
            setBoardsData(res.data || {});
        } catch (err) {
            console.error("Failed to load syllabus data:", err);
            setError("Failed to load syllabus data. Please try again later.");
        }
    };

    const loadPdfs = async () => {
        setLoading(true);
        try {
            const res = await endpoints.getQuestionBankPDFs({
                board: selectedBoard,
                class_name: selectedClass,
                subject_name: selectedSubject
            });
            setPdfs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load PDFs:", err);
            setPdfs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (selectedSubject) setSelectedSubject(null);
        else if (selectedClass) setSelectedClass(null);
        else if (selectedBoard) setSelectedBoard(null);
    };

    const boardIcons = { "CBSE": "🏫", "ICSE": "🎓", "Maharashtra Board": "🏛️" };
    const boardColors = { "CBSE": "from-blue-500/20 to-blue-600/5", "ICSE": "from-purple-500/20 to-purple-600/5", "Maharashtra Board": "from-orange-500/20 to-orange-600/5" };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-luxury-black pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                        Question <span className="text-luxury-gold italic">Bank</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Access a comprehensive collection of previous year questions and chapter-wise PDFs for all major boards.
                    </p>
                    <div className="h-1 w-20 bg-luxury-gold mx-auto mt-8 rounded-full" />
                </motion.div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-center">
                        {error}
                    </div>
                )}

                {/* Breadcrumb Navigation */}
                {(selectedBoard || selectedClass || selectedSubject) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 mb-10 text-sm overflow-x-auto whitespace-nowrap pb-2 no-scrollbar"
                    >
                        <button
                            onClick={() => { setSelectedBoard(null); setSelectedClass(null); setSelectedSubject(null); }}
                            className="bg-white/5 px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <Filter size={14} /> Reset
                        </button>
                        {selectedBoard && (
                            <div className="flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-600" />
                                <span className={`px-4 py-2 rounded-full border border-luxury-gold/30 text-luxury-gold font-medium`}>{selectedBoard}</span>
                            </div>
                        )}
                        {selectedClass && (
                            <div className="flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-600" />
                                <span className={`px-4 py-2 rounded-full border border-luxury-gold/30 text-luxury-gold font-medium`}>{selectedClass}</span>
                            </div>
                        )}
                        {selectedSubject && (
                            <div className="flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-600" />
                                <span className={`px-4 py-2 rounded-full border border-luxury-gold/30 text-luxury-gold font-medium`}>{selectedSubject}</span>
                            </div>
                        )}
                        <button
                            onClick={handleBack}
                            className="ml-auto text-gray-500 hover:text-white transition-colors"
                        >
                            ← Go Back
                        </button>
                    </motion.div>
                )}

                {/* Step 1: Select Board */}
                {!selectedBoard && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Object.keys(boardsData)
                            .filter(board => board !== "UP Board" && board !== "Bihar Board")
                            .map((board, idx) => (
                                <motion.div
                                    key={board}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setSelectedBoard(board)}
                                    className={`relative overflow-hidden bg-gradient-to-br ${boardColors[board] || 'from-white/10 to-white/5'} p-8 rounded-3xl border border-white/5 hover:border-luxury-gold/50 cursor-pointer transition-all group`}
                                >
                                    <div className="relative z-10">
                                        <span className="text-5xl mb-6 block transform group-hover:scale-110 transition-transform duration-500">{boardIcons[board] || '📚'}</span>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{board}</h3>
                                        <p className="text-gray-500 text-sm">Explore question papers for {Object.keys(boardsData[board]).length} classes</p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="text-luxury-gold" />
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                )}

                {/* Step 2: Select Class */}
                {selectedBoard && !selectedClass && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Object.keys(boardsData[selectedBoard] || {}).map((cls, idx) => (
                            <motion.div
                                key={cls}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedClass(cls)}
                                className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-luxury-gold hover:bg-white/10 cursor-pointer transition-all group text-center"
                            >
                                <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-8 h-8 text-luxury-gold" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{cls}</h3>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Step 3: Select Subject */}
                {selectedBoard && selectedClass && !selectedSubject && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.keys(boardsData[selectedBoard]?.[selectedClass] || {}).map((subject, idx) => {
                            const subjectIcons = { "Mathematics": "📐", "Physics": "⚡", "Chemistry": "🧪", "Biology": "🧬", "Science": "🔬", "English": "📖", "Social Science": "🌍" };
                            return (
                                <motion.div
                                    key={subject}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedSubject(subject)}
                                    className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-luxury-gold hover:bg-white/10 cursor-pointer transition-all group text-center"
                                >
                                    <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{subjectIcons[subject] || '📚'}</span>
                                    <h3 className="text-lg font-bold text-white">{subject}</h3>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Results Section */}
                {selectedSubject && (
                    <div className="space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader className="animate-spin text-luxury-gold w-10 h-10" />
                                <p className="text-gray-500 animate-pulse">Fetching question banks...</p>
                            </div>
                        ) : pdfs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 bg-white/5 rounded-3xl border border-white/5"
                            >
                                <FileText className="w-20 h-20 text-gray-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Question Papers Yet</h3>
                                <p className="text-gray-500">We are currently uploading papers for this section. Check back soon!</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pdfs.map((pdf, idx) => (
                                    <motion.div
                                        key={pdf.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-luxury-gold/30 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-luxury-gold transition-colors">{pdf.title}</h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span>{pdf.file_size}</span>
                                                    <span>•</span>
                                                    <span>Question Paper</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => downloadBase64Pdf(pdf.file_url, pdf.title)}
                                            className="w-12 h-12 bg-luxury-gold text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-luxury-gold/20"
                                            title="Download PDF"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionBank;
