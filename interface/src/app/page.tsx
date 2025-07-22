'use client';

import { useEffect, useState } from 'react';
import EmailPage from '@/components/EmailPage';
import QrCodePage from '@/components/QrCodePage';
// import ProfileFormPage from '@/components/ProfileFormPage';
import HomePage from '@/components/HomePage';
import OtpModal from '@/components/OtpModal';
import ProfileFormPage from '@/components/ProfileFormPage';
import { apiFetch } from '@/network/fetch';
import {
  checkEmail,
  getConnectionInvitation,
  issueCredential,
  sendOtp,
  sendProofRequest,
  verifyOtp,
} from '@/network/api';
import { useWebSocket } from '@/contexts/WebSocketContext';

export type PageType = 'email' | 'qr' | 'form' | 'home';

export interface UserProfile {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('email');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({ email: '' });
  const [invitationUrl, setInvitationUrl] = useState('');

  const { connectSocket, connUpdateData, credUpdateData, proofUpdateData } =
    useWebSocket();

  const handleEmailSubmit = async (email: string) => {
    setUserProfile((prev) => ({ ...prev, email }));

    try {
      // check email exist or not
      // if exist, then sent proof request to the connection id
      const response = await apiFetch(checkEmail(email), 'GET');
      if (response.success) {
        connectSocket(email);
        const result = await apiFetch(sendProofRequest, 'POST', { email });
        // todo: set loading true
        // todo: show toast if proof request sent successfully
      } else {
        // if not exist, send otp to the email
        // then show the otp modal
        const otpResponse = await apiFetch(sendOtp, 'POST', { email });
        if (otpResponse.otpSent) {
          setShowOtpModal(true);
        } else {
          // todo: show a error modal with error message
        }
      }
    } catch (error) {
      // todo: show a error modal with error message
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      // check otp
      const result = await apiFetch(verifyOtp, 'POST', {
        email: userProfile.email,
        otp,
      });

      // if verified, setShowOtpModal(false);
      // call newConnectionInvitation
      // set invitation data to the usestate
      // then switch to qr code page

      if (result.isVerified) {
        setShowOtpModal(false);
        const invitationResult = await apiFetch(
          getConnectionInvitation,
          'POST',
          { email: userProfile.email }
        );

        if (invitationResult.success) {
          connectSocket(userProfile.email);
          setInvitationUrl(invitationResult.data.invitationUrl);
          setCurrentPage('qr');
        } else {
          // todo: show error modal
        }
      } else {
        // todo: show error modal
      }
    } catch (error) {}
  };

  const handleQrScan = () => {
    // start a loop to check whether connection is established or not
    // if connection established, set connectionId to the useState
    // then switch to form page
    setCurrentPage('form');
  };

  const handleProfileSubmit = async (profile: Omit<UserProfile, 'email'>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
    try {
      // send credential offer to the connectionId
      const credentialResult = await apiFetch(issueCredential, 'POST', {
        email: userProfile.email,
        name: profile.name,
        phone: profile.phone,
      });

      // if(credentialResult.success)
      // todo: show a toast to accept the credential
    } catch (error) {}
  };

  const handleRestart = () => {
    setCurrentPage('email');
    setUserProfile({ email: '' });
    setShowOtpModal(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'email':
        return <EmailPage onSubmit={handleEmailSubmit} />;
      case 'qr':
        return (
          <QrCodePage
            onQrScan={handleQrScan}
            email={userProfile.email}
            invitationUrl={invitationUrl}
          />
        );
      case 'form':
        return <ProfileFormPage onSubmit={handleProfileSubmit} />;
      case 'home':
        return <HomePage onRestart={handleRestart} userProfile={userProfile} />;
      default:
        return <EmailPage onSubmit={handleEmailSubmit} />;
    }
  };

  useEffect(() => {
    if (connUpdateData?.success) {
      setCurrentPage('form');
    }
  }, [connUpdateData]);

  useEffect(() => {
    if (credUpdateData?.success) {
      setCurrentPage('home');
    }
  }, [credUpdateData]);

  useEffect(() => {
    if (proofUpdateData?.success) {
      setCurrentPage('home');
    }
  }, [proofUpdateData]);

  return (
    <div className="min-h-screen bg-cyan-600">
      <div className="min-h-screen flex items-center justify-center p-4">
        {renderCurrentPage()}
      </div>

      {showOtpModal && (
        <OtpModal
          email={userProfile.email}
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
}
