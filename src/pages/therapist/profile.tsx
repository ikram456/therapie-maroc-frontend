import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function TherapistProfilePage() {
  const [saving, setSaving] = useState(false);

  const { data: me, isLoading } = useQuery('me', async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (me?.user?.therapist) {
      reset({
        firstName: me.user.therapist.firstName,
        lastName: me.user.therapist.lastName,
        biography: me.user.therapist.biography,
        sessionPrice: me.user.therapist.sessionPrice,
        yearsExperience: me.user.therapist.yearsExperience,
      });
    }
  }, [me, reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put('/auth/profile', data);
      toast.success('Profil mis à jour !');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout requireAuth allowedRoles={['THERAPIST']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
        </div>
      </Layout>
    );
  }

  const therapist = me?.user?.therapist;
  const user = me?.user;

  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{therapist?.title} {therapist?.firstName} {therapist?.lastName}</h1>
            <p className="text-white/80">{user?.email}</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="card-moroccan p-6">
            <h2 className="text-lg font-bold mb-4">Mon profil</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input {...register('firstName')} className="input-moroccan" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input {...register('lastName')} className="input-moroccan" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biographie</label>
                <textarea {...register('biography')} className="input-moroccan resize-none" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix séance (MAD)</label>
                  <input {...register('sessionPrice')} type="number" className="input-moroccan" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Années exp.</label>
                  <input {...register('yearsExperience')} type="number" className="input-moroccan" />
                </div>
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
