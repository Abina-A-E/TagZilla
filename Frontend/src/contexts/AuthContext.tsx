import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, userService } from '../services/api';
import { localDB } from '../services/database';
import { twilioService } from '../services/twilio';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  lastLogin: Date;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: {
      profileVisibility: 'public' | 'private';
      activityVisibility: 'public' | 'private';
    };
  };
  analytics: {
    totalAnalyses: number;
    totalUploads: number;
    averageAccuracy: number;
    favoriteGenres: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<{ success: boolean; message: string; userId?: string }>;
  logout: () => void;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string; verificationId?: string }>;
  verifyOTP: (phoneNumber: string, otp: string, verificationId: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  uploadProfilePicture: (file: File) => Promise<{ success: boolean; message: string; profilePicture?: string }>;
  updateSettings: (settings: Partial<User['settings']>) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('TAGZILLA: AuthProvider initializing...');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait a bit for database to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if user is already authenticated
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const userData = JSON.parse(userStr);
          
          try {
            // Verify token is still valid
            const session = await localDB.getSessionByToken(token);
            if (session && session.isActive && new Date() < session.expiresAt) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              // Token expired, clean up
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              try {
                await localDB.deactivateSession(token);
              } catch (dbError) {
                console.warn('Could not deactivate session:', dbError);
              }
            }
          } catch (dbError) {
            console.warn('Database not ready yet, skipping session validation:', dbError);
            // If database is not ready, assume token is valid for now
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clean up invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Check if user exists in local database
      const existingUser = await localDB.getUserByEmail(email);
      if (!existingUser) {
        return { success: false, message: 'User not found. Please register first.' };
      }

      // Verify password (in production, this would be hashed)
      if (existingUser.password !== password) {
        return { success: false, message: 'Invalid password.' };
      }

      // Create session
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`;
      await localDB.createSession(existingUser.id, token);
      
      // Update last login
      const updatedUser = await localDB.updateUser(existingUser.id, {
        lastLogin: new Date()
      });

      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Create login activity
      await localDB.createActivity({
        userId: updatedUser.id,
        type: 'login',
        title: 'User Login',
        description: 'User logged in successfully',
        timestamp: new Date(),
        status: 'completed'
      });

      setUser(updatedUser);
      setIsAuthenticated(true);

      return { success: true, message: 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<{ success: boolean; message: string; userId?: string }> => {
    try {
      console.log('TAGZILLA: AuthContext register called with:', userData);
      setIsLoading(true);
      
      // Check if user already exists
      console.log('TAGZILLA: Checking if user exists...');
      const existingUser = await localDB.getUserByEmail(userData.email);
      if (existingUser) {
        console.log('TAGZILLA: User already exists');
        return { success: false, message: 'User with this email already exists.' };
      }

      // Create new user
      console.log('TAGZILLA: Creating new user...');
      const newUser = await localDB.createUser(userData);
      console.log('TAGZILLA: User created successfully:', newUser.id);
      
      // Create registration activity
      console.log('TAGZILLA: Creating registration activity...');
      await localDB.createActivity({
        userId: newUser.id,
        type: 'login',
        title: 'User Registration',
        description: 'New user registered successfully',
        timestamp: new Date(),
        status: 'completed'
      });

      console.log('TAGZILLA: Registration completed successfully');
      return { 
        success: true, 
        message: 'Registration successful! Please verify your phone number.',
        userId: newUser.id
      };
    } catch (error) {
      console.error('TAGZILLA: Registration error:', error);
      if (error instanceof Error) {
        return { success: false, message: `Registration failed: ${error.message}` };
      } else {
        return { success: false, message: 'Registration failed. Please try again.' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await localDB.deactivateSession(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Send OTP
  const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; message: string; verificationId?: string }> => {
    try {
      const result = await twilioService.sendOTP(phoneNumber);
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  // Verify OTP
  const verifyOTP = async (phoneNumber: string, otp: string, verificationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await twilioService.verifyOTP(phoneNumber, otp, verificationId);
      
      if (result.success) {
        // OTP verified, complete user registration/login
        const userStr = localStorage.getItem('tempUser');
        if (userStr) {
          const tempUser = JSON.parse(userStr);
          
          // Update user with verified phone number
          if (tempUser.id) {
            await localDB.updateUser(tempUser.id, { phoneNumber });
          }
          
          localStorage.removeItem('tempUser');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: 'Failed to verify OTP. Please try again.' };
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'User not authenticated.' };
      }

      const updatedUser = await localDB.updateUser(user.id, updates);
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Create profile update activity
      await localDB.createActivity({
        userId: user.id,
        type: 'profile_update',
        title: 'Profile Updated',
        description: 'User profile information updated',
        timestamp: new Date(),
        status: 'completed'
      });

      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Failed to update profile. Please try again.' };
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'User not authenticated.' };
      }

      // Verify current password
      if (user.password !== currentPassword) {
        return { success: false, message: 'Current password is incorrect.' };
      }

      // Update password
      await localDB.updateUser(user.id, { password: newPassword });
      
      // Create password change activity
      await localDB.createActivity({
        userId: user.id,
        type: 'settings',
        title: 'Password Changed',
        description: 'User password updated successfully',
        timestamp: new Date(),
        status: 'completed'
      });

      return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password. Please try again.' };
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file: File): Promise<{ success: boolean; message: string; profilePicture?: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'User not authenticated.' };
      }

      // Convert file to base64 for storage (in production, this would upload to cloud storage)
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(file);
      const profilePicture = await base64Promise;

      // Update user profile
      await localDB.updateUser(user.id, { profilePicture });
      
      // Update local storage
      const updatedUser = { ...user, profilePicture };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { 
        success: true, 
        message: 'Profile picture uploaded successfully!',
        profilePicture
      };
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return { success: false, message: 'Failed to upload profile picture. Please try again.' };
    }
  };

  // Update settings
  const updateSettings = async (settings: Partial<User['settings']>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return { success: false, message: 'User not authenticated.' };
      }

      const updatedUser = await localDB.updateUser(user.id, {
        settings: { ...user.settings, ...settings }
      });
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Create settings update activity
      await localDB.createActivity({
        userId: user.id,
        type: 'settings',
        title: 'Settings Updated',
        description: 'User settings updated',
        timestamp: new Date(),
        status: 'completed'
      });

      return { success: true, message: 'Settings updated successfully!' };
    } catch (error) {
      console.error('Update settings error:', error);
      return { success: false, message: 'Failed to update settings. Please try again.' };
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      if (!user) return;

      const updatedUser = await localDB.getUserById(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    updateProfile,
    changePassword,
    uploadProfilePicture,
    updateSettings,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
