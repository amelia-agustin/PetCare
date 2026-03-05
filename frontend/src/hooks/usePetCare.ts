import { useState, useEffect } from 'react';
import { STATS } from '../data/constants';

export const useScrolled = (threshold = 100): boolean => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return scrolled;
};

export const useStatsCounter = (): number[] => {
    const [counters, setCounters]     = useState<number[]>(STATS.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (hasAnimated) return;

        const section = document.getElementById('stats-section');
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setHasAnimated(true);

                STATS.forEach((stat, index) => {
                let current = 0;
                const increment = stat.value / 60;

                const timer = setInterval(() => {
                    current += increment;
                    setCounters(prev => {
                    const next = [...prev];
                    next[index] = current >= stat.value ? stat.value : Math.floor(current);
                    return next;
                    });
                    if (current >= stat.value) clearInterval(timer);
                }, 20);
                });

                observer.disconnect();
            },
            { threshold: 0.4 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [hasAnimated]);

    return counters;
};