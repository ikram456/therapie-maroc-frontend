import { Layout } from '@/components/common/Layout';
import { useQuery, useQueryClient } from 'react-query';
import { api, handleApiError } from '@/utils/api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

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

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put('/auth/profile', data);
      toast.success('Profil mis a jour !');
      queryClient.invalidateQueries('me');
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

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
              <h1 className="text-2xl font-bold">{patient?.firstName} {patient?.lastName}</h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="card-moroccan p-6">
            <h2 className="text-lg font-bold mb-4">Informations personnelles</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prenom</label>
                  <input {...register('firstName')} className="input-moroccan" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input {...register('lastName')} className="input-moroccan" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telephone</label>
                <input {...register('phone')} className="input-moroccan" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input {...register('city')} className="input-moroccan" />
              </div>
              <button type="submit" disabled={saving} className="w-full btn-primary py-3 disabled:opacity-50">
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
