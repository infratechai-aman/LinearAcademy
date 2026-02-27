import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-luxury-black">
      {/* Background Image with "Nano Banana" Edits (CSS Filters) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-luxury-black z-10" /> {/* Professional Lighting Overlay */}
        <img
          src={heroBg}
          alt="Linear Classes Classroom"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-80" // Slight blur and scale as requested
        />
      </div>

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl shadow-luxury-gold/10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">The Future of Coaching</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-serif text-white mb-6 leading-tight tracking-tight">
            Linear <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-[#fff5d6] to-luxury-gold animate-gradient">Academy</span> – JEE &amp; NEET Coaching
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Experience the next generation of education. Advanced methodology, expert faculty, and a premium environment designed for top-tier results.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              to="/courses"
              className="group relative px-8 py-4 bg-luxury-gold text-black font-bold tracking-widest overflow-hidden rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                EXPLORE COURSES <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/30 text-white font-medium tracking-widest rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-md"
            >
              BOOK A DEMO
            </Link>
          </div>
        </motion.div>
      </div >

      {/* Scroll Indicator */}
      < motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-luxury-gold to-transparent" />
      </motion.div >
    </section >
  );
};

export default Hero;
