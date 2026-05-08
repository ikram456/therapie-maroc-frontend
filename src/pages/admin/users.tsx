import { Layout } from '@/components/common/Layout';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Trash2, User, Shield, Stethoscope } from 'lucide-react';

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery('admin-users', async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  });

  const deleteMutation = useMutation(
    async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Utilisateur supprimé');
        queryClient.invalidateQueries('admin-users');
        queryClient.invalidateQueries('admin-stats');
      },
      onError: () => toast.error('Erreur lors de la suppression'),
    }
  );

  const getRoleIcon = (role: string) => {
    if (role === 'ADMIN') return <Shield className="h-4 w-4 text-red-500" />;
    if (role === 'THERAPIST') return <Stethoscope className="h-4 w-4 text-green-500" />;
    return <User className="h-4 w-4 text-blue-500" />;
  };

  const getRoleColor = (role: string) => {
    if (role === 'ADMIN') return 'bg-red-100 text-red-600';
    if (role === 'THERAPIST') return 'bg-green-100 text-green-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Tous les Utilisateurs</h1>
            <p className="text-white/80 mt-1">{users?.length || 0} utilisateurs au total</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : (
            <div className="card-moroccan overflow-hidden">
              <table className="w-full">
                <thead className="bg-tadelakt-100">
                  <tr>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Nom</th>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Email</th>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Téléphone</th>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Rôle</th>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Inscrit le</th>
                    <th className="text-left p-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u: any) => (
                    <tr key={u.id} className="border-t border-tadelakt-100 hover:bg-tadelakt-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-sm">
                            {(u.patient?.firstName || u.therapist?.firstName || u.email)?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">
                            {u.patient ? `${u.patient.firstName} ${u.patient.lastName}` :
                             u.therapist ? `${u.therapist.firstName} ${u.therapist.lastName}` :
                             'Admin'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{u.email}</td>
                      <td className="p-4 text-sm text-gray-600">{u.phone || '-'}</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold w-fit ${getRoleColor(u.role)}`}>
                          {getRoleIcon(u.role)}
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => {
                              if (confirm('Supprimer cet utilisateur ?')) {
                                deleteMutation.mutate(u.id);
                              }
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
