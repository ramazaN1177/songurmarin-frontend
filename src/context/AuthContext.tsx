import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { apiService } from '../api/client';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smm_admin_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smm_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smm_admin_token', token);
    } else {
      localStorage.removeItem('smm_admin_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smm_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smm_admin_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await apiService.login(email, password);
      const authToken = res?.token || (res as any)?.accessToken;
      if (res && authToken) {
        setToken(authToken);
        setUser({
          id: res.user.id,
          email: res.user.email,
          name: (res.user as any).fullName || res.user.name || 'Admin',
          role: res.user.role
        });
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smm_admin_token');
    localStorage.removeItem('smm_admin_user');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
