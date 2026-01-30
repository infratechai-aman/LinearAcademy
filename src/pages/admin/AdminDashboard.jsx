import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';
import { Trash2, Plus, LogOut, Loader, Calendar, CheckCircle, XCircle, Clock, BookOpen, FileText, ClipboardList, PlayCircle, Settings, Users, MessageSquare, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('demo-bookings');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    const tabs = [
        { id: 'demo-bookings', name: 'Demo Bookings', icon: Calendar },
        { id: 'enquiries', name: 'Enquiries', icon: MessageSquare },
        { id: 'students', name: 'Top Performers', icon: Users },
        { id: 'test-series', name: 'Test Series', icon: BookOpen },
        { id: 'mcq-tests', name: 'MCQ Tests', icon: ClipboardList },
        { id: 'courses', name: 'Courses', icon: PlayCircle },
        { id: 'settings', name: 'Site Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-luxury-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-luxury-charcoal border-r border-white/10 p-6 flex flex-col fixed h-full">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/src/assets/logo-v2.png" alt="Linear Academy" className="w-10 h-10 object-contain" />
                    <h2 className="text-xl font-serif text-luxury-gold">Admin Panel</h2>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left py-2.5 px-4 rounded-lg transition-colors flex items-center gap-3 ${activeTab === tab.id ? 'bg-luxury-gold text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                        </button>
                    ))}
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-4 py-2">
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8 overflow-y-auto ml-64">
                {activeTab === 'demo-bookings' && <DemoBookingsManager />}
                {activeTab === 'enquiries' && <EnquiriesManager />}
                {activeTab === 'students' && <StudentsManager />}
                {activeTab === 'test-series' && <TestSeriesManager />}
                {activeTab === 'mcq-tests' && <MCQTestsManager />}
                {activeTab === 'courses' && <CoursesManager />}
                {activeTab === 'settings' && <SettingsManager />}
            </main>
        </div>
    );
};


