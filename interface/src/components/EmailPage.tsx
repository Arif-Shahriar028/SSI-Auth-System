'use client';

import { useState } from 'react';

interface EmailPageProps {
  onSubmit: (email: string) => void;
}

export default function EmailPage({ onSubmit }: EmailPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      // Simulate API call
      onSubmit(email);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 animate-float">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-white/80">Enter your email to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:transform-none"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
