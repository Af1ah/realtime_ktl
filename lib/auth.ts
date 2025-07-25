import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';

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
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  setUser: (user: User) => void;
}

// Custom storage with validation
const customStorage: StateStorage = {
  getItem: (name): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const state = JSON.parse(str);
      if (
        state &&
        typeof state === 'object' &&
        (!state.user || (
          typeof state.user === 'object' &&
          typeof state.user.email === 'string' &&
          typeof state.user.name === 'string' &&
          ['admin', 'driver', 'dispatcher', 'viewer'].includes(state.user.role)
        ))
      ) {
        return str;
      }
      localStorage.removeItem(name);
      return null;
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Dummy login with fixed credentials
          const DUMMY_EMAIL = 'admin@ktl.com';
          const DUMMY_PASSWORD = 'admin123';
          
          if (email !== DUMMY_EMAIL || password !== DUMMY_PASSWORD) {
            throw new Error('Invalid credentials');
          }

          // Simulate API response delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const dummyUser: User = {
            id: 1,
            email: DUMMY_EMAIL,
            name: 'Admin User',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'manage_users'],
          };
          
          // Generate initial token
          const token = 'dummy_token_' + Date.now();
          
          set({
            user: dummyUser,
            accessToken: token,
            isAuthenticated: true,
          });

          // Start token refresh cycle
          setTimeout(() => {
            const state = get();
            if (state.isAuthenticated) {
              state.refreshToken();
            }
          }, 55 * 60 * 1000); // Refresh 5 minutes before expiry
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, role: string = 'viewer') => {
        try {
          // Simulate API response delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const dummyUser: User = {
            id: Date.now(),
            email,
            name,
            role: role as User['role'],
            permissions: ['read'],
          };
          
          set({
            user: dummyUser,
            accessToken: 'dummy_token_' + Date.now(),
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Registration error:', error);
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
          // For demo purposes, we'll just generate a new token
          const newToken = 'dummy_token_' + Date.now();
          set({ accessToken: newToken });
          
          // Schedule next refresh in 55 minutes (assuming 1-hour token validity)
          setTimeout(() => {
            const state = get();
            if (state.isAuthenticated) {
              state.refreshToken();
            }
          }, 55 * 60 * 1000);

          return newToken;
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      })
    }
  )
);