import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import TagzillaLogo from '../components/ui/TagzillaLogo';
import { Eye, EyeOff, Mail, Lock, Phone, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoginLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success(result.message);
        // Redirect to 2FA if phone number is provided
        if (formData.phone) {
          // Store phone number for 2FA
          localStorage.setItem('tempPhone', formData.phone);
          // Navigate to 2FA page
          window.location.href = '/2fa';
        } else {
          // Navigate to home page
          window.location.href = '/home';
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // TODO: Implement Google OAuth
      toast.success('Google sign-in coming soon!');
      setTimeout(() => setGoogleLoading(false), 1000);
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <TagzillaLogo size="lg" className="justify-center" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loginLoading}
              disabled={loginLoading}
              className="w-full"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              loading={googleLoading}
              disabled={googleLoading}
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Chrome className="h-5 w-5 mr-2" />
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo credentials: Any valid email and password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
