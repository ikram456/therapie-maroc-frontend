'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Users, Calendar, Star, Clock, ChevronRight,
  CheckCircle, XCircle, DollarSign, BarChart3,
} from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  totalSessions: number;
  totalRevenue: number;
  averageRating: number;
  recentSessions: Array<{ status: string; price: number; createdAt: string }>;
}

interface ConnectionRequest {
  id: string;
  status: string;
  patientMessage?: string;
  createdAt: string;
  patient: {
    firstName: string;
    lastName: string;
    gender?: string;
    city?: string;
    user: { profilePicture: string | null };
  };
}

export function TherapistDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>(
    'therapist-stats',
    async () => {
      const response = await api.get('/therapists/dashboard/stats');
      return response.data.data;
    }
  );

  const { data: requests, isLoading: requestsLoading } = useQuery<ConnectionRequest[]>(
    'therapist-requests',
    async () => {
      const response = await api.get('/connections?status=PENDING');
      return response.data.data;
    }
  );

  const { data: upcomingSessions } = useQuery(
    'therapist-upcoming',
    async () => {
      const response = await api.get('/sessions?status=SCHEDULED');
      return response.data.data;
    }
  );

  const handleRespond = async (id: string, status: string) => {
    try {
      await api.put(`/connections/${id}/respond`, { status });
      toast.success(status === 'ACCEPTED' ? 'Demande acceptee !' : 'Demande rejetee');
      window.location.reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erreur');
    }
  };

  if (statsLoading || requestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tadelakt-50 pb-20">
      <div className="bg-majorelle-500 text-white py-8 px-4 arch-header">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-amiri font-bold mb-2">Tableau de bord</h1>
            <p className="text-tadelakt-200">Vue d ensemble de votre activite</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Patients', value: stats?.totalPatients || 0, color: 'bg-blue-500' },
            { icon: Calendar, label: 'Seances', value: stats?.totalSessions || 0, color: 'bg-safran-500' },
            { icon: DollarSign, label: 'Revenus', value: `${stats?.totalRevenue || 0} DH`, color: 'bg-green-500' },
            { icon: Star, label: 'Note', value: (+( stats?.averageRating || 0)).toFixed(1), color: 'bg-yellow-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-moroccan p-4"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} text-white flex items-center justify-center mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-majorelle-500">
              Demandes en attente ({requests?.length || 0})
            </h2>
            <Link href="/therapist/patients" className="text-sm text-safran-500 hover:underline flex items-center gap-1">
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-moroccan p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-lg shrink-0">
                      {request.patient.firstName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">
                        {request.patient.firstName} {request.patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.patient.city} • {request.patient.gender === 'MALE' ? 'Homme' : 'Femme'}
                      </p>
                      {request.patientMessage && (
                        <p className="text-sm text-gray-600 mt-2 bg-tadelakt-50 p-2 rounded-lg">
                          "{request.patientMessage}"
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(request.id, 'ACCEPTED')}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRespond(request.id, 'REJECTED')}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-moroccan p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Aucune demande en attente</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-majorelle-500 mb-4">Aujourd hui</h2>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session: any) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card-moroccan p-4 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-lg bg-majorelle-100 flex flex-col items-center justify-center text-majorelle-500">
                    <span className="text-lg font-bold">{new Date(session.scheduledAt).getDate()}</span>
                    <span className="text-xs">{new Date(session.scheduledAt).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{session.patient?.firstName} {session.patient?.lastName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      {' '}• {session.durationMinutes} min
                    </p>
                  </div>
                  <Link href={`/patient/sessions/${session.id}/video`} className="px-4 py-2 bg-majorelle-500 text-white rounded-lg hover:bg-majorelle-600 transition-colors">
                    Rejoindre
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-moroccan p-8 text-center">
              <Calendar className="h-12 w-12 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune seance aujourd hui</p>
            </div>
          )}
        </div>

        <div className="card-moroccan p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-majorelle-500">Activite recente</h3>
            <BarChart3 className="h-5 w-5 text-safran-500" />
          </div>
          <div className="h-32 flex items-end gap-2">
            {stats?.recentSessions?.slice(0, 14).map((session, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(session.price / 500) * 100}%` }}
                transition={{ delay: index * 0.05 }}
                className={`flex-1 rounded-t-lg ${session.status === 'COMPLETED' ? 'bg-majorelle-500' : 'bg-tadelakt-300'}`}
              />
            )) || (
              <div className="w-full text-center text-gray-400 py-8">Pas encore de donnees</div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Il y a 7 jours</span>
            <span>Aujourd hui</span>
          </div>
        </div>
      </div>
    </div>
  );
}