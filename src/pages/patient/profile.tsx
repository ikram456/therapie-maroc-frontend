import { Layout } from '@/components/common/Layout';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, handleApiError } from '@/utils/api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useEffect } from 'react';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery('me', async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (me?.user?.patient) {
      reset({
        firstName: me.user.patient.firstName,
        lastName: me.user.patient.lastName,
        phone: me.user.phone,
        city: me.user.patient.city,
      });
    }
  }, [me, reset]);

  const updateMutation = useMutation(
    async (data: any) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Profil mis à jour !');
        queryClient.invalidateQueries('me');
      },
      onError: (err) => toast.error(handleApiError(err)),
    }
  );

  if (isLoading) {
    return (
      <Layout requireAuth allowedRoles={['PATIENT']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
        </div>
      </Layout>
    );
  }

  const patient = me?.user?.patient;
  const user = me?.user;

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {patient?.firstName?.[0]}{patient?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-amiri font-bold">
                {patient?.firstName} {patient?.lastName}
              </h1>
              <p className="text-white/80 flex items-center gap-1 mt-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="card-moroccan p-6">
            <h2 className="text-lg font-bold mb-4">Informations personnelles</h2>
            <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input {...register('firstName')} className="input-moroccan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input {...register('lastName')} className="input-moroccan" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Téléphone
                </label>
                <input {...register('phone')} className="input-moroccan" placeholder="+212 6XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Ville
                </label>
                <input {...register('city')} className="input-moroccan" placeholder="Casablanca" />
              </div>
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {updateMutation.isLoading ? 'Mise à jour...' : 'Sauvegarder'}
              </button>
            </form>
          </div>

          <div className="card-moroccan p-6">
            <h2 className="text-lg font-bold mb-2">Compte</h2>
            <p className="text-gray-500 text-sm">Email : {user?.email}</p>
            <p className="text-gray-500 text-sm mt-1">Langue : {user?.preferredLanguage}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
