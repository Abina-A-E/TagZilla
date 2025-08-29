import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localDB } from '../services/database';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import TagzillaLogo from '../components/ui/TagzillaLogo';
import { Eye, EyeOff, User, Mail, Phone, Chrome, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUp: React.FC = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('⏳ Initializing...');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Monitor database status
  useEffect(() => {
    const checkDbStatus = () => {
      const status = localDB.isReady() ? '✅ Ready' : '⏳ Initializing...';
      setDbStatus(status);
    };

    // Check immediately
    checkDbStatus();

    // Check every 500ms
    const interval = setInterval(checkDbStatus, 500);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    
    if (!formData.username.trim()) {
      toast.error('Please enter a username');
      return false;
    }
    
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (!formData.password) {
      toast.error('Please enter a password');
      return false;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if database is ready
    if (!localDB.isReady()) {
      toast.error('Database is not ready yet. Please wait a moment and try again.');
      return;
    }

    setSignupLoading(true);
    try {
      console.log('TAGZILLA: Attempting signup with data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim()
      });

      // Check if database is ready
      if (typeof window !== 'undefined' && !window.indexedDB) {
        throw new Error('IndexedDB not supported in this browser');
      }

      // Wait a bit for database to initialize
      await new Promise(resolve => setTimeout(resolve, 200));

      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phone.trim()
      });
      
      console.log('TAGZILLA: Signup result:', result);
      
      if (result.success) {
        toast.success(result.message);
        // Store user data for 2FA
        localStorage.setItem('tempUser', JSON.stringify({
          id: result.userId,
          phoneNumber: formData.phone.trim()
        }));
        // Navigate to 2FA page
        window.location.href = '/2fa';
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('TAGZILLA: Signup error:', error);
      if (error instanceof Error) {
        toast.error(`Signup failed: ${error.message}`);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // TODO: Implement Google OAuth
      toast.success('Google sign-up coming soon!');
      setTimeout(() => setGoogleLoading(false), 1000);
    } catch (error) {
      toast.error('Google sign-up failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  // Test database connection
  const testDatabase = async () => {
    try {
      console.log('TAGZILLA: Testing database connection...');
      
      // Check database status
      const dbStatus = localDB.getStatus();
      console.log('TAGZILLA: Database status:', dbStatus);
      
      if (!dbStatus.isReady) {
        toast.error('Database not ready. Status: ' + JSON.stringify(dbStatus));
        return;
      }
      
      const testResult = await register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        phoneNumber: '+1234567890'
      });
      console.log('TAGZILLA: Test signup result:', testResult);
      
      if (testResult.success) {
        toast.success('Database connection test successful!');
        // Clean up test user
        // Note: In a real app, you'd want to delete the test user
      } else {
        toast.error(`Database test failed: ${testResult.message}`);
      }
    } catch (error) {
      console.error('TAGZILLA: Database test error:', error);
      toast.error('Database connection test failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-secondary-100 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="mb-6">
            <TagzillaLogo size="lg" className="justify-center" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join TAGZILLA and start analyzing movies</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          {/* Database Status Display */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Database Status: {dbStatus}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
                icon={<User className="h-4 w-4" />}
              />
              
              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(value) => handleInputChange('username', value)}
                required
                icon={<User className="h-4 w-4" />}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              icon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              icon={<Phone className="h-4 w-4" />}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-primary-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-primary-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={signupLoading}
              disabled={signupLoading || !localDB.isReady()}
              className="w-full"
            >
              {signupLoading ? 'Creating Account...' : 
               !localDB.isReady() ? 'Database Not Ready' : 'Create Account'}
            </Button>
            
            {/* Temporary test button for debugging */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Debug: Test database connection</p>
              <Button
                type="button"
                variant="outline"
                onClick={testDatabase}
                disabled={!localDB.isReady()}
                className="w-full"
              >
                {localDB.isReady() ? 'Test Database Connection' : 'Database Not Ready'}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignUp}
              loading={googleLoading}
              disabled={googleLoading}
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Chrome className="h-5 w-5 mr-2" />
              {googleLoading ? 'Creating Account...' : 'Sign up with Google'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing up, you'll get access to AI-powered movie analysis and script insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
