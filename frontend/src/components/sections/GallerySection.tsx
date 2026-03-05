import React from 'react';
import { GALLERY_IMAGES, ALL_PETS_IMAGES } from '../../data/constants';

interface GallerySectionProps {
    sectionRef:      React.RefObject<HTMLElement | null>;
    scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
}

    const GallerySection: React.FC<GallerySectionProps> = ({ sectionRef }) => {
    const allImages = [...GALLERY_IMAGES, ...ALL_PETS_IMAGES];
    const images    = [...allImages, ...allImages];

    return (
        <section
        ref={sectionRef}
        className="w-full py-10 lg:py-32 relative overflow-hidden bg-linear-to-t from-white to-purple-50">
            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 blob-bg opacity-10 blur-3xl" />
            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14 px-4">
                    <div className="inline-block px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 font-medium text-xs sm:text-sm mb-4">
                        Gallery
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                        Our Happy <span className="gradient-text">Clients</span>
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                        Thousands of pets have received the best care with us.
                    </p>
                </div>

                {/* Marquee */}
                <div className="overflow-hidden">
                    <style>{`
                        @keyframes marquee {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                        }
                        .marquee-track {
                        display: flex;
                        width: max-content;
                        animation: marquee 30s linear infinite;
                        }
                        .marquee-track:hover {
                        animation-play-state: paused;
                        }
                    `}</style>

                    <div className="marquee-track">
                        {images.map((img, i) => (
                            <div
                            key={i}
                            className="shrink-0 w-44 h-44 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-md"
                            style={{ marginRight: '16px' }}>
                                <img src={img} alt={`Pet ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                draggable={false}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;