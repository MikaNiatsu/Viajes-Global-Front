import { useState, useEffect, useCallback } from 'react';
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

  const checkAuth = useCallback(async () => {
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
          setAuthState({ isAuthenticated: true, user: data.user.user });
        } else {
          localStorage.removeItem('auth_token');
          setAuthState({ isAuthenticated: false, user: null });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({ isAuthenticated: false, user: null });
      }
    } else {
      setAuthState({ isAuthenticated: false, user: null });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: { correo: string; contrasena: string }) => {
    setIsLoading(true);
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
        router.push('/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setAuthState({ isAuthenticated: false, user: null });
      router.push('/');
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: Cliente) => {
    setAuthState(prevState => ({
      ...prevState,
      user: updatedUser
    }));
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading,
    login,
    logout,
    checkAuth,
    updateUser
  };
}