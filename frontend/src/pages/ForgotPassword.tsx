import React, { useState } from 'react';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { validateEmail } from '../utils/validation';

//Error
const FieldErrorMsg = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 ml-1 text-xs text-rose-500">{message}</p> : null;

//Glass Input Wrapper
const GlassInputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError?: boolean }) => (
  <div className={`mt-1.5 rounded-xl border bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-200
    ${hasError ? 'border-zinc-400 bg-rose-50/30' : 'border-zinc-300 hover:border-zinc-400'}`}>
    {children}
  </div>
);

//Types
interface ForgotPasswordProps {
  heroImageSrc?: string;
  onBackToSignIn?: () => void;
  onNavigateHome?: () => void;
}

//Mock
async function sendResetEmail(email: string): Promise<void> {
  await new Promise(res => setTimeout(res, 1200));
  return;
}

//Main Component
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  heroImageSrc = "/background/bg-auth.jpg",
  onBackToSignIn,
  onNavigateHome,
}) => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError(null);

    setLoading(true);
    try {
      await sendResetEmail(email);
      setSent(true);
    } catch (err: any) {
      setApiError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col md:flex-row overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { opacity: 0; animation: fadeUp 0.5s ease forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.10s; }
        .d3 { animation-delay: 0.15s; }
        .d4 { animation-delay: 0.20s; }
        .d5 { animation-delay: 0.25s; }
        .d6 { animation-delay: 0.30s; }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-slide { opacity: 0; animation: slideRight 0.6s ease forwards 0.2s; }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.8); }
          70%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .anim-pop { animation: popIn 0.5s ease forwards; }
      `}</style>

      <section className="flex md:flex-1 items-start md:items-center justify-center px-6 py-12 md:py-10 md:px-12 lg:px-16 relative overflow-y-auto overflow-x-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {!sent ? (
            <div className="flex flex-col gap-6">

              {/* Heading */}
              <div className="anim d2 text-center">
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-zinc-800 tracking-tight">
                  Forgot <span className="gradient-text">password?</span>
                </h1>
                <p className="mt-2 text-zinc-400 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* API Error banner */}
              {apiError && (
                <div className="anim rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5 shrink-0">⚠</span>
                  <p className="text-sm text-rose-600">{apiError}</p>
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="anim d3">
                  <label className="text-xs font-semibold text-zinc-800 ml-1">Email Address</label>
                  <GlassInputWrapper hasError={!!emailError}>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(null); setApiError(null); }}
                      autoComplete="email"
                      className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 rounded-xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                  <FieldErrorMsg message={emailError ?? undefined} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="anim d4 w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 outline-none"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : 'Send Reset Link'}
                </button>
              </form>

              {/* Sign in link */}
              <p className="anim d5 text-center text-xs text-zinc-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={onBackToSignIn}
                  className="gradient-text font-semibold hover:font-bold transition-all outline-none"
                >
                  Sign In
                </button>
              </p>
            </div>

          ) : (
            /*Success state*/
            <div className="flex flex-col items-center gap-6 text-center">

              {/* Icon */}
              <div className="anim-pop flex h-20 w-20 items-center justify-center">
                <Mail className="w-9 h-9 text-violet-700" />
              </div>

              {/* Text */}
              <div className="anim d2">
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 tracking-tight">
                  Check your <span className="gradient-text">email</span>
                </h1>
                <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                  We sent a reset link to<br />
                  <span className="font-semibold text-zinc-600">{email}</span>
                </p>
                <p className="mt-2 text-zinc-400 text-xs">
                  Didn't receive it? Check your spam folder.
                </p>
              </div>

              {/* Resend */}
              <div className="anim d3 flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full rounded-2xl border border-zinc-300 py-3 text-sm font-medium text-zinc-600 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-zinc-400 hover:shadow-sm transition-all duration-200 outline-none"
                >
                  Try a different email
                </button>

                <button
                  type="button"
                  onClick={onBackToSignIn}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 outline-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;

// ─── Usage ────────────────────────────────────────────────────────────────────
//
// Di App.tsx tambahkan:
//
// import ForgotPassword from './pages/ForgotPassword';
//
// const ForgotPasswordPage = () => {
//   const navigate = useNavigate();
//   return (
//     <ForgotPassword
//       onBackToSignIn={() => navigate('/signin')}
//       onNavigateHome={() => navigate('/')}
//     />
//   );
// };
//
// <Route path='/forgot-password' element={<ForgotPasswordPage />} />
//
// ─── Nanti saat backend ada ───────────────────────────────────────────────────
// Ganti fungsi sendResetEmail() dengan fetch ke backend:
//
// async function sendResetEmail(email: string): Promise<void> {
//   const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email }),
//   });
//   if (!res.ok) {
//     const data = await res.json();
//     throw { message: data.message ?? 'Something went wrong.' };
//   }
// }