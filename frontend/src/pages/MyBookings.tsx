// src/pages/MyBookings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CalendarDays, Clock, PawPrint, ChevronDown, ChevronUp, Plus, AlertTriangle, X } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { getBookings, cancelBooking, type Booking, type BookingStatus } from '../services/BookingService';
import { formatPrice } from '../data/services';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending:         { label: 'Awaiting Payment', color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     },
    pending_payment: { label: 'Awaiting Payment', color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     },
    confirmed:       { label: 'Confirmed',         color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    in_progress:     { label: 'In Progress',       color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200'      },
    done:            { label: 'Completed',         color: 'text-zinc-500',    bg: 'bg-zinc-50 border-zinc-200'      },
    cancelled:       { label: 'Cancelled',         color: 'text-rose-500',    bg: 'bg-rose-50 border-rose-200'      },
};

const STATUS_FALLBACK = { label: 'Unknown', color: 'text-zinc-400', bg: 'bg-zinc-50 border-zinc-200' };
const FILTERS: { key: string; label: string }[] = [
    { key: 'all',             label: 'All'         },
    { key: 'pending_payment', label: 'Unpaid'      },
    { key: 'confirmed',       label: 'Confirmed'   },
    { key: 'in_progress',     label: 'In Progress' },
    { key: 'done',            label: 'Completed'   },
    { key: 'cancelled',       label: 'Cancelled'   },
];

const CancelDialog = ({
    open,
    serviceName,
    loading,
    onConfirm,
    onClose,
}: {
    open: boolean;
    serviceName: string;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
                <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-all outline-none"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="px-6 pt-6 pb-5 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>

                    <h3 className="text-base font-bold text-zinc-800 mb-1">Cancel Booking?</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed text-center">
                        Are you sure you want to cancel{' '}
                        <span className="font-semibold text-zinc-600">{serviceName}</span>?
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex gap-2 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-all outline-none"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-all outline-none"
                    >
                        {loading
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling...</>
                        : 'Yes, Cancel'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

//Booking Card
const BookingCard = ({
    booking,
    onPay,
    onCancel,
}: {
    booking: Booking;
    onPay: (id: string) => void;
    onCancel: (id: string) => void;
}) => {
    const [expanded, setExpanded]       = useState(false);
    const [showDialog, setShowDialog]   = useState(false);
    const [cancelling, setCancelling]   = useState(false);
    const status = STATUS_CONFIG[booking.status] ?? STATUS_FALLBACK;

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    const formatCreated = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleConfirmCancel = async () => {
        setCancelling(true);
        try {
            await cancelBooking(booking.id);
            onCancel(booking.id);
            setShowDialog(false);
        } finally {
            setCancelling(false);
        }
    };

    const canCancel = booking.status === 'pending_payment' || booking.status === 'confirmed' || (booking.status as string) === 'pending';
    const canPay    = booking.status === 'pending_payment' || (booking.status as string) === 'pending';

    return (
        <div>
            <CancelDialog
                open={showDialog}
                serviceName={booking.serviceTitle}
                loading={cancelling}
                onConfirm={handleConfirmCancel}
                onClose={() => !cancelling && setShowDialog(false)}
            />

            <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200 ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}>

                {/* Main*/}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-violet-500 font-medium mb-0.5">{booking.serviceCategory}</p>
                            <h3 className="text-[15px] font-bold text-zinc-800 truncate">{booking.serviceTitle}</h3>
                            <p className="text-xs text-zinc-400 mt-0.5">Booked on {formatCreated(booking.createdAt)}</p>
                        </div>
                        <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <PawPrint className="w-3.5 h-3.5 text-zinc-300" />
                            {booking.petName} · {booking.petType}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-300" />
                            {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock className="w-3.5 h-3.5 text-zinc-300" />
                            {booking.time}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <span className="text-base font-bold text-zinc-800">{formatPrice(booking.price)}</span>
                            <span className="text-xs text-zinc-400 ml-1">/ {booking.priceUnit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {canPay && (
                                <button onClick={() => onPay(booking.id)}
                                className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap hover:scale-[1.02] active:scale-95 transition-all outline-none">
                                Pay Now
                                </button>
                            )}
                            {canCancel && (
                                <button onClick={() => setShowDialog(true)}
                                className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-500 whitespace-nowrap hover:bg-rose-50 transition-all outline-none">
                                Cancel
                                </button>
                            )}
                            <button onClick={() => setExpanded(!expanded)}
                                className="flex items-center justify-center h-8 w-8 rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-all outline-none">
                                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded detail */}
                <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-60' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 border-t border-zinc-100 pt-4 space-y-2.5">
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-3">Booking Details</p>
                        {[
                            { label: 'Booking ID',      value: booking.id },
                            ...(booking.petBreed       ? [{ label: 'Breed',          value: booking.petBreed }] : []),
                            ...(booking.notes          ? [{ label: 'Notes',          value: booking.notes }] : []),
                            ...(booking.paymentMethod  ? [{ label: 'Payment Method', value: booking.paymentMethod.replace('va_', 'VA ').toUpperCase() }] : []),
                            ...(booking.paymentCode    ? [{ label: 'Payment Code',   value: booking.paymentCode }] : []),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-4">
                                <span className="text-xs text-zinc-400 shrink-0">{label}</span>
                                <span className="text-xs font-medium text-zinc-700 text-right break-all">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

//Empty State
const EmptyState = ({ onBook }: { onBook: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 mb-4">
            <CalendarDays className="w-7 h-7 text-zinc-300" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-600 mb-1">No bookings yet</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-xs">
            You have no bookings yet. Start booking a service for your pet now.
        </p>
        <button onClick={onBook}
        className="rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] transition-all outline-none">
            Book Now
        </button>
    </div>
);

//Main
const MyBookings: React.FC = () => {
    const navigate            = useNavigate();
    const { user, isLoading } = useAuthContext();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [fetching, setFetching] = useState(true);
    const [filter, setFilter]     = useState<string>('all');

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
        setFetching(false);
        navigate('/signin');
        return;
        }
        getBookings()
        .then(setBookings)
        .finally(() => setFetching(false));
    }, [user, isLoading]);

    const filtered = filter === 'all' ? bookings : bookings.filter(b =>
        b.status === filter || (filter === 'pending_payment' && (b.status as string) === 'pending')
    );

    const handleCancel = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b));
    };

    const handlePay = (id: string) => navigate(`/payment/${id}`);

    const countMap = bookings.reduce((acc, b) => {
        const key = (b.status as string) === 'pending' ? 'pending_payment' : b.status;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

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

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800">My Bookings</h1>
                        <p className="text-sm text-zinc-400 mt-0.5">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => navigate('/#services')}
                        className="flex gap-1 items-center rounded-xl bg-zinc-800 px-3 py-2 text-xs font-semibold text-white hover:scale-[1.02] transition-all outline-none">
                        <Plus size={15} />
                        New Booking
                    </button>
                </div>

                {/* Filter tabs */}
                {bookings.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                        {FILTERS.map(f => {
                        const count = f.key === 'all' ? bookings.length : (countMap[f.key] ?? 0);
                        if (f.key !== 'all' && count === 0) return null;
                        return (
                            <button key={f.key} onClick={() => setFilter(f.key)}
                            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium transition-all outline-none
                                ${filter === f.key
                                ? 'bg-zinc-800 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
                                }`}>
                                    {f.label}
                                    {count > 0 && (
                                        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
                                        ${filter === f.key ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {count}
                                        </span>
                                    )}
                            </button>
                        );
                    })}
                </div>
                )}

                {/* Content */}
                {fetching ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                    </div>
                ) : bookings.length === 0 ? (
                    <EmptyState onBook={() => navigate('/#services')} />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-sm text-zinc-400">No bookings with this status.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(b => (
                            <BookingCard key={b.id} booking={b} onPay={handlePay} onCancel={handleCancel} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyBookings;