import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cliente } from '@/types/objects';

interface AuthState {
  isAuthenticated: boolean;
  user: Cliente | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await fetch('/api/check-auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAuthState({ isAuthenticated: true, user: data.user });
        } else {
          localStorage.removeItem('auth_token');
          setAuthState({ isAuthenticated: false, user: null });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({ isAuthenticated: false, user: null });
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials: { correo: string; contrasena: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setAuthState({ isAuthenticated: true, user: data.user });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setAuthState({ isAuthenticated: false, user: null });
      router.push('/');
    }
  };

  return { ...authState, isLoading, login, logout, checkAuth };
}