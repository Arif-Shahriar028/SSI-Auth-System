'use client';

interface HomePageProps {
  onRestart: () => void;
  userProfile: any;
}

export default function HomePage({ onRestart, userProfile }: HomePageProps) {
  return (
    <div className="w-full max-w-2xl text-center">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 animate-float">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="text-xl text-white/80 mb-8">
            You've successfully completed the setup process!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
            <p className="text-white/70 text-sm">
              Your account is protected with multi-factor authentication
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Verified</h3>
            <p className="text-white/70 text-sm">
              Email and device verification completed
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Ready</h3>
            <p className="text-white/70 text-sm">
              Your profile is set up and ready to use
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-3 bg-white/20 text-white rounded-2xl font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          Start Over (Demo)
        </button>
      </div>
    </div>
  );
}
