import { writable } from 'svelte/store';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  completedCourses: string[];
  achievements: Achievement[];
  joinDate: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  certificateUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setUser: (user: User) => void;
}

const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  role: 'student',
  enrolledCourses: ['1', '2', '3'],
  completedCourses: ['4', '5'],
  achievements: [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Successfully completed your first journalism course',
      icon: '🎓',
      earnedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Perfect Assignment',
      description: 'Scored 100% on an assignment',
      icon: '⭐',
      earnedDate: '2024-01-20'
    }
  ],
  joinDate: '2024-01-01',
  bio: 'Aspiring journalist passionate about investigative reporting and digital media.',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY'
};

// Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        // Mock login - in real app, this would make an API call
        if (email && password) {
          set({ user: mockUser, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Svelte stores for reactive components (derived from Zustand)
export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Sync Zustand with Svelte stores
if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    currentUser.set(state.user);
    isAuthenticated.set(state.isAuthenticated);
  });
  
  // Initialize Svelte stores with current Zustand state
  const initialState = useAuthStore.getState();
  currentUser.set(initialState.user);
  isAuthenticated.set(initialState.isAuthenticated);
}

// Legacy functions for backward compatibility
export function login(email: string, password: string): boolean {
  return useAuthStore.getState().login(email, password);
}

export function logout(): void {
  useAuthStore.getState().logout();
}