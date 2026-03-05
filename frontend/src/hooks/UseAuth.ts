import { useState, useEffect } from 'react';
import {
  signIn,
  signUp,
  signOut,
  initiateGoogleSignIn,
  type SignInPayload,
  type SignUpPayload,
  type AuthUser,
  type ApiError,
  type AuthResponse,
} from '../services/AuthService';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: ApiError | null;
  handleSignIn: (payload: SignInPayload) => Promise<AuthUser | null>;
  handleSignUp: (payload: SignUpPayload) => Promise<AuthUser | null>;
  handleSignOut: () => Promise<void>;
  handleGoogleSignIn: () => void;
  clearError: () => void;
}

export function useAuth(
  onSuccess?: () => void,
  onUserChange?: (user: AuthUser | null) => void 
): UseAuthReturn {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<ApiError | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AuthResponse>).detail;
      setUser(detail.user);
      onUserChange?.(detail.user); 
      onSuccess?.();
    };
    window.addEventListener('mock-google-success', handler);
    return () => window.removeEventListener('mock-google-success', handler);
  }, [onSuccess, onUserChange]);

  const handleSignIn = async (payload: SignInPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signIn(payload);
      setUser(res.user);
      onUserChange?.(res.user); 
      return res.user;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signUp(payload);
      setUser(res.user);
      onUserChange?.(res.user); 
      return res.user;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setUser(null);
    onUserChange?.(null);
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn();
  };

  return {
    user,
    loading,
    error,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleGoogleSignIn,
    clearError,
  };
}