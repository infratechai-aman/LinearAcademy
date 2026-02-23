import React from 'react';
import { motion } from 'framer-motion';

const StudentsSection = () => {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // 0. Cleanup old bloated cache
        localStorage.removeItem('students_data');
        localStorage.removeItem('students_data_v2');

        // 1. Check Cache (Permanent)
        const cachedData = localStorage.getItem('students_data_v3');
        if (cachedData) {
            try {
                setStudents(JSON.parse(cachedData));
                setLoading(false);
            } catch (e) {
                console.error("Cache parse error", e);
                localStorage.removeItem('students_data_v3');
            }
        }

        // 2. Fetch Fresh Data (Always fetch in bg or if no cache)
        // If we have cache, we still fetch to update, BUT we don't show loading.
        // If NO cache, we show loading.
        if (!cachedData) setLoading(true);

        import('../services/api').then(module => {
            module.endpoints.getStudents().then(res => {
                const freshData = res.data;
                // Only update state if different (optional optimization, but we just set it for now)
                setStudents(freshData);

                // 3. Smart Caching Strategy
                try {
                    // Store the data (Now lightweight URLs, so should always fit!)
                    localStorage.setItem('students_data_v3', JSON.stringify(freshData));
                } catch (err) {
                    console.warn("Full cache quota exceeded.", err);
                }
            }).catch(err => console.error(err))
                .finally(() => setLoading(false));
        });
    }, []);

    // Skeleton Loader
    if (loading) {
        return (
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-luxury-gold text-sm tracking-widest uppercase mb-4 font-bold animate-pulse">Loading Hall of Fame...</h2>
                    <div className="h-12 w-64 bg-white/5 mx-auto rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-96 animate-pulse">
                            <div className="h-64 bg-white/10" />
                            <div className="p-6 space-y-3">
                                <div className="h-6 w-3/4 bg-white/10 rounded" />
                                <div className="h-4 w-full bg-white/5 rounded" />
                                <div className="h-4 w-2/3 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // If no students after loading, show nothing
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
                                loading="lazy"
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
