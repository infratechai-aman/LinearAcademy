import React from 'react';
import Hero from '../components/Hero';
import StudentsSection from '../components/StudentsSection';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, TrendingUp } from 'lucide-react';
import baner from '../assets/baner.png';

const Home = () => {
    const features = [
        {
            icon: <Award className="w-8 h-8 text-luxury-gold" />,
            title: "Expert Faculty",
            description: "Learn from the masters. Our educators are industry veterans dedicated to sculpting young minds."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-luxury-gold" />,
            title: "Curated Curriculum",
            description: "A syllabus designed not just to pass exams, but to foster deep understanding and critical thinking."
        },
        {
            icon: <Users className="w-8 h-8 text-luxury-gold" />,
            title: "Personalized Attention",
            description: "Small batch sizes ensure every student receives the guidance they need to flourish."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-luxury-gold" />,
            title: "Proven Results",
            description: "A legacy of top rankers and successful alumni who have excelled in their respective fields."
        }
    ];

    return (
        <div className="bg-luxury-black text-white">
            <Hero />

            {/* Introduction Section */}
            <section className="py-24 px-6 container mx-auto relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <h2 className="text-luxury-gold text-sm tracking-widest uppercase mb-4 font-bold">About Linear Academy</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
                            Where Knowledge Meets <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-white">Innovation</span>
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            At Linear Academy, we believe education is an art form. Located in the heart of Yerawada, Pune, we provide a sanctuary for learning that transcends traditional coaching.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Our approach combines rigorous academic discipline with a supportive, inspiring environment, ensuring every student achieves their highest potential in Science and Commerce.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 relative group"
                    >
                        <div className="absolute inset-0 border-2 border-luxury-gold/30 translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                        <div className="absolute inset-0 bg-luxury-gold/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img
                            src={baner}
                            alt="Linear Academy Banner"
                            className="w-full h-[500px] object-contain shadow-2xl transition-all duration-700 hover:scale-105"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Our Students Section */}
            <StudentsSection />

            {/* Features Grid */}
            <section className="py-24 bg-luxury-charcoal relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="text-center p-8 border border-white/5 hover:border-luxury-gold/50 hover:bg-white/5 transition-all duration-500 rounded-2xl group"
                            >
                                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-serif font-bold mb-4 text-white group-hover:text-luxury-gold transition-colors">{feature.title}</h4>
                                <p className="text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
