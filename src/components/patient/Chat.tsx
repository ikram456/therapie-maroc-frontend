'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/utils/api';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Send,
  Paperclip,
  Phone,
  Video,
  ChevronLeft,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: string;
  createdAt: string;
  isRead: boolean;
  fileUrl?: string;
  sender: {
    id: string;
    email: string;
    profilePicture?: string;
  };
}

interface Connection {
  id: string;
  status: string;
  patient: { firstName: string; lastName: string; userId: string };
  therapist: { firstName: string; lastName: string; userId: string };
}

export function Chat({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const {
    joinConversation,
    leaveConversation,
    sendMessage: sendSocketMessage,
    onNewMessage,
    onMessagesRead,
    onTyping: onTypingEvent,
  } = useSocket();

  // Récupérer les messages
  const { data: messagesData, isLoading } = useQuery(
    ['messages', connectionId],
    async () => {
      const response = await api.get(`/chat/messages/${connectionId}`);
      return response.data.data;
    }
  );

  // Récupérer les infos de la connexion
  const { data: connectionData } = useQuery<Connection>(
    ['connection', connectionId],
    async () => {
      const response = await api.get(`/connections/${connectionId}`);
      return response.data.data;
    }
  );

  const messages: Message[] = messagesData?.messages || [];
  const connection = connectionData;

  // Envoyer un message via API (fallback si socket échoue)
  const sendMessageMutation = useMutation(
    async (content: string) => {
      const response = await api.post('/chat/messages', {
        connectionId,
        content,
      });
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', connectionId]);
      },
    }
  );

  useEffect(() => {
    joinConversation(connectionId);

    const unsubscribeNewMessage = onNewMessage((data) => {
      queryClient.invalidateQueries(['messages', connectionId]);
    });

    const unsubscribeRead = onMessagesRead(() => {
      queryClient.invalidateQueries(['messages', connectionId]);
    });

    const unsubscribeTyping = onTypingEvent((data) => {
      setIsTyping(data.isTyping);
      // Reset typing indicator after 3 seconds
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      leaveConversation(connectionId);
      unsubscribeNewMessage?.();
      unsubscribeRead?.();
      unsubscribeTyping?.();
    };
  }, [connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage('');

    // Essayer d'abord via socket
    sendSocketMessage({
      connectionId,
      content,
    });

    // Fallback via API
    try {
      await sendMessageMutation.mutateAsync(content);
    } catch (error) {
      toast.error('Erreur lors de l envoi du message');
    }
  };

  const otherParty = connection
    ? connection.patient.userId === 'current-user-id'
      ? connection.therapist
      : connection.patient
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tadelakt-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-tadelakt-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push('/patient/messages')}
          className="p-2 hover:bg-tadelakt-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="w-10 h-10 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold">
          {otherParty?.firstName[0]}
        </div>

        <div className="flex-1">
          <h2 className="font-bold text-gray-800">
            {otherParty?.firstName} {otherParty?.lastName}
          </h2>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            En ligne
          </p>
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-tadelakt-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-majorelle-500" />
          </button>
          <button
            onClick={() => router.push(`/patient/sessions/new?connectionId=${connectionId}`)}
            className="p-2 hover:bg-tadelakt-100 rounded-full transition-colors"
          >
            <Video className="h-5 w-5 text-majorelle-500" />
          </button>
          <button className="p-2 hover:bg-tadelakt-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isMe = message.senderId === 'current-user-id'; // À remplacer par l'ID réel
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : ''}`}>
                  {showAvatar && !isMe && (
                    <div className="w-8 h-8 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 text-xs font-bold shrink-0 self-end">
                      {message.sender.email[0].toUpperCase()}
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMe
                        ? 'bg-majorelle-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && (
                        message.isRead ? (
                          <CheckCheck className="h-3 w-3 opacity-70" />
                        ) : (
                          <Check className="h-3 w-3 opacity-70" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-majorelle-100 flex items-center justify-center">
              {otherParty?.firstName[0]}
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-tadelakt-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-tadelakt-100 rounded-full transition-colors"
          >
            <Paperclip className="h-5 w-5 text-gray-400" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 px-4 py-2 rounded-full bg-tadelakt-100 focus:outline-none focus:ring-2 focus:ring-majorelle-200"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-majorelle-500 text-white rounded-full hover:bg-majorelle-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
