import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const TWILIO_ACCOUNT_SID = 'AC5d2e9ee9e3863ae1cfa2d74fe5d796b6';
const TWILIO_AUTH_TOKEN = '0d09a206e575e38b17fd052b787bdc70';
const TWILIO_SERVICE_ID = 'SK2be5b09a4ffc471dba00fafc769dae9f';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Authentication Services
export const authService = {
  // User Registration
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // User Login
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Send OTP via Twilio
  async sendOTP(phoneNumber: string) {
    try {
      const response = await api.post('/auth/send-otp', {
        phoneNumber,
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN,
        serviceId: TWILIO_SERVICE_ID,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string) {
    try {
      const response = await api.post('/auth/verify-otp', {
        phoneNumber,
        otp,
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN,
        serviceId: TWILIO_SERVICE_ID,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Handle API errors
  handleError(error: any) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }
};

// User Profile Services
export const userService = {
  // Update user profile
  async updateProfile(userId: string, profileData: any) {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      
      // Update local storage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Change password
  async changePassword(userId: string, passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await api.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post(`/users/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update local storage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, profilePicture: response.data.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get user analytics
  async getUserAnalytics(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/analytics`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get user activities
  async getUserActivities(userId: string, filters?: any) {
    try {
      const response = await api.get(`/users/${userId}/activities`, { params: filters });
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Movie Analysis Services
export const movieService = {
  // Upload movie transcript
  async uploadTranscript(file: File, metadata?: any) {
    try {
      const formData = new FormData();
      formData.append('transcript', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      const response = await api.post('/movies/upload-transcript', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get movie analysis
  async getMovieAnalysis(movieId: string) {
    try {
      const response = await api.get(`/movies/${movieId}/analysis`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get all movies for user
  async getUserMovies(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/movies`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get movie predictions
  async getMoviePredictions(movieId: string) {
    try {
      const response = await api.get(`/movies/${movieId}/predictions`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Analytics Services
export const analyticsService = {
  // Get dashboard analytics
  async getDashboardAnalytics(userId: string) {
    try {
      const response = await api.get(`/analytics/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get user performance metrics
  async getUserPerformance(userId: string, timeRange?: string) {
    try {
      const response = await api.get(`/analytics/performance/${userId}`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Settings Services
export const settingsService = {
  // Update user settings
  async updateSettings(userId: string, settings: any) {
    try {
      const response = await api.put(`/users/${userId}/settings`, settings);
      
      // Update local storage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, settings: response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Get user settings
  async getUserSettings(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/settings`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

export default api;
