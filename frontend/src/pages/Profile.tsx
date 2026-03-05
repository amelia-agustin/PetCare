import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import {
    getProfile,
    updateProfile,
    changePassword,
    type UserProfile,
    type ProfileApiError,
} from '../services/ProfileService';

const GlassInputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError?: boolean }) => (
    <div className={`rounded-xl border bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-200
        ${hasError ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-200 hover:border-zinc-300'}`}>
        {children}
    </div>
);

//Field Error
const FieldErrorMsg = ({ message }: { message?: string }) =>
    message ? <p className="mt-1 ml-1 text-xs text-rose-500">{message}</p> : null;

//success Banner
const SuccessBanner = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        <p className="text-sm text-emerald-700">{message}</p>
    </div>
);

//Error Banner
const ErrorBanner = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
        <span className="text-rose-500 shrink-0">⚠</span>
        <p className="text-sm text-rose-600">{message}</p>
    </div>
);

//Section Card
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100">
        <h2 className="text-[18px] font-semibold text-zinc-800">{title}</h2>
        </div>
        <div className="px-6 py-5">{children}</div>
    </div>
);

//Avatar Initials
const AvatarLarge = ({ name }: { name: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-btn text-white text-2xl font-bold">
        {initials}
        </div>
    );
};

//Main Component
const Profile: React.FC = () => {
    const navigate        = useNavigate();
    const { user, setUser } = useAuthContext();

    //Profile state
    const [profile, setProfile]         = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [displayName, setDisplayName] = useState('');   
    const [displayEmail, setDisplayEmail] = useState('');

    // Edit profile state
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileApiError, setProfileApiError] = useState('');

    // Change password state
    const [currentPassword, setCurrentPassword]   = useState('');
    const [newPassword, setNewPassword]           = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrent, setShowCurrent]           = useState(false);
    const [showNew, setShowNew]                   = useState(false);
    const [showConfirm, setShowConfirm]           = useState(false);
    const [passwordErrors, setPasswordErrors]     = useState<Record<string, string>>({});
    const [passwordLoading, setPasswordLoading]   = useState(false);
    const [passwordSuccess, setPasswordSuccess]   = useState('');
    const [passwordApiError, setPasswordApiError] = useState('');

    // Load profile on mount 
    useEffect(() => {
        const load = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone ?? '');
            setDisplayName(data.name);
            setDisplayEmail(data.email);
        } catch {
            if (user) {
            setName(user.name);
            setEmail(user.email);
            }
        } finally {
            setLoadingProfile(false);
        }
        };
        load();
    }, []);

    // Validate profile form 
    const validateProfile = () => {
        const errors: Record<string, string> = {};
        if (!name.trim())           errors.name  = 'Name is required.';
        if (name.trim().length < 2) errors.name  = 'Name must be at least 2 characters.';
        if (!email.trim())          errors.email = 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email.';
        if (phone && !/^[0-9+\-\s()]{8,15}$/.test(phone)) errors.phone = 'Please enter a valid phone number.';
        return errors;
    };

    // Handle profile update 
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileApiError('');
        setProfileSuccess('');

        const errors = validateProfile();
        if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }
        setProfileErrors({});

        setProfileLoading(true);
        try {
            const updated = await updateProfile({ name, email, phone });
            setProfile(updated);
            setUser({ ...user!, name: updated.name, email: updated.email });
            setProfileSuccess('Profile updated successfully.');
            setDisplayName(updated.name);
            setDisplayEmail(updated.email);
            setTimeout(() => setProfileSuccess(''),3000);
        } catch (err) {
            setProfileApiError((err as ProfileApiError).message);
        } finally {
            setProfileLoading(false);
        }
    };

    // Validate password form 
    const validatePassword = () => {
        const errors: Record<string, string> = {};
        if (!currentPassword)            errors.currentPassword = 'Current password is required.';
        if (!newPassword)                errors.newPassword     = 'New password is required.';
        if (newPassword.length < 8)      errors.newPassword     = 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(newPassword))  errors.newPassword     = 'Include at least one uppercase letter.';
        if (!/[0-9]/.test(newPassword))  errors.newPassword     = 'Include at least one number.';
        if (newPassword !== confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match.';
        return errors;
    };

    // Handle password change 
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordApiError('');
        setPasswordSuccess('');

        const errors = validatePassword();
        if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }
        setPasswordErrors({});

        setPasswordLoading(true);
        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordSuccess('Password changed successfully.');
            setTimeout(() => setPasswordSuccess(''), 3000);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setPasswordApiError((err as ProfileApiError).message);
        } finally {
            setPasswordLoading(false);
        }
    };

    // Loading state
    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            <style>{`
                @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to   { opacity: 1; transform: translateY(0); }
                }
                .anim { opacity: 0; animation: fadeUp 0.4s ease forwards; }
                .d1 { animation-delay: 0.05s; }
                .d2 { animation-delay: 0.10s; }
                .d3 { animation-delay: 0.15s; }
            `}</style>

            {/* Blob background */}
            <div className="fixed -top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl pointer-events-none" />
            <div className="fixed -bottom-20 -right-10 w-60 h-60 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6">
                {/* Back button */}
                <button onClick={() => navigate(-1)}
                className="anim d1 mb-6 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors outline-none">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                </button>

                {/* Header */}
                <div className="anim d1 mb-8 flex flex-col items-center gap-5">
                    <AvatarLarge name={displayName || user?.name || 'U'} />
                    <div className='flex flex-col items-center'>
                        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">{displayName || user?.name}</h1>
                        <p className="text-sm text-zinc-400 mt-0.5">{displayEmail || user?.email}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Personal Information */}
                    <div className="anim d2">
                        <SectionCard title="Personal Information">
                            <form onSubmit={handleProfileUpdate} noValidate className="space-y-4">

                                {profileApiError && <ErrorBanner message={profileApiError} />}
                                {profileSuccess  && <SuccessBanner message={profileSuccess} />}

                                {/* Name */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">Full Name</label>
                                    <GlassInputWrapper hasError={!!profileErrors.name}>
                                        <div className="flex items-center">
                                        <span className="pl-3 text-zinc-300"><User className="w-4 h-4" /></span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => { setName(e.target.value); setProfileErrors({}); setProfileSuccess(''); }}
                                            placeholder="Your full name"
                                            autoComplete="name"
                                            className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 focus:outline-none"
                                        />
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={profileErrors.name} />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">Email Address</label>
                                    <GlassInputWrapper hasError={!!profileErrors.email}>
                                        <div className="flex items-center">
                                            <span className="pl-3 text-zinc-300"><Mail className="w-4 h-4" /></span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setProfileErrors({}); setProfileSuccess(''); }}
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 focus:outline-none"
                                            />
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={profileErrors.email} />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">
                                        Phone Number
                                        <span className="ml-1.5 text-zinc-400 font-normal">(optional)</span>
                                    </label>
                                    <GlassInputWrapper hasError={!!profileErrors.phone}>
                                        <div className="flex items-center">
                                            <span className="pl-3 text-zinc-300"><Phone className="w-4 h-4" /></span>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={e => { setPhone(e.target.value); setProfileErrors({}); setProfileSuccess(''); }}
                                                placeholder="+62 812 3456 7890"
                                                autoComplete="tel"
                                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 focus:outline-none"
                                            />
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={profileErrors.phone} />
                                    <p className="mt-1 ml-0.5 text-[11px] text-zinc-400">Used by our team to contact you regarding your bookings.</p>
                                </div>

                                <button type="submit" disabled={profileLoading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 outline-none">
                                    {profileLoading
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        : 'Save Changes'}
                                </button>
                            </form>
                        </SectionCard>
                    </div>

                    {/* Change Password */}
                    <div className="anim d3">
                        <SectionCard title="Change Password">
                            <form onSubmit={handlePasswordChange} noValidate className="space-y-4">

                                {passwordApiError && <ErrorBanner message={passwordApiError} />}
                                {passwordSuccess  && <SuccessBanner message={passwordSuccess} />}

                                {/* Current password */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">Current Password</label>
                                    <GlassInputWrapper hasError={!!passwordErrors.currentPassword}>
                                        <div className="relative flex items-center">
                                            <span className="pl-3 text-zinc-300"><Lock className="w-4 h-4" /></span>
                                            <input
                                                type={showCurrent ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={e => { setCurrentPassword(e.target.value); setPasswordErrors({}); setPasswordSuccess(''); }}
                                                placeholder="Your current password"
                                                autoComplete="current-password"
                                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 pr-10 focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3 text-zinc-300 hover:text-zinc-600 transition-colors outline-none">
                                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={passwordErrors.currentPassword} />
                                </div>

                                {/* New password */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">New Password</label>
                                    <GlassInputWrapper hasError={!!passwordErrors.newPassword}>
                                        <div className="relative flex items-center">
                                            <span className="pl-3 text-zinc-300"><Lock className="w-4 h-4" /></span>
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={e => { setNewPassword(e.target.value); setPasswordErrors({}); setPasswordSuccess(''); }}
                                                placeholder="Min. 8 characters"
                                                autoComplete="new-password"
                                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 pr-10 focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 text-zinc-300 hover:text-zinc-600 transition-colors outline-none">
                                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={passwordErrors.newPassword} />
                                </div>

                                {/* Confirm new password */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600 ml-0.5">Confirm New Password</label>
                                    <GlassInputWrapper hasError={!!passwordErrors.confirmNewPassword}>
                                        <div className="relative flex items-center">
                                            <span className="pl-3 text-zinc-300"><Lock className="w-4 h-4" /></span>
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                value={confirmNewPassword}
                                                onChange={e => { setConfirmNewPassword(e.target.value); setPasswordErrors({}); setPasswordSuccess(''); }}
                                                placeholder="Repeat new password"
                                                autoComplete="new-password"
                                                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 pr-10 focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 text-zinc-300 hover:text-zinc-600 transition-colors outline-none">
                                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </GlassInputWrapper>
                                    <FieldErrorMsg message={passwordErrors.confirmNewPassword} />
                                </div>

                                <button type="submit" disabled={passwordLoading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 outline-none">
                                    {passwordLoading
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</>
                                        : 'Change Password'}
                                </button>
                            </form>
                        </SectionCard>
                    </div>
                    </div>
            </div>
        </div>
    );
};

export default Profile;