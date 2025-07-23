'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Mail, Phone, Sparkles } from 'lucide-react';

const HomePage = () => {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome{auth.user?.name ? `, ${auth.user.name}` : ''}!
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Great to see you again. Here's your profile overview:
            </p>
          </div>

          {/* Profile details */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-full mr-4">
                <User className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <span className="block text-sm font-medium text-cyan-700 mb-1">
                  Full Name
                </span>
                <span className="text-gray-800 font-semibold">
                  {auth.user?.name || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-4">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="block text-sm font-medium text-blue-700 mb-1">
                  Email Address
                </span>
                <span className="text-gray-800 font-semibold break-all">
                  {auth.user?.email || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-4">
                <Phone className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <span className="block text-sm font-medium text-indigo-700 mb-1">
                  Phone Number
                </span>
                <span className="text-gray-800 font-semibold">
                  {auth.user?.phone || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
