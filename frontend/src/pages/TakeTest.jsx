import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, Home } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { endpoints } from '../services/api';

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState({ name: '', email: '', phone: '' });
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        loadTest();
    }, [testId]);

    useEffect(() => {
        let timer;
        if (testStarted && !testSubmitted && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testStarted, testSubmitted, timeRemaining]);

    const loadTest = async () => {
        try {
            const res = await endpoints.getTest(testId);
            setTest(res.data);
            setQuestions(res.data.questions || []);
            setTimeRemaining(res.data.duration_minutes * 60);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (option) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestion].id]: option
        }));
    };

    const handleFlag = () => {
        setFlagged(prev => ({
            ...prev,
            [questions[currentQuestion].id]: !prev[questions[currentQuestion].id]
        }));
    };

    const handleSubmit = async () => {
        const timeTaken = (parseInt(test?.duration_minutes || 0) * 60) - parseInt(timeRemaining || 0);

        try {
            const res = await endpoints.submitTest(testId, {
                test_id: parseInt(testId),
                student_name: studentInfo.name || 'Anonymous',
                student_email: studentInfo.email || null,
                student_phone: studentInfo.phone || null,
                answers_json: JSON.stringify(answers)
            }, timeTaken);

            setResult(res.data);
            setTestSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Failed to submit test');
        }
    };

    const getQuestionStatus = (index) => {
        const qId = questions[index]?.id;
        if (answers[qId]) return 'answered';
        if (flagged[qId]) return 'flagged';
        return 'unanswered';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'answered': return 'bg-green-500';
            case 'flagged': return 'bg-yellow-500';
            default: return 'bg-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center text-white">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
                    <Link to="/test-series" className="text-luxury-gold hover:underline">Go back to Test Series</Link>
                </div>
            </div>
        );
    }

    // Result Screen
    if (testSubmitted && result) {
        return (
            <div className="min-h-screen bg-luxury-black text-white py-20">
                <div className="container mx-auto px-6 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-luxury-charcoal to-luxury-black border border-white/10 rounded-3xl p-8 text-center"
                    >
                        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${result.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {result.passed ? (
                                <Trophy className="w-12 h-12 text-green-400" />
                            ) : (
                                <AlertCircle className="w-12 h-12 text-red-400" />
                            )}
                        </div>

                        <h1 className="text-3xl font-serif mb-2">
                            {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h1>
                        <p className="text-gray-400 mb-8">{test.title}</p>

                        <div className="text-6xl font-bold text-luxury-gold mb-2">
                            {result.percentage}%
                        </div>
                        <p className="text-gray-400 mb-8">Your Score: {result.score}/{result.total_marks}</p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-green-500/10 p-4 rounded-xl">
                                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <span className="text-2xl font-bold text-green-400">{result.correct_answers}</span>
                                <p className="text-xs text-gray-400">Correct</p>
                            </div>
                            <div className="bg-red-500/10 p-4 rounded-xl">
                                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <span className="text-2xl font-bold text-red-400">{result.wrong_answers}</span>
                                <p className="text-xs text-gray-400">Wrong</p>
                            </div>
                            <div className="bg-gray-500/10 p-4 rounded-xl">
                                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-2xl font-bold text-gray-400">{result.unanswered}</span>
                                <p className="text-xs text-gray-400">Skipped</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowReview(true)}
                                className="flex-1 py-3 border border-luxury-gold text-luxury-gold rounded-lg font-bold hover:bg-luxury-gold hover:text-black transition-colors"
                            >
                                Review Answers
                            </button>
                            <Link
                                to="/test-series"
                                className="flex-1 py-3 bg-luxury-gold text-black rounded-lg font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                More Tests
                            </Link>
                        </div>
                    </motion.div>

                    {/* Review Section */}
                    <AnimatePresence>
                        {showReview && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-8 space-y-4"
                            >
                                <h3 className="text-2xl font-serif mb-4">Answer Review</h3>
                                {questions.map((q, index) => {
                                    const userAnswer = answers[q.id];
                                    const isCorrect = userAnswer?.toLowerCase() === q.correct_option?.toLowerCase();

                                    return (
                                        <div key={q.id} className={`p-6 rounded-xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                            <div className="flex items-start gap-4 mb-4">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {index + 1}
                                                </span>
                                                <p className="flex-1">{q.question_text || q.question}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 ml-12">
                                                {['a', 'b', 'c', 'd'].map((opt) => {
                                                    const optionText = q[`option_${opt}`];
                                                    const isUserAnswer = userAnswer?.toLowerCase() === opt;
                                                    const isCorrectAnswer = q.correct_option?.toLowerCase() === opt;

                                                    return (
                                                        <div
                                                            key={opt}
                                                            className={`p-3 rounded-lg text-sm ${isCorrectAnswer
                                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                                : isUserAnswer
                                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                                    : 'bg-white/5 text-gray-400'
                                                                } border border-white/10`}
                                                        >
                                                            <span className="font-bold mr-2">{opt.toUpperCase()}.</span>
                                                            {optionText}
                                                            {isCorrectAnswer && <CheckCircle className="inline w-4 h-4 ml-2" />}
                                                            {isUserAnswer && !isCorrectAnswer && <XCircle className="inline w-4 h-4 ml-2" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {q.explanation && (
                                                <p className="mt-4 ml-12 text-sm text-gray-400 bg-black/30 p-3 rounded-lg">
                                                    <strong>Explanation:</strong> {q.explanation}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // Start Screen
    if (!testStarted) {
        return (
            <div className="min-h-screen bg-luxury-black text-white py-20">
                <div className="container mx-auto px-6 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-luxury-charcoal to-luxury-black border border-white/10 rounded-3xl p-8"
                    >
                        <h1 className="text-3xl font-serif mb-2 text-center">{test.title}</h1>
                        {test.description && (
                            <p className="text-gray-400 text-center mb-8">{test.description}</p>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl text-center">
                                <span className="text-3xl font-bold text-luxury-gold">{test.total_questions}</span>
                                <p className="text-xs text-gray-400 mt-1">Questions</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl text-center">
                                <span className="text-3xl font-bold text-luxury-gold">{test.total_marks}</span>
                                <p className="text-xs text-gray-400 mt-1">Total Marks</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl text-center">
                                <span className="text-3xl font-bold text-luxury-gold">{test.duration_minutes}</span>
                                <p className="text-xs text-gray-400 mt-1">Minutes</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                                <input
                                    type="text"
                                    value={studentInfo.name}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={studentInfo.email}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={studentInfo.phone}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8">
                            <h4 className="text-yellow-400 font-bold mb-2">📋 Instructions</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• All questions are mandatory</li>
                                <li>• Each question carries equal marks unless specified</li>
                                <li>• Timer will start once you begin the test</li>
                                <li>• Test will auto-submit when time runs out</li>
                                <li>• You can flag questions for review</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setTestStarted(true)}
                            disabled={!studentInfo.name}
                            className="w-full py-4 bg-luxury-gold text-black font-bold text-lg rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start Test
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Test Interface
    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-luxury-black text-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-luxury-charcoal border-b border-white/10 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold truncate">{test.title}</h1>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-luxury-gold/20 text-luxury-gold'}`}>
                        <Clock className="w-5 h-5" />
                        <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-white/10">
                    <div
                        className="h-full bg-luxury-gold transition-all duration-300"
                        style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="pt-20 pb-24 flex">
                {/* Question Panel */}
                <div className="flex-1 container mx-auto px-6 py-8 max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Question Header */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
                                <button
                                    onClick={handleFlag}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${flagged[currentQ.id] ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Flag className="w-4 h-4" />
                                    {flagged[currentQ.id] ? 'Flagged' : 'Flag for Review'}
                                </button>
                            </div>

                            {/* Question */}
                            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                                <p className="text-xl leading-relaxed">{currentQ.question_text || currentQ.question}</p>
                                {currentQ.question_image_url && (
                                    <img src={currentQ.question_image_url} alt="Question" className="mt-4 max-w-full rounded-lg" />
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {['a', 'b', 'c', 'd'].map((opt) => {
                                    const optionText = currentQ[`option_${opt}`];
                                    const isSelected = answers[currentQ.id] === opt;

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnswer(opt)}
                                            className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${isSelected
                                                ? 'bg-luxury-gold text-black border-luxury-gold'
                                                : 'bg-white/5 border-white/10 hover:border-luxury-gold/50'
                                                } border`}
                                        >
                                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isSelected ? 'bg-black/20' : 'bg-white/10'}`}>
                                                {opt.toUpperCase()}
                                            </span>
                                            <span className="flex-1">{optionText}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Question Navigator (Sidebar) */}
                <div className="hidden lg:block w-80 bg-luxury-charcoal border-l border-white/10 p-6 fixed right-0 top-16 bottom-0 overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Question Navigator</h3>
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {questions.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${currentQuestion === index
                                    ? 'ring-2 ring-luxury-gold ring-offset-2 ring-offset-luxury-charcoal'
                                    : ''
                                    } ${getStatusColor(getQuestionStatus(index))} ${flagged[q.id] ? 'border-2 border-yellow-400' : ''
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-green-500"></span>
                            <span className="text-gray-400">Answered ({Object.keys(answers).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-gray-600"></span>
                            <span className="text-gray-400">Unanswered ({questions.length - Object.keys(answers).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-yellow-500"></span>
                            <span className="text-gray-400">Flagged ({Object.keys(flagged).filter(k => flagged[k]).length})</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-colors"
                    >
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-luxury-charcoal border-t border-white/10 p-4 lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Prev
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg"
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={currentQuestion === questions.length - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeTest;
