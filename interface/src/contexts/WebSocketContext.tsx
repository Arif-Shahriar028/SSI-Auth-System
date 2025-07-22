'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface WebSocketContextType {
  connUpdateData: SocketUpdateData | undefined;
  credUpdateData: SocketUpdateData | undefined;
  proofUpdateData: SocketUpdateData | undefined;
  connectSocket: (email: string) => void;
  disconnectSocket: () => void;
}

interface Credentials {
  email: string;
  name: string;
  phone: string;
}

interface SocketUpdateData {
  success: boolean;
  message: string;
  credentials?: Credentials;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connUpdateData, setConnUpdateData] = useState<
    SocketUpdateData | undefined
  >();
  const [credUpdateData, setCredUpdateData] = useState<
    SocketUpdateData | undefined
  >();
  const [proofUpdateData, setProofUpdateData] = useState<
    SocketUpdateData | undefined
  >();
  const wsRef = useRef<WebSocket | null>(null);

  const connectSocket = (email: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    console.log('email ------->>>> ', email);
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?email=${email}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      // toast.success('websocket connected');
    };

    ws.onmessage = (event) => {
      const socketData = JSON.parse(event.data);
      if (socketData.type == 'CONNECTION_UPDATE') {
        setConnUpdateData(socketData.data);
      } else if (socketData.type === 'CREDENTIAL_UPDATE') {
        setCredUpdateData(socketData.data);
      } else if (socketData.type === 'PROOF_UPDATE') {
        setProofUpdateData(socketData.data);
      }
    };
  };

  const disconnectSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connUpdateData,
        credUpdateData,
        proofUpdateData,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within an AuthProvider');
  }
  return context;
};
