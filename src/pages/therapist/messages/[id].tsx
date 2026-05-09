import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Send, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function TherapistChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id || '');
      } catch {}
    }
  }, []);

  const { data: messages, refetch } = useQuery(
    ['chat', id],
    async () => {
      if (!id) return [];
      const response = await api.get(`/chat/messages/${id}`);
      return response.data.data;
    },
    { enabled: !!id, refetchInterval: 3000 }
  );

  const { data: connection } = useQuery(
    ['connection', id],
    async () => {
      if (!id) return null;
      const response = await api.get(`/connections/${id}`);
      return response.data.data;
    },
    { enabled: !!id }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !id) return;
    setSending(true);
    try {
      await api.post('/chat/messages', { connectionId: id, content: message.trim() });
      setMessage('');
      refetch();
    } catch {
      toast.error('Erreur lors de l envoi');
    } finally {
      setSending(false);
    }
  };

  const patientName = connection?.patient
    ? `${connection.patient.firstName} ${connection.patient.lastName}`
    : 'Patient';

  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
      <div className="min-h-screen bg-tadelakt-50 flex flex-col">
        <div className="bg-majorelle-500 text-white py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link href="/therapist/messages" className="text-white hover:text-tadelakt-200">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {patientName[0]}
            </div>
            <h1 className="font-bold text-lg">{patientName}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
          <div className="space-y-3">
            {messages?.map((msg: any) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-majorelle-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-tadelakt-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ecrire un message..."
              className="flex-1 px-4 py-3 rounded-xl border border-tadelakt-300 focus:outline-none focus:ring-2 focus:ring-majorelle-500"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !message.trim()}
              className="bg-majorelle-500 text-white p-3 rounded-xl hover:bg-majorelle-600 disabled:opacity-50 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}