// src/components/sections/TestimonialsSection.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/constants';

interface TestimonialsSectionProps {
    sectionRef: React.RefObject<HTMLElement | null>;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ sectionRef }) => {
    return (
        <section
        ref={sectionRef}
        className="py-16 sm:py-26 lg:py-34 bg-linear-to-b from-slate-50 via-violet-50/20 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-block px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 font-medium text-xs sm:text-sm mb-4">
                        Testimonials
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        What Our <span className="gradient-text">Clients Say</span>
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                        Our customers’ trust is our top priority.
                    </p>
                </div>

                {/*Cards*/}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {TESTIMONIALS.map((test, i) => (
                        <div
                        key={i}
                        className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-5 right-6 opacity-10">
                                <Quote className="w-10 h-10 text-violet-600" fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(test.rating)].map((_, j) => (
                                    <Star key={j} size={15} className="text-amber-400" fill="#fbbf24" />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 italic">
                                "{test.text}"
                            </p>

                            <div className="h-px bg-zinc-100 mb-5" />

                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src={test.avatar}
                                        alt={test.name}
                                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-violet-100"
                                        onError={e => {
                                            const el = e.target as HTMLImageElement;
                                            el.style.display = 'none';
                                            const fallback = el.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-violet-400 to-blue-400 items-center justify-center text-white font-bold text-sm shrink-0"
                                    style={{ display: 'none' }}>
                                        {test.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-zinc-800 text-sm truncate">{test.name}</p>
                                    <p className="text-xs text-zinc-400">{test.role} · {test.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;