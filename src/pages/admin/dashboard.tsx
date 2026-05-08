import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { Users, UserCheck, Calendar, Activity, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery('admin-stats', async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  });

  if (isLoading) {
    return (
      <Layout requireAuth allowedRoles={['ADMIN']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
        </div>
      </Layout>
    );
  }

  const cards = [
    { label: 'Patients', value: stats?.totalPatients || 0, icon: Users, color: 'bg-blue-500', link: '/admin/patients' },
    { label: 'Thérapeutes', value: stats?.totalTherapists || 0, icon: UserCheck, color: 'bg-green-500', link: '/admin/therapists' },
    { label: 'Séances', value: stats?.totalSessions || 0, icon: Calendar, color: 'bg-purple-500', link: '/admin/sessions' },
    { label: 'Connexions', value: stats?.totalConnections || 0, icon: Activity, color: 'bg-orange-500', link: '/admin/dashboard' },
    { label: 'En attente vérif.', value: stats?.pendingTherapists || 0, icon: Clock, color: 'bg-yellow-500', link: '/admin/therapists' },
    { label: 'Thérapeutes vérifiés', value: stats?.verifiedTherapists || 0, icon: CheckCircle, color: 'bg-teal-500', link: '/admin/therapists' },
  ];

  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Administration</h1>
            <p className="text-white/80 mt-1">Tableau de bord général</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {cards.map((card) => (
              <Link key={card.label} href={card.link}>
                <div className="card-moroccan p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/patients">
              <div className="card-moroccan p-6 hover:shadow-xl transition-shadow cursor-pointer text-center">
                <Users className="h-10 w-10 text-majorelle-500 mx-auto mb-2" />
                <h3 className="font-bold">Gérer les Patients</h3>
                <p className="text-sm text-gray-500">Voir tous les patients</p>
              </div>
            </Link>
            <Link href="/admin/therapists">
              <div className="card-moroccan p-6 hover:shadow-xl transition-shadow cursor-pointer text-center">
                <UserCheck className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold">Gérer les Thérapeutes</h3>
                <p className="text-sm text-gray-500">Vérifier et gérer</p>
              </div>
            </Link>
            <Link href="/admin/users">
              <div className="card-moroccan p-6 hover:shadow-xl transition-shadow cursor-pointer text-center">
                <Activity className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                <h3 className="font-bold">Tous les Utilisateurs</h3>
                <p className="text-sm text-gray-500">Vue complète</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
