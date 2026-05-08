import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { Calendar } from 'lucide-react';

export default function TherapistSessionsPage() {
  const { data: sessions, isLoading } = useQuery('therapist-sessions', async () => {
    const response = await api.get('/sessions');
    return response.data.data;
  });

  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Mes Séances</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : !sessions?.length ? (
            <div className="card-moroccan p-12 text-center">
              <Calendar className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune séance pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions?.map((s: any) => (
                <div key={s.id} className="card-moroccan p-4">
                  <h3 className="font-bold">{s.patient?.firstName} {s.patient?.lastName}</h3>
                  <p className="text-sm text-gray-500">{new Date(s.scheduledAt).toLocaleString('fr-FR')}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-majorelle-100 text-majorelle-500">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
