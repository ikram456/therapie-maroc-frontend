import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Smile, Frown, Meh, Plus, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MoodEntry {
  id: string;
  date: string;
  score: number;
  note: string;
  emotions: string[];
}

const EMOTIONS = [
  { label: 'Heureux', emoji: '😊' },
  { label: 'Anxieux', emoji: '😰' },
  { label: 'Triste', emoji: '😢' },
  { label: 'En colere', emoji: '😠' },
  { label: 'Fatigue', emoji: '😴' },
  { label: 'Calme', emoji: '😌' },
  { label: 'Stresse', emoji: '😤' },
  { label: 'Motive', emoji: '💪' },
];

const getMoodColor = (score: number) => {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#84cc16';
  if (score >= 4) return '#eab308';
  if (score >= 2) return '#f97316';
  return '#ef4444';
};

const getMoodLabel = (score: number) => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Bien';
  if (score >= 4) return 'Moyen';
  if (score >= 2) return 'Difficile';
  return 'Tres difficile';
};

export default function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [view, setView] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const saved = localStorage.getItem('mood_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score,
      note,
      emotions: selectedEmotions,
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('mood_entries', JSON.stringify(updated));
    setShowForm(false);
    setNote('');
    setSelectedEmotions([]);
    setScore(5);
    toast.success('Humeur enregistree !');
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const getChartData = () => {
    const days = view === 'week' ? 7 : 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate.toDateString() === date.toDateString();
      });
      const avgScore = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.score, 0) / dayEntries.length
        : null;
      data.push({ date: dateStr, score: avgScore, entries: dayEntries.length });
    }
    return data;
  };

  const avgScore = entries.length > 0
    ? (entries.slice(0, 7).reduce((sum, e) => sum + e.score, 0) / Math.min(entries.length, 7)).toFixed(1)
    : null;

  const todayEntry = entries.find(e => {
    const entryDate = new Date(e.date);
    return entryDate.toDateString() === new Date().toDateString();
  });

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-amiri font-bold">Suivi d humeur</h1>
              <p className="text-white/80 mt-1">Suivez votre bien-etre au quotidien</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-white text-majorelle-500 px-4 py-2 rounded-xl font-bold hover:bg-tadelakt-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-moroccan p-4 text-center">
              <p className="text-3xl font-bold text-majorelle-500">{entries.length}</p>
              <p className="text-sm text-gray-500 mt-1">Entrees totales</p>
            </div>
            <div className="card-moroccan p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: avgScore ? getMoodColor(+avgScore) : '#9ca3af' }}>
                {avgScore || '-'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Moyenne 7j</p>
            </div>
            <div className="card-moroccan p-4 text-center">
              <p className="text-3xl font-bold text-safran-500">
                {todayEntry ? todayEntry.score : '-'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Aujourd hui</p>
            </div>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="card-moroccan p-6">
              <h2 className="text-lg font-bold mb-4">Comment vous sentez-vous aujourd hui ?</h2>

              {/* Score slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Score: {score}/10</span>
                  <span className="font-bold text-lg" style={{ color: getMoodColor(score) }}>
                    {getMoodLabel(score)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(+e.target.value)}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${getMoodColor(score)} ${score * 10}%, #e5e7eb ${score * 10}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Tres difficile</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Emotions */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Emotions ressenties :</p>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((e) => (
                    <button
                      key={e.label}
                      onClick={() => toggleEmotion(e.label)}
                      className={`px-3 py-2 rounded-full text-sm flex items-center gap-1 transition-all ${
                        selectedEmotions.includes(e.label)
                          ? 'bg-majorelle-500 text-white'
                          : 'bg-tadelakt-100 text-gray-600 hover:bg-tadelakt-200'
                      }`}
                    >
                      {e.emoji} {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optionnel)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input-moroccan resize-none"
                  rows={3}
                  placeholder="Comment s est passee votre journee ?"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={saveEntry} className="flex-1 btn-primary py-3">
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-tadelakt-300 rounded-xl text-gray-600 hover:bg-tadelakt-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Graphique */}
          {entries.length > 0 && (
            <div className="card-moroccan p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-majorelle-500" />
                  Evolution de l humeur
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('week')}
                    className={`px-3 py-1 rounded-full text-sm ${view === 'week' ? 'bg-majorelle-500 text-white' : 'bg-tadelakt-100 text-gray-600'}`}
                  >
                    7 jours
                  </button>
                  <button
                    onClick={() => setView('month')}
                    className={`px-3 py-1 rounded-full text-sm ${view === 'month' ? 'bg-majorelle-500 text-white' : 'bg-tadelakt-100 text-gray-600'}`}
                  >
                    30 jours
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => [value ? `${(+value).toFixed(1)}/10` : 'Pas de donnee', 'Humeur']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorScore)"
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Historique */}
          <div className="card-moroccan p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-majorelle-500" />
              Historique
            </h2>
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <Meh className="h-12 w-12 text-tadelakt-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune entree pour le moment</p>
                <button onClick={() => setShowForm(true)} className="btn-primary mt-4 px-6 py-2">
                  Commencer le suivi
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 bg-tadelakt-50 rounded-xl">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: getMoodColor(entry.score) }}
                    >
                      {entry.score}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: getMoodColor(entry.score) }}>
                          {getMoodLabel(entry.score)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.emotions.map(e => (
                            <span key={e} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                              {EMOTIONS.find(em => em.label === e)?.emoji} {e}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
