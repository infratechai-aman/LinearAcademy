import React from 'react';
import { motion } from 'framer-motion';

const StudentsSection = () => {
    const [students, setStudents] = React.useState([]);

    React.useEffect(() => {
        // Dynamic import to avoid circular dependencies if any, though standard import is fine here
        import('../services/api').then(module => {
            module.endpoints.getStudents().then(res => {
                setStudents(res.data);
            }).catch(err => console.error(err));
        });
    }, []);

    // If no students, show a placeholder or nothing. 
    // User requested to see it, so let's show a placeholder if empty to confirm existence
    if (students.length === 0) {
        return null;
    }

    return (
        <section className="py-24 container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-luxury-gold text-sm tracking-widest uppercase mb-4 font-bold">Hall of Fame</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-white">Our Top <span className="italic text-luxury-gold">Performers</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(students) && students.map((student) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-luxury-gold/50 transition-all duration-500 group"
                    >
                        <div className="h-64 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src={student.image_url || "https://via.placeholder.com/300x400"}
                                alt={student.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="bg-luxury-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {student.rank}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-serif font-bold text-white mb-2">{student.name}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {student.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StudentsSection;
