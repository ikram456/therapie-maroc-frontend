import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const getRoom = async () => {
      try {
        const response = await api.get(`/sessions/${id}/video`);
        setRoomUrl(response.data.data.videoRoomUrl);
      } catch (err) {
        toast.error('Impossible de rejoindre la session vidÃ©o');
        router.push('/patient/sessions');
      } finally {
        setLoading(false);
      }
    };

    getRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin h-16 w-16 border-t-4 border-white rounded-full mx-auto mb-4" />
          <p className="text-lg">Connexion Ã  la session vidÃ©o...</p>
        </div>
      </div>
    );
  }

  if (!roomUrl) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-white font-bold">Session vidÃ©o</h1>
        <button
          onClick={() => router.push('/patient/sessions')}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Quitter
        </button>
      </div>
      <div className="flex-1">
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          className="w-full h-full"
          style={{ minHeight: 'calc(100vh - 60px)', border: 'none' }}
        />
      </div>
    </div>
  );
}
