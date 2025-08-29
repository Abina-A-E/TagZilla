import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TagzillaLogo from '../components/ui/TagzillaLogo';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const TwoFactorAuth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get user info from location state (passed from login/signup)
  const userInfo = location.state?.userInfo || {
    email: 'user@example.com',
    phone: '+1234567890'
  };

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Auto-send OTP when component mounts
    const sendInitialOTP = async () => {
      const tempUser = localStorage.getItem('tempUser');
      const tempPhone = localStorage.getItem('tempPhone');
      
      if (tempUser || tempPhone) {
        const phoneNumber = tempUser ? JSON.parse(tempUser).phoneNumber : tempPhone;
        try {
          const result = await sendOTP(phoneNumber);
          if (result.success) {
            localStorage.setItem('verificationId', result.verificationId || '');
          }
        } catch (error) {
          console.error('Failed to send initial OTP:', error);
        }
      }
    };
    
    sendInitialOTP();
  }, [sendOTP]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !canResend) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      // Focus last filled input
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    if (verificationAttempts >= maxAttempts) {
      toast.error('Maximum verification attempts reached. Please try again later.');
      return;
    }

    setIsVerifying(true);
    try {
      // Get phone number and verification ID from localStorage
      const tempUser = localStorage.getItem('tempUser');
      const tempPhone = localStorage.getItem('tempPhone');
      
      if (!tempUser && !tempPhone) {
        toast.error('No verification session found. Please try logging in again.');
        navigate('/login');
        return;
      }

      const phoneNumber = tempUser ? JSON.parse(tempUser).phoneNumber : tempPhone;
      const verificationId = localStorage.getItem('verificationId');
      
      if (!verificationId) {
        toast.error('Verification session expired. Please request a new OTP.');
        return;
      }

      // Verify OTP using the auth service
      const result = await verifyOTP(phoneNumber, otpString, verificationId);
      
      if (result.success) {
        toast.success('OTP verified successfully!');
        // Clear temporary data
        localStorage.removeItem('tempUser');
        localStorage.removeItem('tempPhone');
        localStorage.removeItem('verificationId');
        
        // Redirect to home page after successful verification
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        setVerificationAttempts(prev => prev + 1);
        toast.error(result.message);
        // Clear OTP on failure
        setOtp(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      // Get phone number from localStorage
      const tempUser = localStorage.getItem('tempUser');
      const tempPhone = localStorage.getItem('tempPhone');
      
      if (!tempUser && !tempPhone) {
        toast.error('No verification session found. Please try logging in again.');
        navigate('/login');
        return;
      }

      const phoneNumber = tempUser ? JSON.parse(tempUser).phoneNumber : tempPhone;
      
      // Send new OTP
      const result = await sendOTP(phoneNumber);
      
      if (result.success) {
        // Store verification ID
        localStorage.setItem('verificationId', result.verificationId || '');
        
        toast.success('New OTP sent to your phone number');
        setTimeLeft(30);
        setCanResend(false);
        setVerificationAttempts(0);
        setOtp(['', '', '', '', '', '']);
        
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-secondary-100 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <TagzillaLogo size="lg" className="justify-center" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h2>
          <p className="text-gray-600">Enter the 6-digit code sent to your phone</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Identity</h3>
              <p className="text-sm text-gray-600 mb-1">
                We've sent a verification code to:
              </p>
              <p className="text-sm font-medium text-gray-900">{userInfo.phone}</p>
              <p className="text-xs text-gray-500 mt-1">{userInfo.email}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Enter 6-digit OTP
              </label>
              
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                                   <input
                   key={index}
                   ref={(el) => inputRefs.current[index] = el}
                   type="text"
                   inputMode="numeric"
                   pattern="[0-9]*"
                   maxLength={1}
                   value={digit}
                   onChange={(e) => handleOtpChange(index, e.target.value)}
                   onKeyDown={(e) => handleKeyDown(index, e)}
                   onPaste={handlePaste}
                   className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                   disabled={isVerifying}
                   aria-label={`OTP digit ${index + 1}`}
                   title={`OTP digit ${index + 1}`}
                   placeholder="0"
                 />
                ))}
              </div>

              {/* Attempts Warning */}
              {verificationAttempts > 0 && (
                <div className="flex items-center justify-center space-x-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {verificationAttempts}/{maxAttempts} attempts used
                  </span>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              loading={isVerifying}
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full"
              size="lg"
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <Button
                onClick={handleResendOTP}
                loading={isResending}
                disabled={!canResend || isResending}
                variant="outline"
                size="sm"
                className="text-primary-600 border-primary-300 hover:bg-primary-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                {canResend ? 'Resend OTP' : `Resend in ${timeLeft}s`}
              </Button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Go Back
              </button>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Your account is protected with 2FA</span>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Mode</h4>
            <p className="text-xs text-blue-700">
              This is a demonstration. In production, this would integrate with Twilio for real OTP verification.
              <br />
              <strong>Twilio Credentials:</strong> Auth Token: 0d09a206e575e38b17fd052b787bdc70, 
              Service ID: SK2be5b09a4ffc471dba00fafc769dae9f, Account SID: AC5d2e9ee9e3863ae1cfa2d74fe5d796b6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
