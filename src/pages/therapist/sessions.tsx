import { Layout } from '@/components/common/Layout';
import { useQuery, useQueryClient } from 'react-query';
import { api } from '@/utils/api';
import { Calendar, Video, Plus, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function TherapistSessionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ patientConnectionId: '', scheduledAt: '', duration: '60', notes: '' });

  const { data: sessions, isLoading } = useQuery('therapist-sessions', async () => {
    const response = await api.get('/sessions');
    return response.data.data;
  });

  const { data: connections } = useQuery('therapist-connections', async () => {
    const response = await api.get('/connections');
    return response.data.data?.filter((c: any) => c.status === 'ACCEPTED');
  });

  const handleCreate = async () => {
    if (!form.patientConnectionId || !form.scheduledAt) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setCreating(true);
    try {
      await api.post('/sessions', {
        connectionId: form.patientConnectionId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: parseInt(form.duration),
        notes: form.notes,
      });
      toast.success('Seance creee !');
      setShowForm(false);
      setForm({ patientConnectionId: '', scheduledAt: '', duration: '60', notes: '' });
      queryClient.invalidateQueries('therapist-sessions');
    } catch {
      toast.error('Erreur lors de la creation');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-600';
    if (status === 'CANCELLED') return 'bg-red-100 text-red-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-amiri font-bold">Mes Seances</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-white text-majorelle-500 px-4 py-2 rounded-xl font-bold hover:bg-tadelakt-50"
            >
              <Plus className="h-5 w-5" />
              Creer une seance
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {showForm && (
            <div className="card-moroccan p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Nouvelle seance video</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    value={form.patientConnectionId}
                    onChange={(e) => setForm({ ...form, patientConnectionId: e.target.value })}
                    className="input-moroccan"
                  >
                    <option value="">Selectionner un patient</option>
                    {connections?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.patient?.firstName} {c.patient?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                    className="input-moroccan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duree (minutes)</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="input-moroccan"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-moroccan resize-none"
                    rows={2}
                    placeholder="Notes sur la seance..."
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreate} disabled={creating} className="flex-1 btn-primary py-3 disabled:opacity-50">
                    {creating ? 'Creation...' : 'Creer la seance'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 border-2 border-tadelakt-300 rounded-xl text-gray-600">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
            </div>
          ) : !sessions?.length ? (
            <div className="card-moroccan p-12 text-center">
              <Calendar className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune seance pour le moment</p>
              <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2">
                Creer votre premiere seance
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((s: any) => (
                <div key={s.id} className="card-moroccan p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold">
                        {s.patient?.firstName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{s.patient?.firstName} {s.patient?.lastName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(s.scheduledAt).toLocaleString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-400">{s.durationMinutes || 60} minutes</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(s.status)}`}>
                        {s.status}
                      </span>
                      <button
                        onClick={() => router.push(`/patient/sessions/${s.id}/video`)}
                        className="flex items-center gap-2 bg-majorelle-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-majorelle-600"
                      >
                        <Video className="h-4 w-4" />
                        Rejoindre
                      </button>
                    </div>
                  </div>
                  {s.notes && <p className="text-sm text-gray-500 mt-3 border-t border-tadelakt-100 pt-3">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
