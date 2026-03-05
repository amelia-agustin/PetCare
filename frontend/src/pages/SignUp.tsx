import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';
import { validateSignUpForm, type FieldError } from '../utils/validation';
import type {AuthUser} from '../services/AuthService.ts';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"/>
  </svg>
);

// Field Error
const FieldErrorMsg = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 ml-1 text-xs text-rose-500">{message}</p> : null;

// Glass Input Wrapper
const GlassInputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError?: boolean }) => (
  <div className={`mt-1.5 rounded-xl border bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-200
    ${hasError ? 'border-zinc-400 bg-rose-50/30' : 'border-zinc-300 hover:border-zinc-400'}`}>
    {children}
  </div>
);

// Types
interface SignUpProps {
  heroImageSrc?: string;
  onSuccess?: () => void;
  onSignIn?: () => void;
  onNavigateHome?: () => void;
  onUserChange?: (user: AuthUser | null) => void;
}

// Main Component
const SignUp: React.FC<SignUpProps> = ({
  heroImageSrc = "/background/bg-auth.jpg",
  onSuccess,
  onSignIn,
  onNavigateHome,
  onUserChange,
}) => {
  const { loading, error, handleSignUp, handleGoogleSignIn, clearError } = useAuth(onSuccess, onUserChange);

  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [fieldErrors, setFieldErrors]         = useState<FieldError[]>([]);

  const getFieldError = (field: string) =>
    fieldErrors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const errors = validateSignUpForm(name, email, password, confirmPassword);
    if (errors.length > 0) { setFieldErrors(errors); return; }
    setFieldErrors([]);

    const user = await handleSignUp({ name, email, password, confirmPassword });

    if (user) onSuccess?.();
  };

  return (
    <div className="h-dvh flex flex-col md:flex-row overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { opacity: 0; animation: fadeUp 0.5s ease forwards; }
        .d2 { animation-delay: 0.10s; }
        .d3 { animation-delay: 0.15s; }
        .d4 { animation-delay: 0.20s; }
        .d5 { animation-delay: 0.25s; }
        .d6 { animation-delay: 0.30s; }
        .d7 { animation-delay: 0.35s; }
        .d8 { animation-delay: 0.40s; }
        .d9 { animation-delay: 0.45s; }
        .d10 { animation-delay: 0.50s; }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-slide { opacity: 0; animation: slideRight 0.6s ease forwards 0.2s; }
      `}</style>

      {/*Form  */}
      <section className="flex md:flex-1 items-start md:items-center justify-center px-6 py-20 sm:py-30 md:py-10 md:px-12 lg:px-16 relative overflow-y-auto overflow-x-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col gap-6">

            {/* Heading */}
            <div className="anim d2 text-center">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-zinc-800 tracking-tight">
                Create <span className="gradient-text">account</span>
              </h1>
              <p className="mt-2 text-zinc-400 text-sm">
                Join PetCare and give your pet the best care
              </p>
            </div>

            {/* API Error banner */}
            {error && (
              <div className="anim rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-start gap-2">
                <span className="text-rose-500 mt-0.5 shrink-0">⚠</span>
                <p className="text-sm text-rose-600">{error.message}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="anim d3">
                <label className="text-xs font-semibold text-zinc-800 ml-1">Full Name</label>
                <GlassInputWrapper hasError={!!getFieldError('name')}>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearError(); setFieldErrors([]); }}
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none"
                  />
                </GlassInputWrapper>
                <FieldErrorMsg message={getFieldError('name')} />
              </div>

              {/* Email */}
              <div className="anim d4">
                <label className="text-xs font-semibold text-zinc-800 ml-1">Email Address</label>
                <GlassInputWrapper hasError={!!getFieldError('email')}>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); setFieldErrors([]); }}
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none"
                  />
                </GlassInputWrapper>
                <FieldErrorMsg message={getFieldError('email')} />
              </div>

              {/* Password */}
              <div className="anim d5">
                <label className="text-xs font-semibold text-zinc-800 ml-1">Password</label>
                <GlassInputWrapper hasError={!!getFieldError('password')}>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError(); setFieldErrors([]); }}
                      autoComplete="new-password"
                      className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 pr-12 rounded-xl focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center outline-none">
                      {showPassword
                        ? <EyeOff className="w-4 h-4 text-zinc-300 hover:text-zinc-700 transition-colors" />
                        : <Eye    className="w-4 h-4 text-zinc-300 hover:text-zinc-700 transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                <FieldErrorMsg message={getFieldError('password')} />
              </div>

              {/* Confirm Password */}
              <div className="anim d6">
                <label className="text-xs font-semibold text-zinc-800 ml-1">Confirm Password</label>
                <GlassInputWrapper hasError={!!getFieldError('confirmPassword')}>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearError(); setFieldErrors([]); }}
                      autoComplete="new-password"
                      className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 pr-12 rounded-xl focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-3 flex items-center outline-none">
                      {showConfirm
                        ? <EyeOff className="w-4 h-4 text-zinc-300 hover:text-zinc-700 transition-colors" />
                        : <Eye    className="w-4 h-4 text-zinc-300 hover:text-zinc-700 transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                <FieldErrorMsg message={getFieldError('confirmPassword')} />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="anim d7 w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 outline-none">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="anim d8 relative flex items-center justify-center">
              <span className="w-full border-t border-zinc-200" />
              <span className="absolute px-4 text-xs font-medium text-zinc-400 bg-linear-to-br from-blue-50 via-white to-purple-50">
                Or sign up with
              </span>
            </div>

            {/* Google */}
            <button type="button" onClick={handleGoogleSignIn} disabled={loading}
              className="anim d9 w-full flex items-center justify-center gap-3 border border-zinc-300 rounded-2xl py-3 text-sm font-medium text-zinc-600 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-zinc-400 hover:shadow-sm disabled:opacity-60 transition-all duration-200 outline-none active:scale-[0.99]">
              <GoogleIcon />
              Sign up with Google
            </button>

            {/* Sign in link */}
            <p className="anim d10 text-center text-xs text-zinc-400 pb-4">
              Already have an account?{' '}
              <button type="button" onClick={onSignIn}
                className="gradient-text font-semibold hover:font-bold transition-all outline-none">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;