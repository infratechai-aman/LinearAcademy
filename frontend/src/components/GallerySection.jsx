import React from 'react';
import { motion } from 'framer-motion';

const GallerySection = () => {
    const images = [
        {
            id: 1,
            url: "/gallery/LinearAcademyGallery1.jpeg",
            caption: "Our Campus"
        },
        {
            id: 2,
            url: "/gallery/LinearAcademyGallery2.jpeg",
            caption: "Student Gathering"
        },
        {
            id: 3,
            url: "/gallery/LinearAcademyGallery3.jpeg",
            caption: "Academy Events"
        },
        {
            id: 4,
            url: "/gallery/LinnearAcademyGallery4.png", // Note: Matches uploaded filename
            caption: "Classroom Session"
        },
        {
            id: 5,
            url: "/gallery/LinearAcademyGallery5.png",
            caption: "Focused Learning"
        },
        {
            id: 6,
            url: "/gallery/LinearAcademyGallery6.png",
            caption: "Interactive Learning"
        },
        {
            id: 7,
            url: "/gallery/LinearAcademyGallery7.png",
            caption: "Academic Excellence"
        },
        {
            id: 8,
            url: "/gallery/LinearAcademyGallery8.png",
            caption: "Modern Facilities"
        }
    ];

    return (
        <section className="py-24 bg-luxury-charcoal relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Life at <span className="text-luxury-gold italic">Linear</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A glimpse into the environment where excellence is cultivated.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {images.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-80 overflow-hidden rounded-lg cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
                            <img
                                src={img.url}
                                alt={img.caption}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl font-serif text-white">{img.caption}</h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-luxury-gold transition-all duration-500 mt-2" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
