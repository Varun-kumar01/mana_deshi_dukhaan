import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchCurrentUser } from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer' | 'staff';
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

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const USER_STORAGE_KEY = 'manadeshi_user';
const TOKEN_STORAGE_KEY = 'manadeshi_token';

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }

    let cancelled = false;

    const validateSession = async () => {
      try {
        const response = await fetchCurrentUser(token);

        if (cancelled) return;

        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(response.user),
          );
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch {
        // Keep the locally stored session if the backend is temporarily unavailable.
      }
    };

    validateSession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user),
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(newUser),
    );

    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin:
          user?.role === 'admin' ||
          user?.role === 'staff',
        isLoggedIn: Boolean(user && token),
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    );
  }

  return context;
};