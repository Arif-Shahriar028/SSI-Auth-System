'use client';

import { useEffect, useState } from 'react';
import EmailPage from '@/components/EmailPage';
import QrCodePage from '@/components/QrCodePage';
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
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/LoadingModal';
import { toast } from 'react-toastify';

export type PageType = 'email' | 'qr' | 'form';

export interface UserProfile {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
}

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageType>('email');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingModalText, setLoadingModalText] = useState('');

  const [optError, setOtpError] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>({ email: '' });
  const [invitationUrl, setInvitationUrl] = useState('');

  const { connectSocket, connUpdateData, credUpdateData, proofUpdateData } =
    useWebSocket();

  const { auth, login } = useAuth();

  const handleEmailSubmit = async (email: string) => {
    setUserProfile((prev) => ({ ...prev, email }));

    try {
      // check email exist or not
      // if exist, then sent proof request to the connection id
      const response = await apiFetch(checkEmail(email), 'GET');

      if (response.success) {
        connectSocket(email);

        if (!response.data.sentCredential) {
          setCurrentPage('form');
        } else if (!response.data.issuedCredential) {
          setCurrentPage('form');
          setLoadingModalText(
            'Credentials are already sent to your mobile wallet. Accept the credential to login.'
          );
          setShowLoadingModal(true);
        } else {
          const result = await apiFetch(sendProofRequest, 'POST', { email });

          if (result.success) {
            setLoadingModalText(
              'A proof request is sent to your wallet. Please share your credentials associated with E-Shop'
            );
            setShowLoadingModal(true);
          } else {
            toast.error(result.error);
          }
        }
      } else {
        // if not exist, send otp to the email
        // then show the otp modal
        const otpResponse = await apiFetch(sendOtp, 'POST', { email });

        if (otpResponse.otpSent) {
          setShowOtpModal(true);
        } else {
          toast.error(otpResponse.error);
        }
      }
    } catch (error) {
      toast.error(error as string);
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
          setOtpError(invitationResult.error);
        }
      } else {
        setOtpError('OTP mismatched');
      }
    } catch (error) {
      setOtpError(error as string);
    }
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

      if (credentialResult.success) {
        setLoadingModalText(
          'Credentials are sent to your mobile wallet. Accept the credential.'
        );
        setShowLoadingModal(true);
      }
    } catch (error) {
      toast.error(error as string);
    }
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
        return <QrCodePage invitationUrl={invitationUrl} />;
      case 'form':
        return <ProfileFormPage onSubmit={handleProfileSubmit} />;
      default:
        return <EmailPage onSubmit={handleEmailSubmit} />;
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/home');
    }
  }, [auth]);

  useEffect(() => {
    if (connUpdateData?.success) {
      setCurrentPage('form');
    }
  }, [connUpdateData]);

  useEffect(() => {
    if (credUpdateData?.success) {
      login(
        credUpdateData.credentials?.name || '',
        credUpdateData.credentials?.email || '',
        credUpdateData.credentials?.phone || '',
        credUpdateData.credentials?.token || ''
      );
    }
  }, [credUpdateData]);

  useEffect(() => {
    if (proofUpdateData?.success) {
      login(
        proofUpdateData.credentials?.name || '',
        proofUpdateData.credentials?.email || '',
        proofUpdateData.credentials?.phone || '',
        proofUpdateData.credentials?.token || ''
      );
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
          error={optError}
        />
      )}

      {showLoadingModal && <LoadingModal text={loadingModalText} />}
    </div>
  );
}
