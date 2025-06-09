import { browser } from '$app/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentId: string;
  department: string;
  semester: string;
  academicYear: string;
  joinDate: string;
  phone?: string;
  bio?: string;
  location?: string;
}

// Demo user data
const demoUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@student.rsj.edu',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  studentId: 'RSJ2024001',
  department: 'Digital Journalism',
  semester: '3rd Semester',
  academicYear: '2024-25',
  joinDate: '2024-01-15',
  phone: '+1 (555) 123-4567',
  bio: 'Aspiring investigative journalist with a passion for uncovering truth',
  location: 'New York, NY'
};

// Create runes-based stores
export const currentUser = $state<User | null>(null);
export const isAuthenticated = $state<boolean>(false);

// Initialize auth state from localStorage if in browser
if (browser) {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedAuth === 'true' && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      currentUser.value = user;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    }
  }
}

// Auth functions
export async function sendOTP(email: string): Promise<boolean> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random 6-digit OTP for demo
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Demo OTP for ${email}: ${otp}`);
  
  // Store OTP in localStorage for demo purposes
  if (browser) {
    localStorage.setItem('demoOTP', otp);
    localStorage.setItem('demoEmail', email);
  }
  
  return true;
}

export function verifyOTP(email: string, otp: string): boolean {
  if (!browser) return false;
  
  const storedOTP = localStorage.getItem('demoOTP');
  const storedEmail = localStorage.getItem('demoEmail');
  
  if (storedOTP === otp && storedEmail === email) {
    // Set user as authenticated
    currentUser.value = demoUser;
    isAuthenticated.value = true;
    
    // Store in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    
    // Clean up OTP data
    localStorage.removeItem('demoOTP');
    localStorage.removeItem('demoEmail');
    
    return true;
  }
  
  return false;
}

export function logout(): void {
  currentUser.value = null;
  isAuthenticated.value = false;
  
  if (browser) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('demoOTP');
    localStorage.removeItem('demoEmail');
  }
}

export function updateUser(updatedUser: User): void {
  currentUser.value = updatedUser;
  
  if (browser) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }
}