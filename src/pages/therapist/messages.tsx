import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function TherapistMessagesPage() {
  const { data: connections, isLoading } = useQuery('therapist-connections', async () => {
    const response = await api.get('/connections');
    return response.data.data;
  });

  const accepted = connections?.filter((c: any) => c.status === 'ACCEPTED') || [];

  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
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
          ) : accepted.length === 0 ? (
            <div className="card-moroccan p-12 text-center">
              <MessageCircle className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun message pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accepted.map((c: any) => (
                <Link key={c.id} href={`/therapist/messages/${c.id}`}>
                  <div className="card-moroccan p-4 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold">
                      {c.patient?.firstName?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {c.patient?.firstName || 'Patient'} {c.patient?.lastName || ''}
                      </h3>
                      <p className="text-sm text-gray-500">Cliquer pour ouvrir la conversation</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}