// Demo Bookings Manager Component
const DemoBookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await endpoints.getDemoBookings();
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await endpoints.updateDemoBookingStatus(id, newStatus);
            loadBookings();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            await endpoints.deleteDemoBooking(id);
            loadBookings();
        } catch (error) {
            console.error(error);
            alert('Failed to delete booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'confirmed': return <Calendar size={14} />;
            case 'completed': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin w-8 h-8 text-luxury-gold" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-serif">1-on-1 Demo Bookings</h3>
                <div className="text-sm text-gray-400">
                    Total: {bookings.length} bookings
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-xl text-gray-400 mb-2">No bookings yet</h4>
                    <p className="text-gray-500">Demo class bookings will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-luxury-gold/30 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold text-white">{booking.student_name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Parent:</span>
                                            <p className="text-gray-300">{booking.parent_name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Contact:</span>
                                            <p className="text-gray-300">{booking.phone}</p>
                                            <p className="text-gray-400 text-xs">{booking.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Class & Subject:</span>
                                            <p className="text-gray-300">{booking.class_interested}</p>
                                            <p className="text-luxury-gold text-xs">{booking.preferred_subject}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Preferred Schedule:</span>
                                            <p className="text-gray-300">{booking.preferred_date}</p>
                                            <p className="text-gray-400 text-xs">{booking.preferred_time}</p>
                                        </div>
                                    </div>
                                    {booking.message && (
                                        <p className="mt-3 text-sm text-gray-400 bg-black/30 p-3 rounded-lg">
                                            <span className="text-gray-500">Message:</span> {booking.message}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">Booked on: {booking.created_at}</p>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-luxury-gold focus:outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EnquiriesManager = () => {
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        endpoints.getEnquiries().then(res => setEnquiries(res.data));
    }, []);

    return (
        <div>
            <h3 className="text-3xl font-serif mb-6">Enquiries</h3>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/10 text-luxury-gold uppercase text-sm">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {enquiries.map((enq) => (
                            <tr key={enq.id} className="hover:bg-white/5">
                                <td className="p-4">{enq.first_name} {enq.last_name}</td>
                                <td className="p-4">
                                    <div className="text-sm">{enq.email}</div>
                                    <div className="text-sm text-gray-400">{enq.phone}</div>
                                </td>
                                <td className="p-4">{enq.course_interest}</td>
                                <td className="p-4 text-sm text-gray-300 max-w-xs">{enq.message}</td>
                                <td className="p-4 text-sm text-gray-400">{enq.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StudentsManager = () => {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ name: '', rank: '', image_url: '', description: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        endpoints.getStudents().then(res => setStudents(res.data));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await endpoints.uploadImage(formData);
            setForm(prev => ({ ...prev, image_url: res.data.url }));
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await endpoints.createStudent(form);
        setForm({ name: '', rank: '', image_url: '', description: '' });
        loadStudents();
    };

    const handleDelete = async (id) => {
        await endpoints.deleteStudent(id);
        loadStudents();
    };

    return (
        <div>
            <h3 className="text-3xl font-serif mb-6">Manage Students</h3>

            {/* Add Form */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
                <h4 className="text-xl mb-4 text-luxury-gold">Add New Student</h4>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        placeholder="Name"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="bg-black/50 border border-gray-700 rounded px-4 py-2 text-white"
                        required
                    />
                    <input
                        placeholder="Rank/Title (e.g. 98% Class 10)"
                        value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })}
                        className="bg-black/50 border border-gray-700 rounded px-4 py-2 text-white"
                        required
                    />

                    <div className="flex gap-2">
                        <input
                            placeholder="Image URL"
                            value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                            className="bg-black/50 border border-gray-700 rounded px-4 py-2 text-white flex-1"
                        />
                        <label className="bg-white/10 text-white px-4 py-2 rounded cursor-pointer hover:bg-white/20 transition-colors flex items-center justify-center min-w-[100px]">
                            {uploading ? <Loader className="animate-spin" size={20} /> : 'Upload'}
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                    <input
                        placeholder="Description"
                        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        className="bg-black/50 border border-gray-700 rounded px-4 py-2 text-white"
                    />
                    <button type="submit" className="bg-luxury-gold text-black font-bold py-2 rounded hover:bg-white transition-colors col-span-2">
                        Add Student
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map(student => (
                    <div key={student.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
                        <button
                            onClick={() => handleDelete(student.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="h-40 bg-black/50 rounded-lg mb-4 overflow-hidden">
                            <img src={student.image_url || "https://via.placeholder.com/150"} alt={student.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-lg">{student.name}</h4>
                        <span className="text-luxury-gold text-sm font-bold">{student.rank}</span>
                        <p className="text-gray-400 text-sm mt-2">{student.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsManager = () => {
    const [config, setConfig] = useState({
        phone_number: '', email: '', address: '', facebook_url: '', instagram_url: '', whatsapp_number: '', youtube_url: ''
    });

    useEffect(() => {
        endpoints.getConfig().then(res => setConfig(res.data));
    }, []);

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await endpoints.updateConfig(config);
        alert('Settings updated!');
    };

    return (
        <div>
            <h3 className="text-3xl font-serif mb-6">Site Settings</h3>
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Phone Number</label>
                        <input name="phone_number" value={config.phone_number} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Email Address</label>
                        <input name="email" value={config.email} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Address</label>
                        <textarea name="address" value={config.address} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" rows="3" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Facebook URL</label>
                        <input name="facebook_url" value={config.facebook_url} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Instagram URL</label>
                        <input name="instagram_url" value={config.instagram_url || ''} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">WhatsApp Number (e.g. 919876543210)</label>
                        <input name="whatsapp_number" value={config.whatsapp_number || ''} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">YouTube URL</label>
                        <input name="youtube_url" value={config.youtube_url || ''} onChange={handleChange} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3 rounded hover:bg-white transition-colors">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

// Test Series Manager - Complete Rewrite with Visual Cards and PDF Upload
const TestSeriesManager = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [series, setSeries] = useState([]);
    const [pdfs, setPdfs] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [showSeriesForm, setShowSeriesForm] = useState(false);
    const [showPdfForm, setShowPdfForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [seriesFormData, setSeriesFormData] = useState({ title: '', description: '', is_free: true, price: 0 });
    const [pdfFormData, setPdfFormData] = useState({ title: '', description: '', file_url: '', file_size: '' });

    useEffect(() => { loadClasses(); }, []);
    useEffect(() => { if (selectedClass) loadSubjects(); }, [selectedClass]);
    useEffect(() => { if (selectedSubject) loadSeries(); }, [selectedSubject]);
    useEffect(() => { if (selectedSeries) loadPdfs(); }, [selectedSeries]);

    const loadClasses = async () => { const res = await endpoints.getClasses(); setClasses(res.data); };
    const loadSubjects = async () => { const res = await endpoints.getSubjectsByClass(selectedClass.id); setSubjects(res.data); };
    const loadSeries = async () => { const res = await endpoints.getTestSeriesBySubject(selectedSubject.id); setSeries(res.data); };
    const loadPdfs = async () => { const res = await endpoints.getPDFsByTestSeries(selectedSeries.id); setPdfs(res.data); };

    const handleCreateSeries = async (e) => {
        e.preventDefault();
        try {
            await endpoints.createTestSeries({
                ...seriesFormData,
                subject_id: parseInt(selectedSubject.id)
            });
            setShowSeriesForm(false);
            setSeriesFormData({ title: '', description: '', is_free: true, price: 0 });
            loadSeries();
        } catch (error) {
            console.error('Failed to create series:', error);
            alert('Failed to create series: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeleteSeries = async (id) => {
        if (!confirm('Delete this test series and all its content?')) return;
        await endpoints.deleteTestSeries(id);
        if (selectedSeries?.id === id) setSelectedSeries(null);
        loadSeries();
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await endpoints.uploadPDF(fd);
            setPdfFormData({ ...pdfFormData, file_url: res.data.url, file_size: res.data.file_size });
        } catch (error) {
            alert('Upload failed');
        }
        setUploading(false);
    };

    const handleCreatePdf = async (e) => {
        e.preventDefault();
        try {
            await endpoints.createPDF({
                ...pdfFormData,
                test_series_id: parseInt(selectedSeries.id)
            });
            setShowPdfForm(false);
            setPdfFormData({ title: '', description: '', file_url: '', file_size: '' });
            loadPdfs();
        } catch (error) {
            console.error('Failed to create PDF:', error);
            alert('Failed to create PDF: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeletePdf = async (id) => {
        if (!confirm('Delete this PDF?')) return;
        await endpoints.deletePDF(id);
        loadPdfs();
    };

    const handleBack = () => {
        if (selectedSeries) { setSelectedSeries(null); setPdfs([]); }
        else if (selectedSubject) { setSelectedSubject(null); setSeries([]); }
        else if (selectedClass) { setSelectedClass(null); setSubjects([]); }
    };

    // Breadcrumb
    const getBreadcrumb = () => {
        const items = ['Test Series'];
        if (selectedClass) items.push(selectedClass.display_name);
        if (selectedSubject) items.push(selectedSubject.name);
        if (selectedSeries) items.push(selectedSeries.title);
        return items;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-serif text-luxury-gold">Test Series Manager</h1>
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mt-2 text-sm">
                        {getBreadcrumb().map((item, idx) => (
                            <span key={idx} className="flex items-center gap-2">
                                {idx > 0 && <span className="text-gray-600">/</span>}
                                <span className={idx === getBreadcrumb().length - 1 ? 'text-luxury-gold' : 'text-gray-400'}>{item}</span>
                            </span>
                        ))}
                    </div>
                </div>
                {selectedClass && (
                    <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        ← Go Back
                    </button>
                )}
            </div>

            {/* Class Selection - Visual Cards */}
            {!selectedClass && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Select a Class</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {classes.map((cls) => (
                            <div
                                key={cls.id}
                                onClick={() => setSelectedClass(cls)}
                                className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group"
                            >
                                <div className="w-12 h-12 bg-luxury-gold/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-luxury-gold" />
                                </div>
                                <h3 className="font-bold text-lg text-white">{cls.display_name}</h3>
                                {cls.stream && <span className="text-xs text-luxury-gold uppercase">{cls.stream}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subject Selection - Visual Cards */}
            {selectedClass && !selectedSubject && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Select a Subject in {selectedClass.display_name}</h2>
                    {subjects.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No subjects found for this class</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject)}
                                    className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all"
                                    style={{ borderColor: `${subject.color}30` }}
                                >
                                    <span className="text-3xl mb-3 block">{subject.icon}</span>
                                    <h3 className="font-bold text-white">{subject.name}</h3>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Test Series List with Actions */}
            {selectedSubject && !selectedSeries && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Test Series in {selectedSubject.name}
                        </h2>
                        <button
                            onClick={() => setShowSeriesForm(true)}
                            className="bg-luxury-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <Plus size={18} /> Add Test Series
                        </button>
                    </div>

                    {/* Create Series Form */}
                    {showSeriesForm && (
                        <form onSubmit={handleCreateSeries} className="bg-white/5 p-6 rounded-xl mb-6 grid grid-cols-2 gap-4 border border-white/10">
                            <input
                                placeholder="Series Title"
                                value={seriesFormData.title}
                                onChange={(e) => setSeriesFormData({ ...seriesFormData, title: e.target.value })}
                                className="bg-black/50 border border-gray-700 rounded p-3 text-white"
                                required
                            />
                            <input
                                placeholder="Description"
                                value={seriesFormData.description}
                                onChange={(e) => setSeriesFormData({ ...seriesFormData, description: e.target.value })}
                                className="bg-black/50 border border-gray-700 rounded p-3 text-white"
                            />
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={seriesFormData.is_free}
                                    onChange={(e) => setSeriesFormData({ ...seriesFormData, is_free: e.target.checked })}
                                />
                                Free
                            </label>
                            {!seriesFormData.is_free && (
                                <input
                                    type="number"
                                    placeholder="Price (₹)"
                                    value={seriesFormData.price}
                                    onChange={(e) => setSeriesFormData({ ...seriesFormData, price: parseInt(e.target.value) || 0 })}
                                    className="bg-black/50 border border-gray-700 rounded p-3 text-white"
                                />
                            )}
                            <div className="col-span-2 flex gap-3">
                                <button type="submit" className="bg-luxury-gold text-black font-bold py-2 px-6 rounded">Create</button>
                                <button type="button" onClick={() => setShowSeriesForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                            </div>
                        </form>
                    )}

                    {/* Series Cards */}
                    {series.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No test series yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {series.map((s) => (
                                <div
                                    key={s.id}
                                    className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-luxury-gold/50 transition-all relative group"
                                >
                                    <button
                                        onClick={() => handleDeleteSeries(s.id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <h3 className="font-bold text-lg text-white mb-1">{s.title}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{s.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold ${s.is_free ? 'text-green-400' : 'text-luxury-gold'}`}>
                                            {s.is_free ? 'FREE' : `₹${s.price}`}
                                        </span>
                                        <button
                                            onClick={() => setSelectedSeries(s)}
                                            className="text-sm text-luxury-gold hover:underline"
                                        >
                                            Manage PDFs →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* PDF Management for Selected Series */}
            {selectedSeries && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedSeries.title}</h2>
                            <p className="text-gray-400 text-sm">Manage PDFs for this test series</p>
                        </div>
                        <button
                            onClick={() => setShowPdfForm(true)}
                            className="bg-luxury-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <Upload size={18} /> Upload PDF
                        </button>
                    </div>

                    {/* Upload PDF Form */}
                    {showPdfForm && (
                        <form onSubmit={handleCreatePdf} className="bg-white/5 p-6 rounded-xl mb-6 space-y-4 border border-white/10">
                            <input
                                placeholder="PDF Title"
                                value={pdfFormData.title}
                                onChange={(e) => setPdfFormData({ ...pdfFormData, title: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                required
                            />
                            <input
                                placeholder="Description (optional)"
                                value={pdfFormData.description}
                                onChange={(e) => setPdfFormData({ ...pdfFormData, description: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                            />
                            <div className="flex items-center gap-4">
                                <input type="file" accept=".pdf" onChange={handlePdfUpload} className="text-white" />
                                {uploading && <Loader className="animate-spin text-luxury-gold" />}
                                {pdfFormData.file_url && <span className="text-green-400">Uploaded ({pdfFormData.file_size})</span>}
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={!pdfFormData.file_url} className="bg-luxury-gold text-black font-bold py-2 px-6 rounded disabled:opacity-50">
                                    Save PDF
                                </button>
                                <button type="button" onClick={() => { setShowPdfForm(false); setPdfFormData({ title: '', description: '', file_url: '', file_size: '' }); }} className="text-gray-400 hover:text-white">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* PDF List */}
                    {pdfs.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No PDFs uploaded yet. Upload your first PDF!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pdfs.map((pdf) => (
                                <div key={pdf.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 hover:border-red-500/30 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{pdf.title}</h4>
                                            <span className="text-gray-500 text-sm">{pdf.file_size}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <a href={pdf.file_url} target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline text-sm">
                                            View
                                        </a>
                                        <button onClick={() => handleDeletePdf(pdf.id)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// MCQ Tests Manager - Complete Rewrite with Question Builder
const MCQTestsManager = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [series, setSeries] = useState([]);
    const [tests, setTests] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showTestForm, setShowTestForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [testFormData, setTestFormData] = useState({ title: '', description: '', duration_minutes: 60, passing_marks: 0, questions_to_show: 10 });
    const [questionFormData, setQuestionFormData] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', marks: 1, explanation: '' });

    useEffect(() => { loadClasses(); }, []);
    useEffect(() => { if (selectedClass) loadSubjects(); }, [selectedClass]);
    useEffect(() => { if (selectedSubject) loadSeries(); }, [selectedSubject]);
    useEffect(() => { if (selectedSeries) loadTests(); }, [selectedSeries]);
    useEffect(() => { if (selectedTest) loadQuestions(); }, [selectedTest]);

    const loadClasses = async () => { const res = await endpoints.getClasses(); setClasses(res.data); };
    const loadSubjects = async () => { const res = await endpoints.getSubjectsByClass(selectedClass.id); setSubjects(res.data); };
    const loadSeries = async () => { const res = await endpoints.getTestSeriesBySubject(selectedSubject.id); setSeries(res.data); };
    const loadTests = async () => { const res = await endpoints.getTestsByTestSeries(selectedSeries.id); setTests(res.data); };
    const loadQuestions = async () => {
        const res = await endpoints.getTestForAdmin(selectedTest.id);
        setQuestions(res.data.questions || []);
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        try {
            await endpoints.createTest({
                ...testFormData,
                test_series_id: parseInt(selectedSeries.id),
                total_questions: 0,
                total_marks: 0
            });
            setShowTestForm(false);
            setTestFormData({ title: '', description: '', duration_minutes: 60, passing_marks: 0, questions_to_show: 10 });
            loadTests();
        } catch (error) {
            console.error('Failed to create test:', error);
            alert('Failed to create test: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeleteTest = async (id) => {
        if (!confirm('Delete this test and all its questions?')) return;
        await endpoints.deleteTest(id);
        if (selectedTest?.id === id) { setSelectedTest(null); setQuestions([]); }
        loadTests();
    };

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        try {
            await endpoints.createQuestion({
                ...questionFormData,
                test_id: parseInt(selectedTest.id)
            });
            setShowQuestionForm(false);
            setQuestionFormData({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', marks: 1, explanation: '' });
            loadQuestions();
            // Update test's total_questions count
            const updatedTest = await endpoints.getTestForAdmin(selectedTest.id);
            setSelectedTest({ ...selectedTest, total_questions: updatedTest.data.total_questions_in_bank });
        } catch (error) {
            console.error('Failed to create question:', error);
            alert('Failed to create question: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!confirm('Delete this question?')) return;
        await endpoints.deleteQuestion(id);
        loadQuestions();
    };

    const handleBack = () => {
        if (selectedTest) { setSelectedTest(null); setQuestions([]); }
        else if (selectedSeries) { setSelectedSeries(null); setTests([]); }
        else if (selectedSubject) { setSelectedSubject(null); setSeries([]); }
        else if (selectedClass) { setSelectedClass(null); setSubjects([]); }
    };

    // Breadcrumb
    const getBreadcrumb = () => {
        const items = ['MCQ Tests'];
        if (selectedClass) items.push(selectedClass.display_name);
        if (selectedSubject) items.push(selectedSubject.name);
        if (selectedSeries) items.push(selectedSeries.title);
        if (selectedTest) items.push(selectedTest.title);
        return items;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-serif text-luxury-gold">MCQ Tests Manager</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                        {getBreadcrumb().map((item, idx) => (
                            <span key={idx} className="flex items-center gap-2">
                                {idx > 0 && <span className="text-gray-600">/</span>}
                                <span className={idx === getBreadcrumb().length - 1 ? 'text-luxury-gold' : 'text-gray-400'}>{item}</span>
                            </span>
                        ))}
                    </div>
                </div>
                {selectedClass && (
                    <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        ← Go Back
                    </button>
                )}
            </div>

            {/* Class Selection */}
            {!selectedClass && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Select a Class</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {classes.map((cls) => (
                            <div
                                key={cls.id}
                                onClick={() => setSelectedClass(cls)}
                                className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="font-bold text-lg text-white">{cls.display_name}</h3>
                                {cls.stream && <span className="text-xs text-blue-400 uppercase">{cls.stream}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subject Selection */}
            {selectedClass && !selectedSubject && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Select a Subject in {selectedClass.display_name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                onClick={() => setSelectedSubject(subject)}
                                className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all"
                            >
                                <span className="text-3xl mb-3 block">{subject.icon}</span>
                                <h3 className="font-bold text-white">{subject.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Test Series Selection */}
            {selectedSubject && !selectedSeries && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Select a Test Series</h2>
                    {series.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">No test series available. Create one in Test Series Manager first.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {series.map((s) => (
                                <div
                                    key={s.id}
                                    onClick={() => setSelectedSeries(s)}
                                    className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all"
                                >
                                    <h3 className="font-bold text-white">{s.title}</h3>
                                    <p className="text-gray-400 text-sm">{s.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tests List */}
            {selectedSeries && !selectedTest && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">MCQ Tests in {selectedSeries.title}</h2>
                        <button onClick={() => setShowTestForm(true)} className="bg-luxury-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <Plus size={18} /> Create Test
                        </button>
                    </div>

                    {showTestForm && (
                        <form onSubmit={handleCreateTest} className="bg-white/5 p-6 rounded-xl mb-6 grid grid-cols-2 gap-4 border border-white/10">
                            <input placeholder="Test Title" value={testFormData.title} onChange={(e) => setTestFormData({ ...testFormData, title: e.target.value })} className="bg-black/50 border border-gray-700 rounded p-3 text-white" required />
                            <input placeholder="Description" value={testFormData.description} onChange={(e) => setTestFormData({ ...testFormData, description: e.target.value })} className="bg-black/50 border border-gray-700 rounded p-3 text-white" />
                            <div>
                                <label className="text-gray-400 text-sm">Duration (minutes)</label>
                                <input type="number" value={testFormData.duration_minutes} onChange={(e) => setTestFormData({ ...testFormData, duration_minutes: parseInt(e.target.value) || 60 })} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Passing Marks</label>
                                <input type="number" value={testFormData.passing_marks} onChange={(e) => setTestFormData({ ...testFormData, passing_marks: parseInt(e.target.value) || 0 })} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-gray-400 text-sm">Questions to Show (random from pool)</label>
                                <input type="number" value={testFormData.questions_to_show} onChange={(e) => setTestFormData({ ...testFormData, questions_to_show: parseInt(e.target.value) || 10 })} className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white" min="1" />
                                <p className="text-gray-500 text-xs mt-1">Users will see this many random questions from your question bank</p>
                            </div>
                            <div className="col-span-2 flex gap-3">
                                <button type="submit" className="bg-luxury-gold text-black font-bold py-2 px-6 rounded">Create Test</button>
                                <button type="button" onClick={() => setShowTestForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                            </div>
                        </form>
                    )}

                    {tests.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No tests yet. Create your first MCQ test!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tests.map((test) => (
                                <div key={test.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 hover:border-luxury-gold/50 group">
                                    <div className="flex items-center gap-4" onClick={() => setSelectedTest(test)} style={{ cursor: 'pointer', flex: 1 }}>
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <ClipboardList className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{test.title}</h4>
                                            <span className="text-gray-500 text-sm">
                                                {test.total_questions || 0} questions in bank • Shows {test.questions_to_show || 10} per test • {test.duration_minutes} mins
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setSelectedTest(test)} className="text-luxury-gold hover:underline text-sm">Manage Questions →</button>
                                        <button onClick={() => handleDeleteTest(test.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Question Builder */}
            {selectedTest && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedTest.title}</h2>
                            <p className="text-gray-400 text-sm">
                                Question Bank: {questions.length} questions • Users see: {selectedTest.questions_to_show || 10} random questions
                            </p>
                        </div>
                        <button onClick={() => setShowQuestionForm(true)} className="bg-luxury-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <Plus size={18} /> Add Question
                        </button>
                    </div>

                    {/* Add Question Form */}
                    {showQuestionForm && (
                        <form onSubmit={handleCreateQuestion} className="bg-white/5 p-6 rounded-xl mb-6 space-y-4 border border-white/10">
                            <div>
                                <label className="text-gray-400 text-sm">Question Text</label>
                                <textarea
                                    value={questionFormData.question_text}
                                    onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white h-20"
                                    placeholder="Enter your question here..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`text-sm ${questionFormData.correct_option === 'a' ? 'text-green-400' : 'text-gray-400'}`}>
                                        Option A {questionFormData.correct_option === 'a' && '(Correct)'}
                                    </label>
                                    <input
                                        value={questionFormData.option_a}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, option_a: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`text-sm ${questionFormData.correct_option === 'b' ? 'text-green-400' : 'text-gray-400'}`}>
                                        Option B {questionFormData.correct_option === 'b' && '(Correct)'}
                                    </label>
                                    <input
                                        value={questionFormData.option_b}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, option_b: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`text-sm ${questionFormData.correct_option === 'c' ? 'text-green-400' : 'text-gray-400'}`}>
                                        Option C {questionFormData.correct_option === 'c' && '(Correct)'}
                                    </label>
                                    <input
                                        value={questionFormData.option_c}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, option_c: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`text-sm ${questionFormData.correct_option === 'd' ? 'text-green-400' : 'text-gray-400'}`}>
                                        Option D {questionFormData.correct_option === 'd' && '(Correct)'}
                                    </label>
                                    <input
                                        value={questionFormData.option_d}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, option_d: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Correct Answer</label>
                                    <select
                                        value={questionFormData.correct_option}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, correct_option: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                    >
                                        <option value="a">Option A</option>
                                        <option value="b">Option B</option>
                                        <option value="c">Option C</option>
                                        <option value="d">Option D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Marks</label>
                                    <input
                                        type="number"
                                        value={questionFormData.marks}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, marks: parseInt(e.target.value) || 1 })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Explanation (optional)</label>
                                    <input
                                        value={questionFormData.explanation}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white"
                                        placeholder="Explain the answer..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="bg-luxury-gold text-black font-bold py-2 px-6 rounded">Add Question</button>
                                <button type="button" onClick={() => setShowQuestionForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                            </div>
                        </form>
                    )}

                    {/* Questions List */}
                    {questions.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">No questions yet. Add your first question to the bank!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="bg-white/5 p-4 rounded-lg border border-white/10 group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-gray-500 text-sm">Q{idx + 1}</span>
                                                <span className="text-luxury-gold text-sm">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                                            </div>
                                            <p className="text-white mb-3">{q.question_text}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className={`p-2 rounded ${q.correct_option === 'a' ? 'bg-green-500/20 text-green-400' : 'bg-black/30 text-gray-400'}`}>A: {q.option_a}</div>
                                                <div className={`p-2 rounded ${q.correct_option === 'b' ? 'bg-green-500/20 text-green-400' : 'bg-black/30 text-gray-400'}`}>B: {q.option_b}</div>
                                                <div className={`p-2 rounded ${q.correct_option === 'c' ? 'bg-green-500/20 text-green-400' : 'bg-black/30 text-gray-400'}`}>C: {q.option_c}</div>
                                                <div className={`p-2 rounded ${q.correct_option === 'd' ? 'bg-green-500/20 text-green-400' : 'bg-black/30 text-gray-400'}`}>D: {q.option_d}</div>
                                            </div>
                                            {q.explanation && <p className="text-gray-500 text-sm mt-2 italic">Explanation: {q.explanation}</p>}
                                        </div>
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Courses Manager
const CoursesManager = () => {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', is_free: true, price: 0, video_url: '', instructor_name: '' });

    useEffect(() => { loadCourses(); }, []);
    const loadCourses = async () => { const res = await endpoints.getCourses(); setCourses(res.data); };

    const handleCreate = async (e) => {
        e.preventDefault();
        await endpoints.createCourse(formData);
        setShowForm(false);
        loadCourses();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this course?')) return;
        await endpoints.deleteCourse(id);
        loadCourses();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif text-luxury-gold">Courses</h1>
                <button onClick={() => setShowForm(true)} className="bg-luxury-gold text-black px-4 py-2 rounded font-bold flex items-center gap-2"><Plus size={18} /> Add Course</button>
            </div>
            {showForm && (
                <form onSubmit={handleCreate} className="bg-white/5 p-6 rounded-xl mb-6 grid grid-cols-2 gap-4">
                    <input placeholder="Course Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border border-gray-700 rounded p-3 text-white" required />
                    <input placeholder="Instructor Name" value={formData.instructor_name} onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })} className="bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="col-span-2 bg-black/50 border border-gray-700 rounded p-3 text-white" required />
                    <input placeholder="Video URL (YouTube)" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} className="bg-black/50 border border-gray-700 rounded p-3 text-white" />
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={formData.is_free} onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })} /> Free Course</label>
                        {!formData.is_free && <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="bg-black/50 border border-gray-700 rounded p-3 text-white w-32" />}
                    </div>
                    <button type="submit" className="col-span-2 bg-luxury-gold text-black font-bold py-2 rounded">Create Course</button>
                </form>
            )}
            <div className="grid grid-cols-3 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white/5 p-4 rounded-xl border border-white/10 relative">
                        <button onClick={() => handleDelete(course.id)} className="absolute top-2 right-2 text-red-400"><Trash2 size={16} /></button>
                        <h3 className="font-bold text-lg pr-6">{course.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                        <div className="flex justify-between items-center mt-3">
                            <span className={`text-xs ${course.is_free ? 'text-green-400' : 'text-luxury-gold'}`}>{course.is_free ? 'FREE' : `₹${course.price}`}</span>
                            {course.instructor_name && <span className="text-gray-500 text-xs">{course.instructor_name}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;

