import React from 'react';
import { motion } from 'framer-motion';
import StudentsSection from '../components/StudentsSection';
import GallerySection from '../components/GallerySection';

const About = () => {
    return (
        <div className="pt-24 min-h-screen bg-luxury-black text-white">
            {/* Header */}
            <section className="bg-luxury-charcoal py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif mb-6"
                    >
                        Our <span className="text-luxury-gold italic">Legacy</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Crafting the future leaders of tomorrow through discipline, dedication, and excellence.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-lg prose-invert prose-headings:font-serif prose-headings:text-white text-gray-400"
                    >
                        <h2 className="text-3xl mb-8 text-luxury-gold">The Linear Philosophy</h2>
                        <p className="mb-6">
                            Founded with a vision to revolutionize the coaching landscape in Pune, Linear Academy stands as a beacon of academic excellence. We don't just teach; we inspire. Our name, "Linear," reflects our belief in a focused, direct path to success—no distractions, just pure, unadulterated learning.
                        </p>
                        <p className="mb-6">
                            In an era of mass-produced education, we offer a bespoke experience. Like a tailored Italian suit, our curriculum is fitted to the unique needs of each student. We understand that every mind works differently, and our expert faculty is trained to identify and nurture individual strengths.
                        </p>

                        <div className="my-12 p-8 bg-white/5 border-l-4 border-luxury-gold shadow-lg backdrop-blur-sm">
                            <p className="italic text-xl text-white font-serif">
                                "Education is not the filling of a pail, but the lighting of a fire."
                            </p>
                        </div>

                        <h2 className="text-3xl mb-8 text-luxury-gold">Why Yerawada Chooses Us</h2>
                        <p className="mb-6">
                            Located conveniently in Nagpur Chawl, Yerawada, we have become the trusted choice for parents who demand the best for their children. Our facility is designed to be a sanctuary of focus, equipped with modern amenities while maintaining a warm, welcoming atmosphere.
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-6 marker:text-luxury-gold">
                            <li><strong className="text-white">Experienced Faculty:</strong> Mentors with years of proven track records.</li>
                            <li><strong className="text-white">Holistic Development:</strong> Focus on academic scores and conceptual clarity.</li>
                            <li><strong className="text-white">Regular Assessment:</strong> Weekly tests and detailed performance analysis.</li>
                            <li><strong className="text-white">Parent Partnership:</strong> Regular updates and meetings to keep parents in the loop.</li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Students Section */}
            <StudentsSection />

            {/* Gallery Section */}
            <GallerySection />
        </div >
    );
};

export default About;
