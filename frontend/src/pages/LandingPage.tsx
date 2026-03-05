"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/global.css';
import { useScrolled, useStatsCounter } from '../hooks/usePetCare';
import Navbar  from '../components/ui/Navbar';
import Footer  from '../components/ui/Footer';
import HeroSection         from '../components/sections/HeroSection';
import StatsSection        from '../components/sections/StatsSection';
import AboutSection        from '../components/sections/AboutSection';
import ServicesSection     from '../components/sections/ServicesSection';
import GallerySection      from '../components/sections/GallerySection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection      from '../components/sections/ContactSection';


const NAVBAR_HEIGHT = 80;
const LandingPage: React.FC = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    }, [mobileMenuOpen]);

    const scrolled = useScrolled();      
    const counters  = useStatsCounter();  

    const homeRef         = useRef<HTMLElement>(null);
    const aboutRef        = useRef<HTMLElement>(null);
    const servicesRef     = useRef<HTMLElement>(null);
    const galleryRef      = useRef<HTMLElement>(null);
    const testimonialsRef = useRef<HTMLElement>(null);
    const contactRef      = useRef<HTMLElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
        if (!ref.current) return;
        const y = ref.current.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setMobileMenuOpen(false); 
    };

    const handleGetStarted = () => {
        setTimeout(() => scrollToSection(servicesRef), 300);
    };

    const allRefs    = { homeRef, aboutRef, servicesRef, galleryRef, testimonialsRef, contactRef };
    const footerRefs = { aboutRef, servicesRef, galleryRef };

    const handleSignOut = async () => {
        await logout();        
        setMobileMenuOpen(false);
    };

    useEffect(() => {
    if (window.location.hash === '#services') {
        setTimeout(() => scrollToSection(servicesRef), 300);
    }
    }, []);

    return (
        <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">

        {/* Navigation */}
        <Navbar
            scrolled={scrolled}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            scrollToSection={scrollToSection}
            refs={allRefs}
            user={user}
            onSignIn={() => navigate('/signin')}
            onSignUp={() => navigate('/signup')}
            onSignOut={handleSignOut}
            onCartClick={() => navigate('/bookings')}
            onProfileClick={() => navigate('profile')}
        />

        {/* Main contents */}
        <main>
            <HeroSection     sectionRef={homeRef}         onGetStarted={handleGetStarted} />
            <StatsSection    counters={counters} />
            <AboutSection    sectionRef={aboutRef} />
            <ServicesSection sectionRef={servicesRef} />
            <GallerySection  sectionRef={galleryRef}      scrollToSection={scrollToSection} />
            <TestimonialsSection sectionRef={testimonialsRef} />
            <ContactSection  sectionRef={contactRef} />
        </main>

        {/* Footer */}
        <Footer scrollToSection={scrollToSection} refs={footerRefs} />

        </div>
    );
};

export default LandingPage;