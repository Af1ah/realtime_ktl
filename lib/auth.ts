import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'driver' | 'dispatcher' | 'viewer';
  permissions: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            accessToken: data.access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      refreshToken: async () => {
        try {
          // TODO: Implement token refresh logic
          const response = await fetch('/api/auth/refresh/', {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();
          set({ accessToken: data.access_token });
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);