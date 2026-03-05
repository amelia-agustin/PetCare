import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GALLERY_IMAGES } from '../../data/constants';

interface HeroSectionProps {
    sectionRef:    React.RefObject<HTMLElement | null>;
    onGetStarted:  (petType: string, date: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ sectionRef, onGetStarted }) => {
    const [bookingData, setBookingData] = useState({ petType: '', appointmentDate: '' });
    const [showGreeting, setShowGreeting] = useState(false);

    const handleClick = () => {
        if (!bookingData.petType || !bookingData.appointmentDate) return;
        setShowGreeting(true);
        onGetStarted(bookingData.petType, bookingData.appointmentDate);
    };

    const formattedDate = bookingData.appointmentDate
        ? new Date(bookingData.appointmentDate).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
        })
        : '';

    return (
        <section
        ref={sectionRef}
        className="w-full min-h-screen flex items-center relative">
            {/* Decorative backgrounds */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50" />
            <div className="absolute top-20 right-10 w-72 h-72 blob-bg opacity-20 blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 blob-bg opacity-10 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

                <div className="text-left space-y-4 sm:space-y-6 lg:space-y-8 fade-in">
                    <div className="inline-block px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 font-medium text-xs sm:text-sm">
                        We Are PetCare
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Feel Your Way For{' '}
                        <span className="gradient-text">Pet Freshness</span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                        Experience the epitome of pet grooming with PetCare. We provide top-notch cleaning
                        services tailored to your furry friend's needs, ensuring they feel fresh and loved
                        every time.
                    </p>

                    {/* Success greeting */}
                    {showGreeting && (
                        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg fade-in text-sm sm:text-base">
                            Great! Your {bookingData.petType} appointment is scheduled for {formattedDate}. 
                            Let's find the perfect care package! 
                        </div>
                    )}

                    {/* Social Proof */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex -space-x-2 sm:-space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-purple-400 to-blue-400 border-2 border-white" />
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Over <strong>2,500+</strong> Happy Clients
                        </p>
                    </div>
                </div>

                <div className="relative slide-in-right hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl floating">
                                <img src={GALLERY_IMAGES[0]} alt="Pet care" className="w-full h-48 lg:h-64 object-cover" />
                            </div>
                            <div className="bg-white p-4 lg:p-6 rounded-3xl shadow-xl smooth-shadow">
                                <div className="text-3xl lg:text-4xl font-bold gradient-text">16+</div>
                                <div className="text-gray-600 text-xs lg:text-sm mt-1">Years Experience</div>
                            </div>
                        </div>
                        <div className="space-y-4 mt-8">
                            <div className="bg-white p-4 lg:p-6 rounded-3xl shadow-xl smooth-shadow">
                                <h3 className="font-bold text-gray-800 mb-2 text-sm lg:text-base">Why Choose PetCare</h3>
                                <ul className="text-xs lg:text-sm text-gray-600 space-y-1">
                                <li>✓ Expert groomers</li>
                                <li>✓ Premium products</li>
                                <li>✓ Loving care</li>
                                </ul>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-xl floating" style={{ animationDelay: '0.5s' }}>
                                <img src={GALLERY_IMAGES[1]} alt="Pet care" className="w-full h-48 lg:h-64 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;