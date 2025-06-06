import { writable } from 'svelte/store';

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

export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

export function login(email: string, password: string): boolean {
  // Mock login - in real app, this would make an API call
  if (email && password) {
    currentUser.set(mockUser);
    isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return true;
  }
  return false;
}

export function logout(): void {
  currentUser.set(null);
  isAuthenticated.set(false);
  localStorage.removeItem('currentUser');
}