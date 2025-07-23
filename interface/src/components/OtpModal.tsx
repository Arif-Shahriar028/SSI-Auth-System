'use client';

import { useState, useRef, useEffect } from 'react';

interface OtpModalProps {
  email: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
  error: string;
}

export default function OtpModal({
  email,
  onVerify,
  onClose,
  error,
}: OtpModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length === 6) {
      onVerify(otpString);
    } else {
      alert('Please enter a valid 6-digit code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 w-full max-w-md animate-slide-up">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          Verify Your Email
        </h3>
        <p className="text-white/80 text-center mb-6">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Verify Code
          </button>

          <p className="text-red-400 text-center">{error}</p>

          <p className="text-center text-white/60 text-sm">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={() =>
                alert(`New OTP sent to ${email} (Demo: use 123456)`)
              }
              className="text-white hover:underline"
            >
              Resend
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
