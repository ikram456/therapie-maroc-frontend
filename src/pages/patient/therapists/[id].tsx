import { useRouter } from 'next/router';
import { Layout } from '@/components/common/Layout';
import { useQuery } from 'react-query';
import { api, handleApiError } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Star, MapPin, Globe, DollarSign, MessageCircle, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TherapistDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [connecting, setConnecting] = useState(false);

  const { data: therapist, isLoading } = useQuery(
    ['therapist', id],
    async () => {
      if (!id) return null;
      const response = await api.get(`/therapists/${id}`);
      return response.data.data;
    },
    { enabled: !!id }
  );

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post('/connections', {
        therapistId: id,
        patientMessage: 'Je souhaite commencer une therapie avec vous.',
      });
      toast.success('Demande envoyee au therapeute!');
      router.push('/patient/messages');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setConnecting(false);
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

  if (!therapist) return null;

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/patient/therapists" className="flex items-center gap-2 text-tadelakt-200 hover:text-white mb-4 transition-colors">
              <ChevronLeft className="h-5 w-5" />
              Retour aux therapeutes
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-moroccan p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-4xl shrink-0 mx-auto md:mx-0">
                {therapist.user?.profilePicture ? (
                  <img src={therapist.user.profilePicture} alt={therapist.firstName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  therapist.firstName?.[0]
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                  {therapist.title} {therapist.firstName} {therapist.lastName}
                </h1>
                <p className="text-majorelle-500 font-medium text-lg">{therapist.specialty}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-1 bg-safran-50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-safran-500 fill-safran-500" />
                    <span className="font-bold text-safran-600">{(+therapist.rating).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({therapist.totalReviews} avis)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    {therapist.yearsExperience} ans experience
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Globe className="h-4 w-4" />
                    {therapist.languages?.join(', ')}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <DollarSign className="h-4 w-4" />
                    {+therapist.sessionPrice} DH/session
                  </div>
                </div>
                {therapist.isVerified && (
                  <div className="flex items-center gap-2 mt-4 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Therapeute verifie</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {therapist.biography && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card-moroccan p-6 mb-6">
              <h2 className="text-xl font-bold text-majorelle-500 mb-4">A propos</h2>
              <p className="text-gray-600 leading-relaxed">{therapist.biography}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card-moroccan p-6 bg-gradient-to-br from-majorelle-50 to-safran-50">
            <div className="text-center">
              <h3 className="text-xl font-bold text-majorelle-500 mb-2">Pret a commencer votre therapie?</h3>
              <p className="text-gray-600 mb-6">
                Envoyez une demande de connexion a {therapist.title} {therapist.firstName} {therapist.lastName}
              </p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="btn-primary text-lg px-8 py-4 disabled:opacity-50"
              >
                {connecting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Envoyer une demande
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}