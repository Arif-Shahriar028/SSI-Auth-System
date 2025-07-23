'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodePageProps {
  invitationUrl: string;
}

export default function QrCodePage({ invitationUrl }: QrCodePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [invitationUrl]);

  const generateQRCode = async () => {
    if (canvasRef.current) {
      // Dynamic import for client-side only

      try {
        await QRCode.toCanvas(canvasRef.current, invitationUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#7C3AED',
            light: '#FFFFFF',
          },
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 text-center animate-float">
        <h2 className="text-2xl font-bold text-white mb-6">Scan QR Code</h2>

        <div className="bg-white rounded-2xl p-6 mb-6">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>

        <p className="text-white/80 mb-6">
          Scan this QR code with your wallet.
        </p>
      </div>
    </div>
  );
}
