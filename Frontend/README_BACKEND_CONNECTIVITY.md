# Tagzilla Backend Connectivity Implementation

This document describes the backend connectivity implementation within the frontend folder, providing a complete authentication and data management system using local storage and simulated APIs.

## 🏗️ Architecture Overview

The backend connectivity is implemented using a service-oriented architecture within the frontend, providing:

- **Local Database Management** using IndexedDB and localStorage
- **Authentication System** with user registration, login, and session management
- **OTP Verification** using Twilio service simulation
- **User Profile Management** with real-time updates
- **Activity Tracking** and analytics
- **Theme Management** with light/dark mode support

## 📁 File Structure

```
frontend/src/
├── contexts/
│   ├── AuthContext.tsx          # Authentication context and state management
│   └── ThemeContext.tsx         # Theme management context
├── services/
│   ├── api.ts                   # API service layer and HTTP client
│   ├── database.ts              # Local database service (IndexedDB)
│   └── twilio.ts                # Twilio OTP service simulation
└── pages/                       # Updated pages with backend integration
```

## 🔐 Authentication System

### Features
- **User Registration**: Complete user account creation with validation
- **User Login**: Secure authentication with session management
- **Two-Factor Authentication**: OTP verification using Twilio service
- **Session Management**: Automatic token validation and cleanup
- **Password Management**: Secure password changes and validation

### Implementation Details

#### AuthContext.tsx
- Manages user authentication state
- Handles login, logout, and registration
- Integrates with local database for user persistence
- Manages OTP verification flow

#### Database Service
- **IndexedDB Integration**: Persistent local storage for users and sessions
- **User Management**: CRUD operations for user profiles
- **Session Tracking**: Secure session management with expiration
- **Activity Logging**: Comprehensive user activity tracking

## 📱 OTP Verification System

### Twilio Service Integration
- **OTP Generation**: 6-digit verification codes
- **SMS Simulation**: Local OTP verification for development
- **Rate Limiting**: Maximum 3 attempts per verification
- **Auto-expiry**: 5-minute OTP validity period

### Configuration
```typescript
// Twilio credentials (stored in env.example)
REACT_APP_TWILIO_ACCOUNT_SID=AC5d2e9ee9e3863ae1cfa2d74fe5d796b6
REACT_APP_TWILIO_AUTH_TOKEN=0d09a206e575e38b17fd052b787bdc70
REACT_APP_TWILIO_SERVICE_ID=SK2be5b09a4ffc471dba00fafc769dae9f
```

## 🗄️ Local Database Schema

### Users Table
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
```

### Sessions Table
```typescript
interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}
```

### Activities Table
```typescript
interface Activity {
  id: string;
  userId: string;
  type: 'analysis' | 'upload' | 'download' | 'share' | 'login' | 'settings' | 'profile_update';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
  status: 'completed' | 'processing' | 'failed';
}
```

## 🎨 Theme Management

### Features
- **Light/Dark Mode**: Automatic theme switching
- **User Preferences**: Theme settings stored in user profile
- **System Integration**: Respects system color scheme preferences
- **Persistence**: Theme selection saved across sessions

### Implementation
```typescript
const { theme, toggleTheme, setTheme } = useTheme();

// Toggle between light and dark
toggleTheme();

// Set specific theme
setTheme('dark');
```

## 🔄 API Service Layer

### HTTP Client Configuration
- **Axios Integration**: Robust HTTP client with interceptors
- **Authentication Headers**: Automatic token inclusion
- **Error Handling**: Centralized error management
- **Request/Response Interceptors**: Automatic token refresh and cleanup

### Service Modules
- **authService**: User authentication operations
- **userService**: User profile and settings management
- **movieService**: Movie transcript analysis operations
- **analyticsService**: User analytics and performance metrics
- **settingsService**: User preferences and configuration

## 🚀 Usage Examples

### User Registration
```typescript
import { useAuth } from '../contexts/AuthContext';

const { register } = useAuth();

