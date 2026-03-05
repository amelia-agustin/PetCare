// src/components/sections/ContactSection.tsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

interface ContactSectionProps {
    sectionRef: React.RefObject<HTMLElement | null>;
}

const FieldErrorMsg = ({ message }: { message?: string }) =>
    message ? <p className="mt-1 ml-1 text-xs text-rose-500">{message}</p> : null;

    const GlassInputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError?: boolean }) => (
    <div className={`rounded-xl border bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-200
        ${hasError ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-200 hover:border-zinc-300'}`}>
        {children}
    </div>
);

const ContactSection: React.FC<ContactSectionProps> = ({ sectionRef }) => {
    const [formData, setFormData]   = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading]     = useState(false);
    const [errors, setErrors]       = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = { name: '', email: '', message: '' };
        if (!formData.name.trim())    newErrors.name    = 'Name is required.';
        if (!formData.email.trim())   newErrors.email   = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
        if (!formData.message.trim()) newErrors.message = 'Message is required.';

        if (Object.values(newErrors).some(v => v)) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <section
        ref={sectionRef}
        className="py-16 sm:py-20  relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-violet-50"
        >
        <div className="absolute top-0 right-0 w-96 h-96 blob-bg opacity-10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
                <div className="inline-block px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 font-medium text-xs sm:text-sm mb-4">
                    Contact Us
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    Get in Touch with <span className="gradient-text">Our Team</span>
                </h2>
                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Have questions about our services? Our team is ready to help you find the best care for your pet.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-6 sm:px-8 py-5 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-zinc-800">Send a Message</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">We'll get back to you within 24 hours.</p>
                </div>

                <div className="px-6 sm:px-8 py-6">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h4 className="text-base font-bold text-zinc-800 mb-1">Message Sent!</h4>
                        <p className="text-sm text-zinc-400 mb-5">
                            Thank you, {formData.name}. Our team will reach out to you shortly.
                        </p>
                        <button
                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                        className="text-xs font-medium text-violet-600 hover:text-violet-700 underline outline-none"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-800 ml-1">Name</label>
                                <GlassInputWrapper hasError={!!errors.name}>
                                    <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none"
                                    />
                                </GlassInputWrapper>
                                <FieldErrorMsg message={errors.name} />
                            </div>
                            <div>
                            <label className="text-xs font-semibold text-zinc-800 ml-1">Email</label>
                            <GlassInputWrapper hasError={!!errors.email}>
                                <input
                                type="text"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none"
                                />
                            </GlassInputWrapper>
                            <FieldErrorMsg message={errors.email} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-800 ml-1">Message</label>
                            <GlassInputWrapper hasError={!!errors.message}>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us about your pet's needs..."
                                    value={formData.message}
                                    onChange={e => handleChange('message', e.target.value)}
                                    className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none resize-none"
                                />
                            </GlassInputWrapper>
                            <FieldErrorMsg message={errors.message} />
                        </div>

                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                        >
                            {loading
                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                            : <><Send size={15} /> Send Message</>
                            }
                        </button>
                    </form>
                )}
                </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-6 sm:px-8 py-5 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-zinc-800">Contact Information</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Fell free to contact us.</p>
                </div>

                <div className="px-6 sm:px-8 py-4 space-y-1">
                    {[
                        { icon: MapPin, value: 'Jl. Sudirman No. 123', sub: 'South Jakarta, 12190' },
                        { icon: Phone,  value: '+62 812 3456 7890',    sub: 'Monday - Saturday, 08.00 - 20.00' },
                        { icon: Mail,   value: 'hello@petcare.id',      sub: 'Reply within 24 hours' },
                        { icon: Clock,  value: 'Every Day',             sub: '08.00 - 20.00 WIB' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 py-3">
                            <div className="shrink-0 w-9 h-9 flex items-center justify-center text-zinc-800">
                                <item.icon size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-800">{item.value}</p>
                                <p className="text-xs text-zinc-400">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social media */}
                <div className="px-6 sm:px-8 py-5 border-t border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Social Media</p>
                    <div className="flex items-center gap-3">
                        {[
                        { label: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                        { label: 'Facebook',  href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                        { label: 'WhatsApp', href: '#', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
                        { label: 'TikTok',   href: '#', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                        ].map((s, i) => (
                        <a key={i} href={s.href}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 hover:bg-violet-100 hover:text-violet-600 text-zinc-500 transition-all"
                            aria-label={s.label}>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d={s.icon} />
                            </svg>
                        </a>
                        ))}
                    </div>
                </div>
            </div>

            </div>
        </div>
        </section>
    );
};

export default ContactSection;