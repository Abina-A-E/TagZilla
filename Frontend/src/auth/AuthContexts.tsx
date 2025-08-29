import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginFormData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for development
const mockUserData = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  loginDate: "March 15, 2024",
  memberSince: "January 2023",
  avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  moviesWatched: 247,
  favoriteMovies: 32,
  totalWatchTime: { hours: 1240, minutes: 35 },
  avgSessionTime: { hours: 2, minutes: 15 },
  recentActivity: [
    { type: "watched", movie: "Inception", time: "2 hours ago", rating: 9.2 },
    { type: "favorited", movie: "The Godfather", time: "1 day ago", rating: 9.5 },
    { type: "watched", movie: "Pulp Fiction", time: "3 days ago", rating: 8.9 },
    { type: "reviewed", movie: "The Shawshank Redemption", time: "1 week ago", rating: 9.8 }
  ],
  favoriteGenres: [
    { genre: "Drama", count: 89, percentage: 36 },
    { genre: "Crime", count: 67, percentage: 27 },
    { genre: "Sci-Fi", count: 45, percentage: 18 },
    { genre: "Action", count: 46, percentage: 19 }
  ],
  watchingJourney: [
    { month: "Jan", movies: 18 },
    { month: "Feb", movies: 22 },
    { month: "Mar", movies: 25 },
    { month: "Apr", movies: 19 },
    { month: "May", movies: 28 },
    { month: "Jun", movies: 31 }
  ],
  sentimentAnalysis: {
    positive: 65,
    neutral: 25,
    negative: 10
  },
  dailyActivity: [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 2.1 },
    { day: "Fri", hours: 4.5 },
    { day: "Sat", hours: 5.2 },
    { day: "Sun", hours: 3.8 }
  ]
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = () => {
      try {
        const storedUser = sessionStorage.getItem('tagzilla_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        sessionStorage.removeItem('tagzilla_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid credentials
      if (email && password) {
        const userData = { ...mockUserData, email } as User;
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem('tagzilla_user', JSON.stringify(userData));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Please provide valid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid data
      if (name && username && email && password) {
        const userData = { 
          ...mockUserData, 
          name, 
          username, 
          email,
          memberSince: new Date().toISOString().split('T')[0]
        } as User;
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem('tagzilla_user', JSON.stringify(userData));
        toast.success('Account created successfully!');
        return true;
      } else {
        toast.error('Please fill in all fields');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('tagzilla_user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
