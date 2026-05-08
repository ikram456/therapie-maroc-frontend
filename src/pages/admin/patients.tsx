import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

export default function AdminPatients() {
  const { data: patients, isLoading } = useQuery('admin-patients', async () => {
    const response = await api.get('/admin/patients');
    return response.data.data;
  });

  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Patients</h1>
            <p className="text-white/80 mt-1">{patients?.length || 0} patients inscrits</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {patients?.map((p: any) => (
                <div key={p.id} className="card-moroccan p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-safran-100 flex items-center justify-center text-safran-500 font-bold text-xl">
                      {p.firstName?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{p.firstName} {p.lastName}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {p.user?.email}
                        </p>
                        {p.user?.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {p.user?.phone}
                          </p>
                        )}
                        {p.city && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {p.city}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(p.user?.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                          {p.gender || 'Genre non précisé'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${p.questionnaireCompleted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {p.questionnaireCompleted ? '✅ Questionnaire complété' : '⏳ Questionnaire en attente'}
                        </span>
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
