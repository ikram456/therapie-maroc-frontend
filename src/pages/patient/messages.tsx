import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight, Clock } from 'lucide-react';

export default function MessagesPage() {
  const { data: connections, isLoading } = useQuery(
    'patient-connections',
    async () => {
      const response = await api.get('/connections');
      return response.data.data;
    }
  );

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Messages</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : connections?.length === 0 ? (
            <div className="card-moroccan p-12 text-center">
              <MessageCircle className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de conversations</p>
              <Link href="/patient/therapists" className="btn-primary inline-block">
                Trouver un thérapeute
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {connections
                ?.filter((c: any) => c.status === 'ACCEPTED')
                .map((connection: any, index: number) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/patient/messages/${connection.id}`}>
                    <div className="card-moroccan p-4 flex items-center gap-4 hover:shadow-xl transition-shadow">
                      <div className="w-14 h-14 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-xl shrink-0">
                        {connection.therapist.firstName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">
                          {connection.therapist.title} {connection.therapist.firstName} {connection.therapist.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{connection.therapist.specialty}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Dernière activité: {new Date(connection.requestedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
