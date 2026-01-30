import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pt-24 min-h-screen bg-luxury-black text-white">
            <section className="bg-luxury-charcoal py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif mb-6"
                    >
                        Get in <span className="text-luxury-gold italic">Touch</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Begin your journey to excellence. Visit us or send an inquiry today.
                    </p>
                </div>
            </section>

            <section className="py-24 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/3 space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-6">Visit Our Campus</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-luxury-gold rounded-lg">
                                        <MapPin />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Address</h4>
                                        <p className="text-gray-400">191, Nagpur Chawl,<br />Yerawada, Pune - 411006<br />Maharashtra, India</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-luxury-gold rounded-lg">
                                        <Phone />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Phone</h4>
                                        <p className="text-gray-400">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-luxury-gold rounded-lg">
                                        <Mail />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Email</h4>
                                        <p className="text-gray-400">info@linearclasses.com</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-sm text-luxury-gold rounded-lg">
                                        <Clock />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Office Hours</h4>
                                        <p className="text-gray-400">Mon - Sat: 9:00 AM - 8:00 PM<br />Sun: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-2/3 bg-white/5 backdrop-blur-md p-10 shadow-2xl border border-white/10 rounded-2xl"
                    >
                        <h3 className="text-2xl font-serif font-bold text-white mb-8">Send an Inquiry</h3>
                        <ContactForm />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const ContactForm = () => {
    const [formData, setFormData] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        course_interest: 'Class 9th & 10th',
        message: ''
    });
    const [status, setStatus] = React.useState('idle');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await import('../services/api').then(module => module.endpoints.createEnquiry(formData));
            setStatus('success');
            setFormData({ first_name: '', last_name: '', email: '', phone: '', course_interest: 'Class 9th & 10th', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">First Name</label>
                    <input
                        required
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        type="text"
                        className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white placeholder-gray-600"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Last Name</label>
                    <input
                        required
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        type="text"
                        className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white placeholder-gray-600"
                        placeholder="Doe"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white placeholder-gray-600"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone Number</label>
                <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white placeholder-gray-600"
                    placeholder="+91 98765 43210"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Course Interested In</label>
                <select
                    name="course_interest"
                    value={formData.course_interest}
                    onChange={handleChange}
                    className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white"
                >
                    <option className="bg-luxury-charcoal" value="Class 9th & 10th">Class 9th & 10th</option>
                    <option className="bg-luxury-charcoal" value="Class 11th & 12th Science">Class 11th & 12th Science</option>
                    <option className="bg-luxury-charcoal" value="Class 11th & 12th Commerce">Class 11th & 12th Commerce</option>
                    <option className="bg-luxury-charcoal" value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border-b border-gray-600 py-2 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent text-white placeholder-gray-600"
                    placeholder="How can we help you?"
                ></textarea>
            </div>

            {status === 'success' && <p className="text-green-400">Message sent successfully!</p>}
            {status === 'error' && <p className="text-red-400">Failed to send message. Please try again.</p>}

            <button disabled={status === 'loading'} type="submit" className="bg-luxury-gold text-black px-10 py-4 font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase text-sm rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] disabled:opacity-50">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
        </form>

    );
};

export default Contact;
