import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, signOut, tokenStorage, type AuthUser } from '../services/AuthService';

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = tokenStorage.get();
      console.log('token:', token);   
    console.log('mock_user:', localStorage.getItem('mock_user'));
      if (token) {
        const me = await getMe();
        console.log('me:', me);
        setUser(me);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);