'use client';

import { verifyUser } from '@/network/api';
import { apiFetch } from '@/network/fetch';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  phone: string;
}

interface Auth {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  auth: Auth;
  login: (email: string, name: string, phone: string, jwt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // check whether user is logged in
    checkAuth();

    // check every minute
    const interval = setInterval(checkAuth, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiFetch(verifyUser, 'GET');

      if (response.success) {
        setAuth({
          isAuthenticated: true,
          user: response.user,
        });
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
        });

        // Clear cookies
        document.cookie =
          'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie =
          'email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie =
          'name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie =
          'phone=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

        router.replace('/');
      }
    } catch (error) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
      router.replace('/');
    }
  };

  const login = (name: string, email: string, phone: string, jwt: string) => {
    // setAuth()

    if (!email || !name || !phone || !jwt) {
      throw Error('something missing in the credential');
    }

    document.cookie = `token=${jwt}; path=/;`;
    document.cookie = `email=${email}; path=/;`;
    document.cookie = `name=${encodeURIComponent(name)}; path=/;`;
    document.cookie = `phone=${phone}; path=/;`;

    setAuth({
      isAuthenticated: true,
      user: {
        name,
        email,
        phone,
      },
    });

    router.replace('/home');
  };

  const logout = async () => {
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'phone=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    setAuth({
      isAuthenticated: false,
      user: null,
    });

    window.location.replace('/');
    // router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
