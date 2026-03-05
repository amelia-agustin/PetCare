import React from 'react';
import { STATS } from '../../data/constants';

interface StatsSectionProps {
    counters: number[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ counters }) => {
    return (
        <section id="stats-section" className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                    {STATS.map((stat, i) => (
                        <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2">
                                {counters[i]}{stat.suffix}
                            </div>
                            <p className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;