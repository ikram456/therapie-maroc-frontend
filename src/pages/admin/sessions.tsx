import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { Calendar, Video } from 'lucide-react';

export default function AdminSessions() {
  const { data: sessions, isLoading } = useQuery('admin-sessions', async () => {
    const response = await api.get('/admin/sessions');
    return response.data.data;
  });

  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Seances</h1>
            <p className="text-white/80 mt-1">{sessions?.length || 0} seances au total</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : !sessions?.length ? (
            <div className="card-moroccan p-12 text-center">
              <Calendar className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune seance pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((s: any) => (
                <div key={s.id} className="card-moroccan p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-majorelle-100 flex items-center justify-center">
                    <Video className="h-6 w-6 text-majorelle-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{s.patient?.firstName} {s.patient?.lastName}</h3>
                    <p className="text-sm text-gray-500">avec {s.therapist?.firstName} {s.therapist?.lastName}</p>
                    <p className="text-xs text-gray-400">{new Date(s.scheduledAt).toLocaleString('fr-FR')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    s.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                    s.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
