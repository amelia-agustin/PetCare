const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const IS_MOCK = true;

// Types
export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

export interface ApiError {
  message: string;
  field?: 'email' | 'password' | 'general';
  code?: string;
}

// Helper: request wrapper
async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const err: ApiError = {
      message: data.message ?? 'Something went wrong. Please try again.',
      field:   data.field,
      code:    data.code,
    };
    throw err;
  }

  return data as T;
}

// Token management
export const tokenStorage = {
  save(token: string, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
  },
  get(): string | null {
    return (
      localStorage.getItem('auth_token') ??
      sessionStorage.getItem('auth_token')
    );
  },
  remove() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  },
};

// Sign In
export async function signIn(payload: SignInPayload): Promise<AuthResponse> {

  if (IS_MOCK) {
    await new Promise(res => setTimeout(res, 1000));

    if (payload.password === 'wrong') {
      throw {
        message: 'Email or password is incorrect.',
        field: 'general',
      } as ApiError;
    }

    const mockResponse: AuthResponse = {
      user: { id: '1', name: 'Test User', email: payload.email },
      token: 'mock-jwt-token-123',
      expiresIn: 3600,
    };
    localStorage.setItem('mock_user', JSON.stringify(mockResponse.user));
    tokenStorage.save(mockResponse.token, payload.rememberMe);
    return mockResponse;
  }
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email:    payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  tokenStorage.save(data.token, payload.rememberMe);
  return data;
}

// Sign Up
export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {

  if (IS_MOCK) {
    await new Promise(res => setTimeout(res, 1000));

    if (payload.email === 'test@test.com') {
      throw {
        message: 'Email is already registered.',
        field: 'email',
      } as ApiError;
    }

    const mockResponse: AuthResponse = {
      user: { id: '2', name: payload.name, email: payload.email },
      token: 'mock-jwt-token-456',
      expiresIn: 3600,
    };
    localStorage.setItem('mock_user', JSON.stringify(mockResponse.user)); 
    tokenStorage.save(mockResponse.token);
    return mockResponse;
  }

  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name:     payload.name.trim(),
      email:    payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  tokenStorage.save(data.token);
  return data;
}

// Sign Out
export async function signOut(): Promise<void> {
  const token = tokenStorage.get();
  if (token && !IS_MOCK) {
    request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  tokenStorage.remove();
  localStorage.removeItem('mock_user');
}

// Get current user
export async function getMe(): Promise<AuthUser | null> {
  const token = tokenStorage.get();
  if (!token) return null;

  if (IS_MOCK) {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  }

  try {
    const data = await request<{ user: AuthUser }>('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
  } catch {
    tokenStorage.remove();
    return null;
  }
}

// Google OAuth
export function initiateGoogleSignIn() {
  if (IS_MOCK) {
    const mockResponse: AuthResponse = {
      user: { id: '3', name: 'Google User', email: 'google@example.com' },
      token: 'mock-google-token-789',
      expiresIn: 3600,
    };
    tokenStorage.save(mockResponse.token);
    window.dispatchEvent(new CustomEvent('mock-google-success', { detail: mockResponse }));
    return;
  }
  window.location.href = `${BASE_URL}/auth/google`;
}

export async function handleGoogleCallback(code: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/google/callback', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  tokenStorage.save(data.token);
  return data;
}