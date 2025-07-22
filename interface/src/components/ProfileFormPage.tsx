'use client';

import { useState } from 'react';
import { UserProfile } from '@/app/page';

interface ProfileFormPageProps {
  onSubmit: (profile: Omit<UserProfile, 'email'>) => void;
}

export default function ProfileFormPage({ onSubmit }: ProfileFormPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && phone) {
      setIsLoading(true);
      // Simulate API call
      onSubmit({ name, phone });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 animate-float">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
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
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
