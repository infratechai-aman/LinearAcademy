import React, { useState, useEffect } from 'react';
import { endpoints } from '../../services/api';
import { Trash2, Plus, LogOut, Loader, Calendar, CheckCircle, XCircle, Clock, BookOpen, FileText, ClipboardList, PlayCircle, Settings, Users, MessageSquare, Upload, Sparkles, ChevronRight, Brain, RefreshCw, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-v2.png';

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
        { id: 'test-series', name: 'Test Series', icon: BookOpen },
        { id: 'mcq-tests', name: 'MCQ Tests', icon: Brain },
        { id: 'courses', name: 'Courses', icon: PlayCircle },
        { id: 'settings', name: 'Site Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-luxury-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-luxury-charcoal border-r border-white/10 p-6 flex flex-col fixed h-full">
                <div className="flex items-center gap-3 mb-8">
                    <img src={logo} alt="Linear Academy" className="w-10 h-10 object-contain" />
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
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load demo bookings:", error);
            setBookings([]);
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
                    {Array.isArray(bookings) && bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-luxury-gold/30 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold text-white">{booking.student_name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(booking.status || 'pending')}`}>
                                            {getStatusIcon(booking.status || 'pending')}
                                            {(booking.status || 'pending').toUpperCase()}
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
        const fetchEnquiries = async () => {
            try {
                const res = await endpoints.getEnquiries();
                setEnquiries(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to load enquiries:", error);
                setEnquiries([]);
            }
        };
        fetchEnquiries();
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
                        {Array.isArray(enquiries) && enquiries.map((enq) => (
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

    const loadStudents = async () => {
        try {
            const res = await endpoints.getStudents();
            setStudents(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load students:", error);
            setStudents([]);
        }
    };

    // --- Image Compression Utility ---
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Max dimensions
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }
                        // Create a new file from the blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.7); // 0.7 = 70% quality (Good balance)
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // Compress before upload
            const compressedFile = await compressImage(file);

            const formData = new FormData();
            formData.append('file', compressedFile);

            const res = await endpoints.uploadImage(formData);
            setForm(prev => ({ ...prev, image_url: res.data.url }));
        } catch (error) {
            console.error("Upload error:", error);
            alert('Upload failed: ' + (error.message || "Unknown error"));
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
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await endpoints.deleteStudent(id);
                loadStudents();
                alert('Student deleted successfully');
            } catch (error) {
                console.error("Failed to delete student:", error);
                alert("Failed to delete student. Please try again.");
            }
        }
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
                {Array.isArray(students) && students.map(student => (
                    <div key={student.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
                        <button
                            onClick={() => handleDelete(student.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 opacity-80 hover:opacity-100"
                            title="Delete Student"
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
        const fetchConfig = async () => {
            try {
                const res = await endpoints.getConfig();
                if (res.data) setConfig(res.data);
            } catch (error) {
                console.error("Failed to load config:", error);
            }
        };
        fetchConfig();
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

    const safelyLoad = async (apiCall, setter) => {
        try {
            const res = await apiCall;
            setter(res.data ? (Array.isArray(res.data) ? res.data : []) : []);
        } catch (error) {
            console.error(error);
            setter([]);
        }
    };

    const loadClasses = () => safelyLoad(endpoints.getClasses(), setClasses);
    const loadSubjects = () => { if (selectedClass) safelyLoad(endpoints.getSubjectsByClass(selectedClass.id), setSubjects); };
    const loadSeries = () => { if (selectedSubject) safelyLoad(endpoints.getTestSeriesBySubject(selectedSubject.id), setSeries); };
    const loadPdfs = () => { if (selectedSeries) safelyLoad(endpoints.getPDFsByTestSeries(selectedSeries.id), setPdfs); };

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

                    {/* Empty State / Seed Button */}
                    {classes.length === 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center mb-8">
                            <h3 className="text-xl font-bold text-red-500 mb-2">No Classes Found</h3>
                            <p className="text-gray-400 mb-6">The database appears to be empty. Click below to initialize default classes.</p>
                            <button
                                onClick={async () => {
                                    if (confirm('Initialize database with default classes?')) {
                                        try {
                                            await endpoints.seedData();
                                            alert('Data initialized! Refreshing...');
                                            loadClasses();
                                        } catch (e) {
                                            alert('Failed: ' + e.message);
                                        }
                                    }
                                }}
                                className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
                            >
                                Initialize System Data
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.isArray(classes) && classes.map((cls) => (
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
                            {Array.isArray(subjects) && subjects.map((subject) => (
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
                            {Array.isArray(series) && series.map((s) => (
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
                            {Array.isArray(pdfs) && pdfs.map((pdf) => (
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

// MCQ Tests Manager - AI-Powered Generator with Board → Class → Subject → Chapter workflow
const MCQTestsManager = () => {
    const [boardsData, setBoardsData] = useState({});
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [existingTests, setExistingTests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);
    const [activeView, setActiveView] = useState('generator'); // 'generator' or 'tests'
    const [error, setError] = useState('');

    useEffect(() => {
        loadBoardsData();
        loadExistingTests();
    }, []);

    const loadBoardsData = async () => {
        try {
            const res = await endpoints.getBoards();
            setBoardsData(res.data || {});
        } catch (err) {
            console.error("Failed to load boards data:", err);
            setError("Failed to load syllabus data");
        }
    };

    const loadExistingTests = async () => {
        setLoadingTests(true);
        try {
            const res = await endpoints.getGeneratedTests();
            setExistingTests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load tests:", err);
            setExistingTests([]);
        } finally {
            setLoadingTests(false);
        }
    };

    const handleGenerate = async () => {
        if (!selectedBoard || !selectedClass || !selectedSubject || !selectedChapter) {
            setError("Please select Board, Class, Subject and Chapter");
            return;
        }
        setGenerating(true);
        setError('');
        setGeneratedResult(null);
        try {
            const res = await endpoints.generateMCQ({
                board: selectedBoard,
                class_name: selectedClass,
                subject: selectedSubject,
                chapter: selectedChapter,
                api_key: ""
            });
            setGeneratedResult(res.data);
            loadExistingTests();
        } catch (err) {
            console.error("Generation failed:", err);
            setError(err.response?.data?.detail || err.message || "Failed to generate MCQ test");
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (!confirm('Delete this test and all its questions?')) return;
        try {
            await endpoints.deleteGeneratedTest(testId);
            loadExistingTests();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete test");
        }
    };

    const resetSelection = () => {
        setSelectedBoard(null);
        setSelectedClass(null);
        setSelectedSubject(null);
        setSelectedChapter(null);
        setGeneratedResult(null);
        setError('');
    };

    const handleBack = () => {
        if (generatedResult) { setGeneratedResult(null); }
        else if (selectedChapter) { setSelectedChapter(null); }
        else if (selectedSubject) { setSelectedSubject(null); }
        else if (selectedClass) { setSelectedClass(null); }
        else if (selectedBoard) { setSelectedBoard(null); }
    };

    const getBreadcrumb = () => {
        const items = [];
        if (selectedBoard) items.push(selectedBoard);
        if (selectedClass) items.push(selectedClass);
        if (selectedSubject) items.push(selectedSubject);
        if (selectedChapter) items.push(selectedChapter);
        return items;
    };

    const boardIcons = { "CBSE": "🏫", "ICSE": "🎓", "Maharashtra Board": "🏛️", "UP Board": "📘", "Bihar Board": "📗" };
    const boardColors = { "CBSE": "from-blue-500/20 to-blue-600/5", "ICSE": "from-purple-500/20 to-purple-600/5", "Maharashtra Board": "from-orange-500/20 to-orange-600/5", "UP Board": "from-green-500/20 to-green-600/5", "Bihar Board": "from-red-500/20 to-red-600/5" };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-serif text-luxury-gold flex items-center gap-3">
                        <Brain className="w-8 h-8" />
                        AI MCQ Generator
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Generate chapter-wise MCQ tests using AI</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveView('generator')}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${activeView === 'generator' ? 'bg-luxury-gold text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <Sparkles size={16} /> Generator
                    </button>
                    <button
                        onClick={() => setActiveView('tests')}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${activeView === 'tests' ? 'bg-luxury-gold text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <ClipboardList size={16} /> All Tests ({existingTests.length})
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-400">{error}</span>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">✕</button>
                </div>
            )}

            {/* === GENERATOR VIEW === */}
            {activeView === 'generator' && (
                <div>
                    {/* Breadcrumb */}
                    {getBreadcrumb().length > 0 && (
                        <div className="flex items-center gap-2 mb-6 text-sm">
                            <button onClick={resetSelection} className="text-gray-400 hover:text-white">MCQ Generator</button>
                            {getBreadcrumb().map((item, idx) => (
                                <span key={idx} className="flex items-center gap-2">
                                    <ChevronRight size={14} className="text-gray-600" />
                                    <span className={idx === getBreadcrumb().length - 1 ? 'text-luxury-gold font-bold' : 'text-gray-400'}>{item}</span>
                                </span>
                            ))}
                            <button onClick={handleBack} className="ml-auto text-gray-400 hover:text-white text-sm">← Back</button>
                        </div>
                    )}

                    {/* Step 1: Select Board */}
                    {!selectedBoard && !generatedResult && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">Step 1: Select Board</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {Object.keys(boardsData).map((board) => (
                                    <div
                                        key={board}
                                        onClick={() => setSelectedBoard(board)}
                                        className={`bg-gradient-to-br ${boardColors[board] || 'from-white/10 to-white/5'} p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group text-center`}
                                    >
                                        <span className="text-4xl mb-3 block">{boardIcons[board] || '📚'}</span>
                                        <h3 className="font-bold text-white group-hover:text-luxury-gold transition-colors">{board}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{Object.keys(boardsData[board]).length} classes</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Class */}
                    {selectedBoard && !selectedClass && !generatedResult && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">Step 2: Select Class ({selectedBoard})</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Object.keys(boardsData[selectedBoard] || {}).map((cls) => (
                                    <div
                                        key={cls}
                                        onClick={() => setSelectedClass(cls)}
                                        className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-luxury-gold/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-6 h-6 text-luxury-gold" />
                                        </div>
                                        <h3 className="font-bold text-white">{cls}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{Object.keys(boardsData[selectedBoard][cls] || {}).length} subjects</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Select Subject */}
                    {selectedBoard && selectedClass && !selectedSubject && !generatedResult && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">Step 3: Select Subject</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.keys(boardsData[selectedBoard]?.[selectedClass] || {}).map((subject) => {
                                    const subjectIcons = { "Mathematics": "📐", "Physics": "⚡", "Chemistry": "🧪", "Biology": "🧬", "Science": "🔬", "English": "📖", "Social Science": "🌍" };
                                    const subjectColors = { "Mathematics": "#4CAF50", "Physics": "#2196F3", "Chemistry": "#FF9800", "Biology": "#8BC34A", "Science": "#2196F3", "English": "#9C27B0", "Social Science": "#FF5722" };
                                    return (
                                        <div
                                            key={subject}
                                            onClick={() => setSelectedSubject(subject)}
                                            className="bg-gradient-to-br from-white/5 to-white/0 p-6 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group"
                                            style={{ borderColor: `${subjectColors[subject] || '#D4AF37'}30` }}
                                        >
                                            <span className="text-3xl mb-3 block">{subjectIcons[subject] || '📚'}</span>
                                            <h3 className="font-bold text-white">{subject}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{(boardsData[selectedBoard]?.[selectedClass]?.[subject] || []).length} chapters</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Select Chapter */}
                    {selectedBoard && selectedClass && selectedSubject && !selectedChapter && !generatedResult && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">Step 4: Select Chapter</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(boardsData[selectedBoard]?.[selectedClass]?.[selectedSubject] || []).map((chapter, idx) => (
                                    <div
                                        key={chapter}
                                        onClick={() => setSelectedChapter(chapter)}
                                        className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-luxury-gold cursor-pointer transition-all group flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center text-luxury-gold font-bold text-sm flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <h3 className="font-medium text-white group-hover:text-luxury-gold transition-colors">{chapter}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Generate Button */}
                    {selectedChapter && !generatedResult && (
                        <div className="mt-2">
                            <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 border border-luxury-gold/30 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                                <Brain className="w-16 h-16 text-luxury-gold mx-auto mb-4" />
                                <h2 className="text-2xl font-serif text-white mb-2">Ready to Generate</h2>
                                <p className="text-gray-400 mb-6">
                                    Generate 10 MCQ questions for <span className="text-luxury-gold font-bold">{selectedChapter}</span>
                                </p>
                                <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-gray-500">Board:</span> <span className="text-white">{selectedBoard}</span></div>
                                        <div><span className="text-gray-500">Class:</span> <span className="text-white">{selectedClass}</span></div>
                                        <div><span className="text-gray-500">Subject:</span> <span className="text-white">{selectedSubject}</span></div>
                                        <div><span className="text-gray-500">Chapter:</span> <span className="text-white">{selectedChapter}</span></div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="bg-luxury-gold text-black font-bold py-3 px-8 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-lg"
                                >
                                    {generating ? (
                                        <>
                                            <Loader className="animate-spin" size={20} />
                                            Generating with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            Generate 10 MCQ Questions
                                        </>
                                    )}
                                </button>
                                {generating && (
                                    <p className="text-gray-500 text-sm mt-4 animate-pulse">This may take 10-20 seconds...</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Generated Result Preview */}
                    {generatedResult && (
                        <div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                                <span className="text-green-400 font-bold">{generatedResult.message}</span>
                            </div>

                            {generatedResult.test && (
                                <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                                    <h3 className="text-xl font-bold text-luxury-gold mb-2">{generatedResult.test.title}</h3>
                                    <p className="text-gray-400 text-sm">{generatedResult.test.description}</p>
                                    <div className="flex gap-4 mt-3 text-sm">
                                        <span className="text-gray-500">Questions: <span className="text-white">{generatedResult.test.total_questions}</span></span>
                                        <span className="text-gray-500">Duration: <span className="text-white">{generatedResult.test.duration_minutes} min</span></span>
                                        <span className="text-gray-500">Series: <span className="text-white">{generatedResult.test.series_title}</span></span>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-lg font-bold text-white mb-4">Generated Questions ({(generatedResult.questions || []).length})</h3>
                            <div className="space-y-4">
                                {(generatedResult.questions || []).map((q, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="w-8 h-8 bg-luxury-gold/20 rounded-lg flex items-center justify-center text-luxury-gold font-bold text-sm flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-white font-medium">{q.question_text || q.question}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                                            {['a', 'b', 'c', 'd'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className={`p-3 rounded-lg text-sm flex items-center gap-2 ${q.correct_option === opt ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-black/30 text-gray-300'}`}
                                                >
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${q.correct_option === opt ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                        {opt.toUpperCase()}
                                                    </span>
                                                    {q[`option_${opt}`]}
                                                </div>
                                            ))}
                                        </div>
                                        {q.explanation && (
                                            <div className="ml-11 mt-3 p-3 bg-blue-500/10 rounded-lg text-sm text-blue-300">
                                                <strong>Explanation:</strong> {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button onClick={resetSelection} className="bg-luxury-gold text-black font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors flex items-center gap-2">
                                    <Sparkles size={16} /> Generate Another
                                </button>
                                <button onClick={() => setActiveView('tests')} className="bg-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                                    <Eye size={16} /> View All Tests
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* === ALL TESTS VIEW === */}
            {activeView === 'tests' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">All Generated Tests</h2>
                        <button onClick={loadExistingTests} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                            <RefreshCw size={14} className={loadingTests ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>

                    {loadingTests ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="animate-spin w-8 h-8 text-luxury-gold" />
                        </div>
                    ) : existingTests.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl text-gray-400 mb-2">No tests generated yet</h3>
                            <p className="text-gray-500 mb-6">Use the Generator tab to create your first AI-powered MCQ test</p>
                            <button onClick={() => setActiveView('generator')} className="bg-luxury-gold text-black font-bold py-2 px-6 rounded-lg">
                                Go to Generator
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {existingTests.map((test) => (
                                <div key={test.id} className="bg-white/5 rounded-xl border border-white/10 p-5 hover:border-white/20 transition-colors flex items-center gap-4">
                                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <ClipboardList className="w-6 h-6 text-luxury-gold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate">{test.title}</h4>
                                        <p className="text-gray-500 text-sm truncate">{test.series_title}</p>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-400 flex-shrink-0">
                                        <div className="text-center">
                                            <span className="text-white font-bold block">{test.total_questions}</span>
                                            <span className="text-xs">Questions</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-white font-bold block">{test.duration_minutes}</span>
                                            <span className="text-xs">Minutes</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTest(test.id)}
                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                            title="Delete Test"
                                        >
                                            <Trash2 size={16} />
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
    const loadCourses = async () => {
        try {
            const res = await endpoints.getCourses();
            setCourses(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load courses:", error);
            setCourses([]);
        }
    };

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
                {Array.isArray(courses) && courses.map(course => (
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

