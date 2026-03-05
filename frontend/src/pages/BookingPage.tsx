// src/pages/BookingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, PawPrint, FileText, ChevronRight } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { getServiceById, formatPrice, type Service } from '../data/services';
import { getAvailableSlots, createBooking, type PetType, type TimeSlot } from '../services/BookingService';
import BookingCalendar from '../components/ui/BookingCalendar';

//Components
const GlassInputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError?: boolean }) => (
  <div className={`rounded-xl border bg-white/80 hover:bg-white hover:shadow-sm transition-all duration-200
    ${hasError ? 'border-rose-400' : 'border-zinc-200 hover:border-zinc-300'}`}>
    {children}
  </div>
);

const FieldErrorMsg = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 ml-1 text-xs text-rose-500">{message}</p> : null;

//Step Indicator
const StepIndicator = ({ current }: { current: 1 | 2 }) => (
  <div className="flex items-center justify-center gap-3 mb-8">
    {[{ n: 1, label: 'Details' }, { n: 2, label: 'Review' }].map(({ n, label }, i) => (
      <React.Fragment key={n}>
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all
            ${current >= n ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
            {n}
          </div>
          <span className={`text-xs font-medium ${current >= n ? 'text-zinc-700' : 'text-zinc-400'}`}>{label}</span>
        </div>
        {i === 0 && <div className={`h-px w-10 ${current >= 2 ? 'bg-zinc-800' : 'bg-zinc-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

//Main
const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate      = useNavigate();
  const { user, isLoading } = useAuthContext();

  const [service, setService]   = useState<Service | null>(null);
  const [step, setStep]         = useState<1 | 2>(1);
  const [slots, setSlots]       = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Form
  const [petName, setPetName]   = useState('');
  const [petType, setPetType]   = useState<PetType>('Cat');
  const [petBreed, setPetBreed] = useState('');
  const [date, setDate]         = useState('');
  const [time, setTime]         = useState('');
  const [notes, setNotes]       = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate('/signin'); return; }
    const found = getServiceById(serviceId ?? '');
    if (!found) { navigate('/'); return; }
    setService(found);
  }, [serviceId, user, isLoading]);

  // Load slots
  useEffect(() => {
    if (!date || !serviceId) return;
    setTime('');
    setSlotsLoading(true);
    getAvailableSlots(serviceId, date)
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  }, [date, serviceId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!petName) e.petName = 'Pet name is required.';
    if (!date)    e.date    = 'Date is required.';
    if (!time)    e.time    = 'Time is required.';
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!service) return;
    setApiError('');
    setSubmitLoading(true);
    try {
      const booking = await createBooking(
        { serviceId: service.id, petName, petType, petBreed, date, time, notes },
        service.title, service.category, service.price, service.priceUnit,
      );
      navigate(`/payment/${booking.id}`);
    } catch (err: any) {
      setApiError(err?.message ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed -top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-20 -right-10 w-60 h-60 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <button onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors outline-none">
          <ArrowLeft className="w-3.5 h-3.5" />
          {step === 2 ? 'Edit Details' : 'Back'}
        </button>

        <StepIndicator current={step} />

        {/* Service summary */}
        <div className="mb-5 rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <div className="h-14 w-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/56x56/f4f4f5/a1a1aa?text=${service.title[0]}`; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-violet-500">{service.category}</p>
              <h2 className="text-[14px] font-bold text-zinc-800">{service.title}</h2>
              <p className="text-xs text-zinc-400">{service.duration}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-zinc-800">{formatPrice(service.price)}</p>
              <p className="text-[11px] text-zinc-400">/ {service.priceUnit}</p>
            </div>
          </div>
        </div>

        {/*Step 1*/}
        {step === 1 && (
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h1 className="text-[15px] font-bold text-zinc-800">Pet Details & Schedule</h1>
            </div>
            <div className="px-6 py-6 space-y-5">

              {/* Pet Name */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">Pet Name</label>
                <GlassInputWrapper hasError={!!errors.petName}>
                  <div className="flex items-center">
                    <span className="pl-3 text-zinc-300"><PawPrint className="w-4 h-4" /></span>
                    <input type="text" value={petName}
                      onChange={e => { setPetName(e.target.value); setErrors({}); }}
                      placeholder="Example: Mochi"
                      className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 focus:outline-none" />
                  </div>
                </GlassInputWrapper>
                <FieldErrorMsg message={errors.petName} />
              </div>

              {/* Pet Type */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">Pet Type</label>
                <div className="flex gap-3 mt-1.5">
                  {(['Cat', 'Dog'] as PetType[]).map(type => (
                    <button key={type} type="button" onClick={() => setPetType(type)}
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all outline-none
                        ${petType === type ? 'bg-zinc-800 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pet Breed */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">
                  Ras <span className="text-zinc-400 font-normal">(optional)</span>
                </label>
                <GlassInputWrapper>
                  <input type="text" value={petBreed} onChange={e => setPetBreed(e.target.value)}
                    placeholder={petType === 'Cat' ? 'Contoh: Persian, DSH' : 'Contoh: Golden Retriever'}
                    className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-4 py-3 focus:outline-none" />
                </GlassInputWrapper>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">Date</label>
                <BookingCalendar
                  selectedDate={date}
                  onDateChange={d => { setDate(d); setErrors({}); }}
                  error={errors.date}
                />
                <FieldErrorMsg message={errors.date} />
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">Time</label>
                {!date ? (
                  <p className="mt-2 text-xs text-zinc-400">Please select a date first to view available times.</p>
                ) : slotsLoading ? (
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading schedule...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2 mt-1.5">
                      {slots.map(slot => (
                        <button key={slot.time} type="button"
                          disabled={!slot.available}
                          onClick={() => { setTime(slot.time); setErrors({}); }}
                          className={`rounded-xl border py-2.5 text-sm font-medium transition-all outline-none
                            ${!slot.available
                              ? 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed line-through'
                              : time === slot.time
                                ? 'bg-zinc-800 border-zinc-800 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-800'
                            }`}>
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                        <span className="text-[11px] text-zinc-400">Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                        <span className="text-[11px] text-zinc-400">Full</span>
                      </div>
                    </div>
                  </>
                )}
                <FieldErrorMsg message={errors.time} />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 ml-0.5">
                  Notes <span className="text-zinc-400 font-normal">(optional)</span>
                </label>
                <GlassInputWrapper>
                  <div className="flex items-start">
                    <span className="pl-3 pt-3 text-zinc-300"><FileText className="w-4 h-4" /></span>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Special conditions, allergies, or additional information..."
                      rows={3}
                      className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-300 px-3 py-3 focus:outline-none resize-none" />
                  </div>
                </GlassInputWrapper>
              </div>

              <button onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] transition-all outline-none">
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/*Step 2*/}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100">
                <h1 className="text-[15px] font-bold text-zinc-800">Booking Summary</h1>
              </div>
              <div className="px-6 py-5 space-y-3">
                {[
                  { label: 'Pet',    value: `${petName} · ${petType}${petBreed ? ` · ${petBreed}` : ''}` },
                  { label: 'Date',  value: formatDate(date) },
                  { label: 'Time',      value: time },
                  { label: 'Service',  value: service.title },
                  { label: 'Duration',   value: service.duration },
                  ...(notes ? [{ label: 'Notes', value: notes }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-400 shrink-0">{label}</span>
                    <span className="text-xs font-medium text-zinc-700 text-right">{value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-zinc-800">Total</span>
                  <span className="text-lg font-bold text-zinc-800">
                    {formatPrice(service.price)}
                    <span className="text-xs font-normal text-zinc-400 ml-1">/ {service.priceUnit}</span>
                  </span>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
                <span className="text-rose-500 text-sm">⚠</span>
                <p className="text-sm text-rose-600">{apiError}</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all outline-none">
              {submitLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                : <>Continue to Payment <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;