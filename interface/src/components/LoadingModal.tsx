import React from 'react';

interface LoadingModalProps {
  text?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  text = 'Please wait...',
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-600 bg-opacity-40">
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <svg
        className="animate-spin h-8 w-8 text-cyan-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <span className="text-cyan-700 font-semibold text-lg">{text}</span>
    </div>
  </div>
);

export default LoadingModal;
