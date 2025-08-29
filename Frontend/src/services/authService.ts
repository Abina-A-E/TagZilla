import { apiService } from './api';
import { User, LoginForm, ApiResponse } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Store tokens and user data
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please check your credentials.',
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        // Store tokens and user data
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await apiService.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiService.put<User>('/auth/profile', userData);
    
    if (response.success && response.data) {
      localStorage.setItem('user_data', JSON.stringify(response.data));
    }
    
    return response;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return await apiService.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return await apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<any>> {
    return await apiService.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
  }

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = this.getAuthToken();
    if (!token) return true;

    try {
      // Basic JWT token parsing (in production, use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Mock login for development
  async mockLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      role: 'user',
      loginDate: new Date().toISOString().split('T')[0],
      memberSince: '2023-01-01',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockRefreshToken = 'mock-refresh-token-' + Date.now();

    // Store mock data
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('refresh_token', mockRefreshToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      },
    };
  }
}

export const authService = new AuthService();
