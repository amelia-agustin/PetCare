// src/components/sections/ServicesSection.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { SERVICES, formatPrice, type ServiceCategory } from '../../data/services';

//Icons 
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

//Types
interface ServicesSectionProps {
    sectionRef: React.RefObject<HTMLElement | null>;
}

//Category Tabs
const CATEGORIES: ('All' | ServiceCategory)[] = ['All', 'Boarding', 'Care', 'Health'];

//Service Card
const ServiceCard = ({ service, onBook }: { service: typeof SERVICES[0]; onBook: (id: string) => void }) => (
    <div className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border ${service.popular ? 'border-violet-200' : 'border-zinc-100'}`}>

        {/* Popular badge */}
        {service.popular && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-btn px-3 py-1">
                <span className="text-[11px] font-semibold text-white">Most Popular</span>
            </div>
        )}

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-zinc-100">
            <img src={service.image} alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
                (e.target as HTMLImageElement).src = `https://placehold.co/400x200/f4f4f5/a1a1aa?text=${encodeURIComponent(service.title)}`;
            }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute bottom-3 left-3">
                <span className="rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                {service.category}
                </span>
            </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
            <h3 className="text-[16px] font-bold text-zinc-800 mb-1">{service.title}</h3>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{service.description}</p>

            {/* Duration */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-4">
                <ClockIcon />
                <span>{service.duration}</span>
            </div>

            {/* Features */}
            <ul className="space-y-1.5 mb-5 flex-1">
                {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                        <CheckIcon />
                        {f}
                    </li>
                ))}
            </ul>

            {/* Price*/}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className='min-w-0 flex-1'>
                    <span className="text-xl font-bold text-zinc-800">{formatPrice(service.price)}</span>
                    <span className="text-xs text-zinc-400 ml-1">/ {service.priceUnit}</span>
                </div>
                <button
                onClick={() => onBook(service.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 outline-none active:scale-95 whitespace-nowrap
                    ${service.popular
                    ? 'bg-btn text-white  hover:scale-[1.02]'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-[1.02]'
                    }`}>
                        Book Now
                </button>
            </div>
        </div>
    </div>
);

//Main Component
const ServicesSection: React.FC<ServicesSectionProps> = ({ sectionRef }) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [activeCategory, setActiveCategory] = useState<'All' | ServiceCategory>('All');

    const filtered = activeCategory === 'All' ? SERVICES : SERVICES.filter(s => s.category === activeCategory);

    const handleBook = (serviceId: string) => {
        if (!user) {
            navigate('/signin');
            return;
        }
        navigate(`/booking/${serviceId}`);
    };

    return (
        <section
        ref={sectionRef}
        className="py-8 bg-linear-to-b from-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-100 px-4 py-1.5 mb-4">
                        <span className="text-xs font-semibold text-violet-600">Our Services</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 mb-4">
                        Choose the <span className="gradient-text">Best Service</span>
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                        Available for cats and dogs. All services are handled by our experienced professional team
                    </p>
                </div>

                {/*Category Tabs*/}
                <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 outline-none
                            ${activeCategory === cat
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
                            }`}>
                                {cat}
                        </button>
                    ))}
                </div>

                {/*Cards Grid*/}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {filtered.map(service => (
                        <ServiceCard
                        key={service.id}
                        service={service}
                        onBook={handleBook}
                        />
                    ))}
                </div>

                {/*Login nudge*/}
                {!user && (
                    <div className="mt-10 text-center">
                        <p className="text-sm text-zinc-400">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/signin')}
                            className="gradient-text font-semibold hover:font-bold transition-all outline-none">
                                Sign in to book.
                            </button>
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default ServicesSection;