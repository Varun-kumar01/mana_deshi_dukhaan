import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('manadeshi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('manadeshi_token')
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('manadeshi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('manadeshi_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('manadeshi_token', token);
    } else {
      localStorage.removeItem('manadeshi_token');
    }
  }, [token]);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        isLoggedIn: !!user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
