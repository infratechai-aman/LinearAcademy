import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import latest from '../assets/latest.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Courses', path: '/courses' },
        { name: 'Test Series', path: '/test-series' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-luxury-black/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={latest}
                        alt="Linear Academy Logo"
                        className="h-28 md:h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-105 -mt-2"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium tracking-widest hover:text-luxury-gold transition-all duration-300 relative group ${location.pathname === link.path ? 'text-luxury-gold' : 'text-gray-400'
                                }`}
                        >
                            {link.name.toUpperCase()}
                            <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        className="relative px-6 py-2 overflow-hidden group border border-luxury-gold/50 rounded-full"
                    >
                        <div className="absolute inset-0 w-full h-full bg-luxury-gold/10 group-hover:bg-luxury-gold transition-all duration-300" />
                        <span className="relative text-luxury-gold group-hover:text-black text-sm font-medium tracking-widest transition-colors duration-300 flex items-center gap-2">
                            ENROLL NOW <Sparkles className="w-3 h-3" />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-luxury-gold transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 w-full bg-luxury-black/95 backdrop-blur-xl border-b border-white/10 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-serif tracking-widest ${location.pathname === link.path ? 'text-luxury-gold' : 'text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
