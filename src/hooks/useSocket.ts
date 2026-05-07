import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinConversation = useCallback((connectionId: string) => {
    socketRef.current?.emit('join_conversation', connectionId);
  }, []);

  const leaveConversation = useCallback((connectionId: string) => {
    socketRef.current?.emit('leave_conversation', connectionId);
  }, []);

  const sendMessage = useCallback((data: {
    connectionId: string;
    content: string;
    messageType?: string;
  }) => {
    socketRef.current?.emit('send_message', data);
  }, []);

  const markAsRead = useCallback((connectionId: string) => {
    socketRef.current?.emit('mark_read', { connectionId });
  }, []);

  const onNewMessage = useCallback((callback: (data: any) => void) => {
    socketRef.current?.on('new_message', callback);
    return () => {
      socketRef.current?.off('new_message', callback);
    };
  }, []);

  const onMessagesRead = useCallback((callback: (data: any) => void) => {
    socketRef.current?.on('messages_read', callback);
    return () => {
      socketRef.current?.off('messages_read', callback);
    };
  }, []);

  const onTyping = useCallback((callback: (data: any) => void) => {
    socketRef.current?.on('typing', callback);
    return () => {
      socketRef.current?.off('typing', callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendMessage,
    markAsRead,
    onNewMessage,
    onMessagesRead,
    onTyping,
  };
}