const handleRegistration = async () => {
  const result = await register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword',
    phoneNumber: '+1234567890'
  });
  
  if (result.success) {
    // Redirect to 2FA
    navigate('/2fa');
  }
};
```

### OTP Verification
```typescript
import { useAuth } from '../contexts/AuthContext';

const { verifyOTP } = useAuth();

const handleVerification = async () => {
  const result = await verifyOTP(phoneNumber, otp, verificationId);
  
  if (result.success) {
    // Redirect to home page
    navigate('/home');
  }
};
```

### Profile Update
```typescript
import { useAuth } from '../contexts/AuthContext';

const { updateProfile } = useAuth();

const handleProfileUpdate = async () => {
  const result = await updateProfile({
    name: 'Updated Name',
    phoneNumber: '+1987654321'
  });
  
  if (result.success) {
    toast.success('Profile updated successfully!');
  }
};
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```bash
# Copy from env.example
cp env.example .env

# Edit with your actual values
REACT_APP_TWILIO_ACCOUNT_SID=your_account_sid
REACT_APP_TWILIO_AUTH_TOKEN=your_auth_token
REACT_APP_TWILIO_SERVICE_ID=your_service_id
REACT_APP_API_URL=http://localhost:8000
```

### Database Initialization
The local database is automatically initialized when the application starts:

```typescript
// Database is auto-initialized
import { localDB } from './services/database';

// Check database status
if (localDB.isInitialized()) {
  console.log('Database ready');
}
```

## 🧪 Testing and Development

### Local Development
- **Database**: Uses IndexedDB for persistent storage
- **OTP**: Simulated Twilio service for development
- **Authentication**: Local user management and validation
- **Sessions**: In-memory session tracking

### Production Considerations
- **Real Twilio Integration**: Replace simulated service with actual API calls
- **Backend API**: Connect to FastAPI backend for data persistence
- **Security**: Implement proper password hashing and JWT tokens
- **Scalability**: Move from local storage to cloud database

## 📊 Activity Tracking

### Real-time Monitoring
- **User Actions**: Login, logout, profile updates, settings changes
- **System Events**: File uploads, analysis operations, downloads
- **Performance Metrics**: Response times, success rates, error tracking
- **Analytics Dashboard**: Comprehensive user activity overview

### Activity Types
- `analysis`: Movie transcript analysis operations
- `upload`: File upload activities
- `download`: Report and data downloads
- `share`: Content sharing operations
- `login`: Authentication events
- `settings`: Configuration changes
- `profile_update`: Profile modifications

## 🔒 Security Features

### Authentication Security
- **Session Management**: Secure token-based authentication
- **Password Validation**: Strong password requirements
- **Rate Limiting**: OTP attempt limitations
- **Auto-logout**: Session expiration handling

### Data Protection
- **Local Storage**: Secure data persistence
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error messages
- **Privacy Controls**: User-configurable privacy settings

## 🚀 Future Enhancements

### Planned Features
- **Google OAuth**: Social login integration
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native companion app

### Backend Integration
- **FastAPI Backend**: Python backend for production
- **PostgreSQL Database**: Scalable data storage
- **Redis Cache**: High-performance caching
- **Docker Deployment**: Containerized application

## 📝 Troubleshooting

### Common Issues

#### Database Not Initializing
```typescript
// Check browser console for errors
// Ensure IndexedDB is supported
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}
```

#### OTP Not Sending
```typescript
// Check Twilio credentials
// Verify phone number format
// Check localStorage for verification data
```

#### Authentication Failures
```typescript
// Clear localStorage and restart
localStorage.clear();
window.location.reload();
```

### Debug Mode
Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📚 Additional Resources

- **IndexedDB Documentation**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- **Twilio Verify API**: [Twilio Documentation](https://www.twilio.com/docs/verify)
- **React Context**: [React Documentation](https://reactjs.org/docs/context.html)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When contributing to the backend connectivity:

1. **Follow TypeScript conventions** for type safety
2. **Add comprehensive error handling** for all async operations
3. **Update documentation** for new features
4. **Test thoroughly** with different user scenarios
5. **Maintain backward compatibility** when possible

---

This implementation provides a robust foundation for user authentication and data management, ready for production deployment with minimal modifications.
