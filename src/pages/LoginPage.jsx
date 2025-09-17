/**
 * @description This file defines the login page component for email OTP authentication.
 * It handles both standard user login and admin-specific login flows.
 * The component manages sending and verifying OTPs, and redirects users upon successful authentication.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../libs/supabase';
import {
  Mail,
  Send,
  Shield,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Home,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage = ({ adminLogin = false }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (adminLogin ? '/admin' : '/');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: !adminLogin, // Don't create new users from admin login
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(`A verification code has been sent to ${email}.`);
      setStep('otp');
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid OTP or session could not be created.');
    }
    setLoading(false);
  };

  const goBack = () => {
    setStep('email');
    setError('');
    setMessage('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={adminLogin ? '/admin' : '/'}>
            <img
              src="https://heyboss.heeyo.ai/user-assets/Brand initial Simple Logo_sWHBd-vU.png"
              alt="Neba Connections Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {adminLogin ? 'Admin Sign In' : 'Sign In / Register'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'email'
              ? 'Enter your email to receive a verification code.'
              : `Enter the code sent to ${email}.`}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@company.com"
              />
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <Input
                label="Verification Code"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code"
              />
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Verify & Sign In
              </Button>
            </form>
          )}

          {error && (
            <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          {message && !error && (
            <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded-lg flex items-center">
              <Check className="w-4 h-4 mr-2" />
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            {step === 'otp' && (
              <button
                onClick={goBack}
                className="text-sm text-secondary hover:underline"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to email entry
              </button>
            )}
            {!adminLogin && step === 'email' && (
              <Link to="/" className="text-sm text-secondary hover:underline">
                <Home className="w-4 h-4 inline mr-1" />
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
