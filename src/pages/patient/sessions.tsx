import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function SessionsPage() {
  const { data: sessions, isLoading } = useQuery(
    'patient-sessions',
    async () => {
      const response = await api.get('/sessions');
      return response.data.data;
    }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-600';
      case 'ONGOING': return 'bg-green-100 text-green-600';
      case 'COMPLETED': return 'bg-gray-100 text-gray-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Programmée';
      case 'ONGOING': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Mes séances</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : sessions?.length === 0 ? (
            <div className="card-moroccan p-12 text-center">
              <Calendar className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de séances programmées</p>
              <Link href="/patient/therapists" className="btn-primary inline-block">
                Réserver une séance
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-moroccan p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-majorelle-100 flex flex-col items-center justify-center text-majorelle-500 shrink-0">
                      <span className="text-lg font-bold">
                        {new Date(session.scheduledAt).getDate()}
                      </span>
                      <span className="text-xs uppercase">
                        {new Date(session.scheduledAt).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800">
                          Séance avec Dr. {session.therapist.firstName} {session.therapist.lastName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {getStatusLabel(session.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {session.durationMinutes} minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {session.price} DH
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {session.status === 'SCHEDULED' && (
                        <>
                          <Link
                            href={`/patient/sessions/${session.id}/video`}
                            className="flex items-center gap-2 px-4 py-2 bg-majorelle-500 text-white rounded-lg hover:bg-majorelle-600 transition-colors"
                          >
                            <Video className="h-4 w-4" />
                            Rejoindre
                          </Link>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {session.status === 'COMPLETED' && (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">Terminée</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
