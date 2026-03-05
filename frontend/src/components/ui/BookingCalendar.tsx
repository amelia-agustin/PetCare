// src/components/ui/BookingCalendar.tsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    error?: string;
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = new Date();
today.setHours(0, 0, 0, 0);

const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedDate, onDateChange, error }) => {
    const now = new Date();
    const [viewYear,  setViewYear]  = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const isPrevDisabled = viewYear === now.getFullYear() && viewMonth === now.getMonth();

    const selectedLabel = useMemo(() => {
        if (!selectedDate) return null;
        return new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
    }, [selectedDate]);

    const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className={`rounded-xl border bg-white/80 transition-all duration-200 ${error ? 'border-rose-400' : 'border-zinc-200'}`}>
            <div className="p-4">
                {/* Header nav */}
                <div className="flex items-center justify-between mb-3">
                    <button type="button" disabled={isPrevDisabled} onClick={prevMonth}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500
                        hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all outline-none">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-sm font-bold text-zinc-800">
                        {MONTHS[viewMonth]} {viewYear}
                    </p>

                    <button type="button" onClick={nextMonth}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-all outline-none">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {DAYS.map(d => (
                        <div key={d} className="flex items-center justify-center h-7">
                            <span className="text-[11px] font-semibold text-zinc-400">{d}</span>
                        </div>
                    ))}
                </div>

                {/* Date cells */}
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, idx) => {
                        if (!day) return <div key={`e-${idx}`} />;

                        const date    = new Date(viewYear, viewMonth, day);
                        const ymd     = toYMD(date);
                        const isPast  = date < today;
                        const isToday = ymd === toYMD(today);
                        const isSel   = ymd === selectedDate;
                        const isSun   = date.getDay() === 0;

                        return (
                            <button key={ymd} type="button" disabled={isPast}
                            onClick={() => onDateChange(ymd)}
                            className={`
                                relative flex items-center justify-center h-8 w-full rounded-lg text-xs font-medium
                                transition-all duration-150 outline-none select-none
                                ${isPast
                                    ? 'text-zinc-200 cursor-not-allowed'
                                    : isSel
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : isToday
                                    ? 'text-zinc-800 font-bold'
                                    : isSun
                                    ? 'text-rose-400 hover:bg-rose-50'
                                    : 'text-zinc-700 hover:bg-zinc-100'
                                }`}>
                                    {day}
                                    {isToday && !isSel && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-violet-400" />
                                    )}
                            </button>
                        );
                    })}
                </div>

                {/* Selected date*/}
                {selectedDate && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                        <p className="text-xs font-medium text-zinc-700">{selectedLabel}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;