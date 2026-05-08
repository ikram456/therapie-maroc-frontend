import { Layout } from '@/components/common/Layout';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminTherapists() {
  const queryClient = useQueryClient();

  const { data: therapists, isLoading } = useQuery('admin-therapists', async () => {
    const response = await api.get('/admin/therapists');
    return response.data.data;
  });

  const verifyMutation = useMutation(
    async ({ id, verified }: { id: string; verified: boolean }) => {
      await api.put(`/admin/therapists/${id}/verify`, { verified });
    },
    {
      onSuccess: () => {
        toast.success('Statut mis à jour !');
        queryClient.invalidateQueries('admin-therapists');
        queryClient.invalidateQueries('admin-stats');
      },
      onError: () => toast.error('Erreur lors de la mise à jour'),
    }
  );

  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Thérapeutes</h1>
            <p className="text-white/80 mt-1">{therapists?.length || 0} thérapeutes inscrits</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {therapists?.map((t: any) => (
                <div key={t.id} className="card-moroccan p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-xl">
                        {t.firstName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{t.title} {t.firstName} {t.lastName}</h3>
                        <p className="text-sm text-gray-500">{t.specialty}</p>
                        <p className="text-sm text-gray-400">{t.user?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Licence: {t.licenseNumber} | {t.yearsExperience} ans exp. | {t.sessionPrice} MAD/séance
                        </p>
                        <p className="text-xs text-gray-400">
                          Inscrit le: {new Date(t.user?.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.isVerified ? 'bg-green-100 text-green-600' : 
                        t.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-600' : 
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {t.isVerified ? '✅ Vérifié' : t.verificationStatus === 'REJECTED' ? '❌ Rejeté' : '⏳ En attente'}
                      </span>
                      <div className="flex gap-2 mt-2">
                        {!t.isVerified && (
                          <button
                            onClick={() => verifyMutation.mutate({ id: t.id, verified: true })}
                            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approuver
                          </button>
                        )}
                        {t.isVerified && (
                          <button
                            onClick={() => verifyMutation.mutate({ id: t.id, verified: false })}
                            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Révoquer
                          </button>
                        )}
                      </div>
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
