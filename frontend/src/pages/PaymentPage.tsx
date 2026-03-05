// src/pages/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle2, Copy, Check } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { getBookings, processPayment, type Booking, type PaymentMethod } from '../services/BookingService';
import { formatPrice } from '../data/services';

//Payment Methods
const PAYMENT_METHODS: { id: PaymentMethod; label: string; desc: string; logo: string; }[] = [
    {
        id: 'qris',
        label: 'QRIS',
        desc: 'Transfer via ATM, mobile banking, or internet banking',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg',
    },
    {
        id: 'va_bca',
        label: 'BCA Virtual Account',
        desc: 'Transfer via ATM, mobile banking, or internet banking',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
    },
    {
        id: 'va_bni',
        label: 'BNI Virtual Account',
        desc: 'Transfer via ATM, m-Banking, or iBanking',
        logo: '../../public/paymentLogo/bank-bni-seeklogo.png',
    },
    {
        id: 'va_mandiri',
        label: 'Mandiri Virtual Account',
        desc: 'Transfer via ATM, m-Banking, or iBanking',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
    },
];

//Logo Badge
const LogoBadge = ({ logo, label }: { logo: string; label: string }) => (
    <div className={`flex h-12 w-16 items-center justify-center shrink-0 p-2`}>
        <img
        src={logo}
        alt={label}
        className="w-full h-full object-contain"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
    </div>
);

//Copy Button
const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-all outline-none">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Tersalin' : 'Salin'}
        </button>
    );
};

//Main
const PaymentPage: React.FC = () => {
    const { bookingId }       = useParams<{ bookingId: string }>();
    const navigate            = useNavigate();
    const { user, isLoading } = useAuthContext();

    const [booking, setBooking]         = useState<Booking | null>(null);
    const [selected, setSelected]       = useState<PaymentMethod>('qris');
    const [loading, setLoading]         = useState(false);
    const [paid, setPaid]               = useState(false);
    const [paidBooking, setPaidBooking] = useState<Booking | null>(null);
    const [apiError, setApiError]       = useState('');
    const [fetching, setFetching]       = useState(true);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
        setFetching(false);
        navigate('/signin');
        return;
        }
        getBookings().then(list => {
        const found = list.find(b => b.id === bookingId);
        if (!found) { navigate('/'); return; }
        setBooking(found);
        }).finally(() => setFetching(false));
    }, [bookingId, user, isLoading]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const handlePay = async () => {
        if (!booking) return;
        setApiError('');
        setLoading(true);
        try {
        const updated = await processPayment({ bookingId: booking.id, method: selected });
        setPaidBooking(updated);
        setPaid(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
        setApiError(err?.message ?? 'Payment failed. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
    );

    //Success State
    if (paid && paidBooking) {
        const method = PAYMENT_METHODS.find(m => m.id === paidBooking.paymentMethod);
        return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full">
                    <CheckCircle2 className="w-13 h-13 text-emerald-500" />
                    </div>
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800 mb-1">Booking Confirmed!</h1>
                    <p className="text-sm text-zinc-400">Booking Confirmed!</p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden mb-5">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Booking Details</p>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                        {[
                            { label: 'Service',  value: paidBooking.serviceTitle },
                            { label: 'Pet',    value: `${paidBooking.petName} (${paidBooking.petType})` },
                            { label: 'Date',  value: formatDate(paidBooking.date) },
                            { label: 'Time',      value: paidBooking.time },
                            { label: 'Method',   value: method?.label ?? '-' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-4">
                            <span className="text-xs text-zinc-400">{label}</span>
                            <span className="text-xs font-medium text-zinc-700 text-right">{value}</span>
                            </div>
                        ))}
                        <div className="pt-3 border-t border-zinc-100 flex justify-between">
                            <span className="text-sm font-semibold text-zinc-800">Total Paid</span>
                            <span className="text-sm font-bold text-zinc-800">{formatPrice(paidBooking.price)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/bookings')}
                    className="w-full rounded-xl bg-zinc-800 py-3 text-sm font-semibold text-white hover:scale-[1.01] transition-all outline-none">
                        View My Bookings
                    </button>
                    <button onClick={() => navigate('/')}
                    className="w-full rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all outline-none">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
        );
    }

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            <div className="fixed -top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl pointer-events-none" />
            <div className="fixed -bottom-20 -right-10 w-60 h-60 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6">
                <button onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors outline-none">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                </button>

                <h1 className="text-xl font-bold text-zinc-800 mb-6">Payment</h1>

                {/* Order summary */}
                <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Order Summary</p>
                    </div>
                    <div className="px-5 py-4 space-y-2.5">
                        {[
                        { label: 'Service',  value: booking.serviceTitle },
                        { label: 'Pet',    value: `${booking.petName} (${booking.petType})` },
                        { label: 'Date',  value: formatDate(booking.date) },
                        { label: 'Time',      value: booking.time },
                        ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between gap-4">
                            <span className="text-xs text-zinc-400">{label}</span>
                            <span className="text-xs font-medium text-zinc-700 text-right">{value}</span>
                        </div>
                        ))}
                        <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                            <span className="text-sm font-semibold text-zinc-800">Total</span>
                            <span className="text-lg font-bold text-zinc-800">
                                {formatPrice(booking.price)}
                                <span className="text-xs font-normal text-zinc-400 ml-1">/ {booking.priceUnit}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment method */}
                <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Payment Method</p>
                    </div>
                    <div className="p-3 space-y-2">
                        {PAYMENT_METHODS.map(method => (
                        <button key={method.id} type="button"
                            onClick={() => setSelected(method.id)}
                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all outline-none border
                            ${selected === method.id
                                ? 'border-zinc-800 bg-zinc-50'
                                : 'border-transparent hover:bg-zinc-50'
                            }`}>
                                <LogoBadge logo={method.logo} label={method.label} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-800">{method.label}</p>
                                    <p className="text-xs text-zinc-400">{method.desc}</p>
                                </div>
                                <div className={`h-4 w-4 rounded-full border-2 shrink-0 transition-all
                                ${selected === method.id ? 'border-zinc-800 bg-zinc-800' : 'border-zinc-300'}`}>
                                    {selected === method.id && (
                                        <div className="flex items-center justify-center h-full">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </div>
                                    )}
                                </div>
                        </button>
                        ))}
                    </div>
                </div>

                {apiError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 mb-4">
                        <span className="text-rose-500 text-sm">⚠</span>
                        <p className="text-sm text-rose-600">{apiError}</p>
                    </div>
                )}

                <button onClick={handlePay} disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all outline-none">
                    {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        : `Bayar ${formatPrice(booking.price)}`}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;