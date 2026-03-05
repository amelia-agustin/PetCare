const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const IS_MOCK  = true; 

import { tokenStorage } from './AuthService';

// Types 
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export interface UpdateProfilePayload {
    name: string;
    email: string;
    phone?: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface ProfileApiError {
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
        throw { message: data.message ?? 'Something went wrong.', field: data.field } as ProfileApiError;
    }
    return data as T;
}

// Get Profile
export async function getProfile(): Promise<UserProfile> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 500));
        const saved = localStorage.getItem('mock_user');
        const user  = saved ? JSON.parse(saved) : { id: '1', name: 'Test User', email: 'test@example.com' };
        const phone = localStorage.getItem('mock_phone') ?? '';
        return { ...user, phone };
    }
    return request<UserProfile>('/profile', { method: 'GET' });
}

// Update Profile
export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 800));
        const saved = localStorage.getItem('mock_user');
        const user  = saved ? JSON.parse(saved) : {};
        const updated = { ...user, name: payload.name, email: payload.email };
        localStorage.setItem('mock_user',  JSON.stringify(updated));
        localStorage.setItem('mock_phone', payload.phone ?? '');
        return { ...updated, phone: payload.phone };
    }
    return request<UserProfile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

// Change Password
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    if (IS_MOCK) {
        await new Promise(res => setTimeout(res, 800));
        if (payload.currentPassword === 'wrong') {
        throw { message: 'Current password is incorrect.', field: 'currentPassword' } as ProfileApiError;
        }
        return;
    }
    return request<void>('/profile/change-password', {
        method: 'PUT',
        body: JSON.stringify({
        currentPassword: payload.currentPassword,
        newPassword:     payload.newPassword,
        }),
    });
}