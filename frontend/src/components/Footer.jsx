import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, GraduationCap, Youtube, MessageCircle } from 'lucide-react';
import { endpoints } from '../services/api';

const Footer = () => {
    const [config, setConfig] = useState({
        phone_number: "+91 98765 43210",
        email: "info@linearclasses.com",
        address: "191, Nagpur Chawl, Yerawada, Pune - 411006, Maharashtra, India",
        facebook_url: "https://www.facebook.com/people/Linear-classes/100070855656498/",
        instagram_url: "https://www.instagram.com/linear_classes/",
        whatsapp_number: "",
        youtube_url: ""
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await endpoints.getConfig();
                if (response.data) {
                    setConfig(prev => ({ ...prev, ...response.data }));
                }
            } catch (error) {
                console.error("Failed to fetch site config", error);
            }
        };
        fetchConfig();
    }, []);

    return (
        <footer className="bg-luxury-charcoal text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <GraduationCap className="w-8 h-8 text-luxury-gold" />
                            <span className="text-2xl font-serif font-bold tracking-wider">
                                LINEAR <span className="text-luxury-gold">ACADEMY</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Empowering students with knowledge and discipline. The premier coaching institute in Yerawada for Science and Commerce.
                        </p>
                        <div className="flex gap-4">
                            {config.instagram_url && (
                                <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {config.facebook_url && (
                                <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {config.whatsapp_number && (
                                <a href={`https://wa.me/${config.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300">
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            )}
                            {config.youtube_url && (
                                <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300">
                                    <Youtube className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 text-luxury-gold">Quick Links</h3>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Courses', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-luxury-gold transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 text-luxury-gold">Our Courses</h3>
                        <ul className="space-y-4">
                            <li className="text-gray-400">Class 9th & 10th (State/CBSE)</li>
                            <li className="text-gray-400">Class 11th & 12th Science</li>
                            <li className="text-gray-400">Class 11th & 12th Commerce</li>
                            <li className="text-gray-400">NEET / JEE Foundation</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6 text-luxury-gold">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-gray-400">
                                <MapPin className="w-6 h-6 text-luxury-gold shrink-0" />
                                <span>
                                    {config.address.split(',').map((line, i) => (
                                        <span key={i} className="block">{line.trim()}</span>
                                    ))}
                                </span>
                            </li>
                            <li className="flex gap-4 text-gray-400">
                                <Phone className="w-5 h-5 text-luxury-gold shrink-0" />
                                <span>{config.phone_number}</span>
                            </li>
                            <li className="flex gap-4 text-gray-400">
                                <Mail className="w-5 h-5 text-luxury-gold shrink-0" />
                                <span>{config.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Linear Academy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
