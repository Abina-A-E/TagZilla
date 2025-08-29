// Twilio Service for OTP Verification
// This service handles SMS OTP verification using Twilio's Verify API

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  serviceId: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  verificationId?: string;
  error?: string;
}

class TwilioService {
  private config: TwilioConfig;
  private baseUrl: string;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.baseUrl = `https://verify.twilio.com/v2/Services/${config.serviceId}`;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      // For development purposes, we'll simulate Twilio API calls
      // In production, this would make actual HTTP requests to Twilio
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock verification ID
      const verificationId = this.generateVerificationId();
      
      // Store the OTP in localStorage for verification (in real app, this would be server-side)
      const otpData = {
        phoneNumber,
        otp: this.generateOTP(),
        verificationId,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0,
        maxAttempts: 3
      };
      
      localStorage.setItem(`otp_${verificationId}`, JSON.stringify(otpData));
      
      // In production, this would send actual SMS via Twilio
      console.log(`OTP sent to ${phoneNumber}: ${otpData.otp}`);
      
      return {
        success: true,
        message: 'OTP sent successfully',
        verificationId
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string, verificationId: string): Promise<OTPResponse> {
    try {
      // Get stored OTP data
      const otpDataStr = localStorage.getItem(`otp_${verificationId}`);
      if (!otpDataStr) {
        return {
          success: false,
          message: 'Invalid verification ID'
        };
      }

      const otpData = JSON.parse(otpDataStr);
      
      // Check if OTP has expired
      if (Date.now() > otpData.expiresAt) {
        localStorage.removeItem(`otp_${verificationId}`);
        return {
          success: false,
          message: 'OTP has expired'
        };
      }

      // Check if max attempts exceeded
      if (otpData.attempts >= otpData.maxAttempts) {
        localStorage.removeItem(`otp_${verificationId}`);
        return {
          success: false,
          message: 'Maximum verification attempts exceeded'
        };
      }

      // Check if phone number matches
      if (otpData.phoneNumber !== phoneNumber) {
        return {
          success: false,
          message: 'Phone number mismatch'
        };
      }

      // Increment attempts
      otpData.attempts++;
      localStorage.setItem(`otp_${verificationId}`, JSON.stringify(otpData));

      // Verify OTP
      if (otpData.otp === otp) {
        // OTP is correct, clean up
        localStorage.removeItem(`otp_${verificationId}`);
        
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Resend OTP
  async resendOTP(phoneNumber: string, verificationId: string): Promise<OTPResponse> {
    try {
      // Remove old OTP data
      localStorage.removeItem(`otp_${verificationId}`);
      
      // Send new OTP
      return await this.sendOTP(phoneNumber);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check OTP status
  async checkOTPStatus(verificationId: string): Promise<OTPResponse> {
    try {
      const otpDataStr = localStorage.getItem(`otp_${verificationId}`);
      if (!otpDataStr) {
        return {
          success: false,
          message: 'Verification ID not found'
        };
      }

      const otpData = JSON.parse(otpDataStr);
      
      if (Date.now() > otpData.expiresAt) {
        return {
          success: false,
          message: 'OTP has expired'
        };
      }

      return {
        success: true,
        message: 'OTP is valid',
        verificationId
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to check OTP status',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate verification ID
  private generateVerificationId(): string {
    return 'ver_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs(): void {
    const keys = Object.keys(localStorage);
    const otpKeys = keys.filter(key => key.startsWith('otp_'));
    
    otpKeys.forEach(key => {
      try {
        const otpData = JSON.parse(localStorage.getItem(key) || '{}');
        if (Date.now() > otpData.expiresAt) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Remove invalid OTP data
        localStorage.removeItem(key);
      }
    });
  }

  // Get remaining attempts for a verification
  getRemainingAttempts(verificationId: string): number {
    try {
      const otpDataStr = localStorage.getItem(`otp_${verificationId}`);
      if (!otpDataStr) return 0;
      
      const otpData = JSON.parse(otpDataStr);
      return Math.max(0, otpData.maxAttempts - otpData.attempts);
    } catch (error) {
      return 0;
    }
  }

  // Get OTP expiry time
  getOTPExpiryTime(verificationId: string): Date | null {
    try {
      const otpDataStr = localStorage.getItem(`otp_${verificationId}`);
      if (!otpDataStr) return null;
      
      const otpData = JSON.parse(otpDataStr);
      return new Date(otpData.expiresAt);
    } catch (error) {
      return null;
    }
  }
}

// Create Twilio service instance with your credentials
export const twilioService = new TwilioService({
  accountSid: 'AC5d2e9ee9e3863ae1cfa2d74fe5d796b6',
  authToken: '0d09a206e575e38b17fd052b787bdc70',
  serviceId: 'SK2be5b09a4ffc471dba00fafc769dae9f'
});

// Clean up expired OTPs every minute (only in browser environment)
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setInterval(() => {
        twilioService.cleanupExpiredOTPs();
      }, 60000);
    });
  } else {
    setInterval(() => {
      twilioService.cleanupExpiredOTPs();
    }, 60000);
  }
}

export default twilioService;
