import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { Calendar, Video, Clock } from 'lucide-react';
import { useRouter } from 'next/router';

export default function PatientSessionsPage() {
  const router = useRouter();

  const { data: sessions, isLoading } = useQuery('patient-sessions', async () => {
    const response = await api.get('/sessions');
    return response.data.data;
  });

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-600';
    if (status === 'CANCELLED') return 'bg-red-100 text-red-600';
    return 'bg-blue-100 text-blue-600';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'COMPLETED') return 'Terminee';
    if (status === 'CANCELLED') return 'Annulee';
    return 'Planifiee';
  };

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Mes Seances</h1>
            <p className="text-white/80 mt-1">Vos seances video avec vos therapeutes</p>
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
              <p className="text-gray-600 mb-2">Aucune seance pour le moment</p>
              <p className="text-sm text-gray-400">Votre therapeute planifiera une seance avec vous</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s: any) => (
                <div key={s.id} className="card-moroccan p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-xl">
                        {s.therapist?.firstName?.[0] || 'T'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {s.therapist?.title} {s.therapist?.firstName} {s.therapist?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(s.scheduledAt).toLocaleString('fr-FR', {
                            day: '2-digit', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Duree: {s.durationMinutes || 60} minutes
                        </p>
                        {s.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">"{s.notes}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(s.status)}`}>
                        {getStatusLabel(s.status)}
                      </span>
                      {s.status === 'SCHEDULED' && (
                        <button
                          onClick={() => router.push(`/patient/sessions/${s.id}/video`)}
                          className="flex items-center gap-2 bg-majorelle-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-majorelle-600 transition-colors"
                        >
                          <Video className="h-4 w-4" />
                          Rejoindre
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
