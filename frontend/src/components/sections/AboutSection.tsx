import React from 'react';
import { ABOUT_FEATURES } from '../../data/constants';

interface AboutSectionProps {
    sectionRef: React.RefObject<HTMLElement | null>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ sectionRef }) => {
    return (
        <section
        ref={sectionRef}
        className="min-h-screen flex items-center py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-linear-to-b from-slate-50 to-white"
        >
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 blob-bg opacity-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
                <div className="inline-block px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 font-medium text-xs sm:text-sm mb-4">
                    About Us
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                    We Make Pets Clean & <span className="gradient-text">Bright</span>
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg">
                    At PetCare, we're dedicated to transforming your loving and caring spaces into spotless
                    havens of tranquility and comfort. Our team of highly skilled professionals uses
                    eco-friendly products and innovative techniques to ensure your pet receives the
                    exceptional care it deserves.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {ABOUT_FEATURES.map((item, i) => (
                <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg smooth-shadow card-hover text-center"
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <item.icon className="text-blue-800" size={50} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                </div>
            ))}
            </div>

        </div>
        </section>
    );
};

export default AboutSection;