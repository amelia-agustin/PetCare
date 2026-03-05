// src/services/bookingService.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const IS_MOCK  = true;

import { tokenStorage } from './AuthService';

//  Types
export type BookingStatus = 'pending_payment' | 'confirmed' | 'in_progress' | 'done' | 'cancelled';
export type PetType       = 'Cat' | 'Dog';
export type PaymentMethod = 'qris' | 'va_bca' | 'va_bni' | 'va_mandiri';

export interface BookingPayload {
    serviceId: string;
    petName: string;
    petType: PetType;
    petBreed?: string;
    date: string;
    time: string;
    notes?: string;
}

export interface PaymentPayload {
    bookingId: string;
    method: PaymentMethod;
}

export interface Booking {
    id: string;
    serviceId: string;
    serviceTitle: string;
    serviceCategory: string;
    price: number;
    priceUnit: string;
    petName: string;
    petType: PetType;
    petBreed?: string;
    date: string;
    time: string;
    notes?: string;
    status: BookingStatus;
    paymentMethod?: PaymentMethod;
    paymentCode?: string;  
    createdAt: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface BookingApiError {
    message: string;
    field?: string;
}

// Helper
async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const token = tokenStorage.get();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
        },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) {
        throw { message: data.message ?? 'Something went wrong.', field: data.field } as BookingApiError;
    }
    return data as T;
}

// Mock storage
const getMockBookings = (): Booking[] => {
    const saved = localStorage.getItem('mock_bookings');
    return saved ? JSON.parse(saved) : [];
};
    const saveMockBookings = (b: Booking[]) =>
    localStorage.setItem('mock_bookings', JSON.stringify(b));

export async function getAvailableSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
    const ALL_SLOTS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 400));

        const existing = getMockBookings().filter(
        b => b.serviceId === serviceId && b.date === date && b.status !== 'cancelled'
        );
        const bookedTimes = existing.map(b => b.time);

        const mockAdminBooked: Record<string, string[]> = {
        'monday':    ['09:00', '14:00'],
        'tuesday':   ['10:00', '15:00'],
        'wednesday': ['08:00', '13:00'],
        'thursday':  ['11:00', '16:00'],
        'friday':    ['09:00', '10:00'],
        'saturday':  ['08:00', '09:00', '10:00'],
        'sunday':    ['13:00', '14:00'],
        };
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const adminBooked = mockAdminBooked[dayName] ?? [];

        return ALL_SLOTS.map(t => ({
        time: t,
        available: !bookedTimes.includes(t) && !adminBooked.includes(t),
        }));
    }
    return request<TimeSlot[]>(`/bookings/slots?serviceId=${serviceId}&date=${date}`, { method: 'GET' });
}

// Create Booking
export async function createBooking(
    payload: BookingPayload,
    serviceTitle: string,
    serviceCategory: string,
    price: number,
    priceUnit: string,
): Promise<Booking> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 800));

        const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        serviceId: payload.serviceId,
        serviceTitle,
        serviceCategory,
        price,
        priceUnit,
        petName:  payload.petName,
        petType:  payload.petType,
        petBreed: payload.petBreed,
        date:     payload.date,
        time:     payload.time,
        notes:    payload.notes,
        status:   'pending_payment',
        createdAt: new Date().toISOString(),
        };

        const bookings = getMockBookings();
        bookings.unshift(newBooking);
        saveMockBookings(bookings);
        return newBooking;
    }

    return request<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// Process Payment
export async function processPayment(payload: PaymentPayload): Promise<Booking> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 1200));

        const codes: Record<PaymentMethod, string> = {
        qris:       `QRIS-${Math.random().toString(36).slice(2,10).toUpperCase()}`,
        va_bca:     `8808${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        va_bni:     `8009${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        va_mandiri: `8908${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        };

        const bookings  = getMockBookings();
        const idx       = bookings.findIndex(b => b.id === payload.bookingId);
        if (idx === -1) throw { message: 'Booking tidak ditemukan.' } as BookingApiError;

        const updated = {
        ...bookings[idx],
        status:        'confirmed' as BookingStatus,
        paymentMethod: payload.method,
        paymentCode:   codes[payload.method],
        };

        bookings[idx] = updated;
        saveMockBookings(bookings);
        return updated;
    }

    return request<Booking>(`/bookings/${payload.bookingId}/payment`, {
        method: 'POST',
        body: JSON.stringify({ method: payload.method }),
    });
}

// Get All Bookings 
export async function getBookings(): Promise<Booking[]> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 500));
        return getMockBookings();
    }
    return request<Booking[]>('/bookings', { method: 'GET' });
}

// Cancel Booking
export async function cancelBooking(bookingId: string): Promise<void> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 500));
        const bookings = getMockBookings();
        saveMockBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
        ));
        return;
    }
    return request<void>(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
}