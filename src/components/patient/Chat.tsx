'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from 'react-query';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Send, ChevronLeft, Video, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  sender: { id: string; email: string };
}

export function Chat({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id || '');
      } catch {}
    }
  }, []);

  const { data: messagesData, isLoading } = useQuery(
    ['messages', connectionId],
    async () => {
      const response = await api.get(`/chat/messages/${connectionId}`);
      return response.data.data;
    },
    { refetchInterval: 3000 }
  );

  const { data: connectionData } = useQuery(
    ['connection', connectionId],
    async () => {
      const response = await api.get(`/connections/${connectionId}`);
      return response.data.data;
    }
  );

  const messages: Message[] = messagesData?.messages || messagesData || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post('/chat/messages', { connectionId, content: newMessage.trim() });
      setNewMessage('');
      queryClient.invalidateQueries(['messages', connectionId]);
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const otherParty = connectionData
    ? connectionData.patient?.userId === currentUserId
      ? connectionData.therapist
      : connectionData.patient
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
      <div className="bg-white border-b border-tadelakt-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-tadelakt-100 rounded-full">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="w-10 h-10 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold">
          {otherParty?.firstName?.[0] || '?'}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">
            {otherParty?.firstName || 'Utilisateur'} {otherParty?.lastName || ''}
          </h2>
          <p className="text-xs text-green-500">En ligne</p>
        </div>
        <button
          onClick={() => router.push(`/patient/sessions/${connectionId}/video`)}
          className="p-2 hover:bg-tadelakt-100 rounded-full"
        >
          <Video className="h-5 w-5 text-majorelle-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId === currentUserId;
          return (
            <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                isMe ? 'bg-majorelle-500 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                  <span className="text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (message.isRead ? <CheckCheck className="h-3 w-3 opacity-70" /> : <Check className="h-3 w-3 opacity-70" />)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-tadelakt-200 px-4 py-3">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ecrire un message..."
            className="flex-1 px-4 py-2 rounded-full bg-tadelakt-100 focus:outline-none focus:ring-2 focus:ring-majorelle-200"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-majorelle-500 text-white rounded-full hover:bg-majorelle-600 disabled:opacity-50 transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}