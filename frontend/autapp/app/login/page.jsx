'use client';

import React, { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../FireBase/config'; // Import your Firebase config file
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  useEffect(() => {
    try {
      if (!window.recaptchaVerifier) {
        const verifier = new RecaptchaVerifier('recap-Container', {
          size: 'invisible',
        }, auth);
        window.recaptchaVerifier = verifier; // Store in window to avoid reinitialization
        setRecaptchaVerifier(verifier);
      } else {
        setRecaptchaVerifier(window.recaptchaVerifier);
      }
    } catch (error) {
      console.error('Error initializing RecaptchaVerifier:', error.message);
    }
  
    // Cleanup function
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        window.recaptchaVerifier = null; // Clear global reference
      }
    };
  }, [recaptchaVerifier]);
  
  

  useEffect(() => {
    let timer;
    if (isTimerActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, seconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(email, password);
      console.log('Login successful:', response);
      if (response.operationType === 'signIn') {
        setLogin(true);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setLogin(false);
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setSeconds(60);
    setIsTimerActive(true);

    try {
      if (!recaptchaVerifier) {
        throw new Error("RecaptchaVerifier is not initialized");
      }
      console.log('Sending OTP...');
      const response = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('OTP sent:', response);
      // Handle the response here (e.g., show OTP input form, store confirmation result)
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      // Optionally set an error state to display to the user
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl">
        <h2 className="text-4xl font-extrabold text-white text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error.message}
            </p>
          )}
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline transition duration-150 ease-in-out">
            Sign up
          </a>
        </p>

        {/* Phone Number and OTP Input Section */}
        {login && (
          <div className="mt-8 p-4 bg-gray-700 rounded-md shadow-inner">
            <h3 className="text-lg font-medium text-white text-center mb-4">Enter Phone Number</h3>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <h3 className="text-lg font-medium text-white text-center mb-4">Enter OTP</h3>
            <InputOTP maxLength={6}>
              <div className="flex justify-center">
                <InputOTPGroup className="space-x-2">
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={0} />
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={1} />
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="space-x-2">
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={3} />
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={4} />
                  <InputOTPSlot className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" index={5} />
                </InputOTPGroup>
              </div>
            </InputOTP>

            <div className="flex justify-center mt-3">
              <button
                onClick={sendOTP}
                disabled={isTimerActive}
                className={`py-2 px-6 text-lg font-medium rounded-md shadow-lg focus:outline-none transition duration-200 ease-in-out ${isTimerActive ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500'}`}
              >
                {isTimerActive ? `Resend in ${seconds}s` : 'Send OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <div id="recap-Container"></div>
      </div>
    </div>
  );
};

export default Login;
