'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Shield,
  BarChart3,
} from 'lucide-react';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalPatients: number;
    totalTherapists: number;
    verifiedTherapists: number;
    pendingTherapists: number;
    totalSessions: number;
    completedSessions: number;
    totalRevenue: number;
  };
  recentActivity: {
    users: Array<{
      id: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    sessions: Array<any>;
  };
}

interface PendingTherapist {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  licenseNumber: string;
  university?: string;
  yearsExperience: number;
  verificationStatus: string;
  user: {
    email: string;
    phone?: string;
    createdAt: string;
  };
  specialties: Array<{ specialtyName: string }>;
}

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>(
    'admin-stats',
    async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    }
  );

  const { data: pendingTherapists } = useQuery<PendingTherapist[]>(
    'pending-therapists',
    async () => {
      const response = await api.get('/admin/therapists/pending');
      return response.data.data;
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
      </div>
    );
  }

  const overview = stats?.overview;

  return (
    <div className="min-h-screen bg-tadelakt-50 pb-20">
      {/* Header */}
      <div className="bg-majorelle-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Shield className="h-8 w-8 text-safran-500" />
            <div>
              <h1 className="text-3xl font-amiri font-bold">Panneau Administrateur</h1>
              <p className="text-tadelakt-200">Vue d'ensemble de la plateforme</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Utilisateurs', value: overview?.totalUsers || 0, color: 'bg-blue-500', trend: '+12%' },
            { icon: Stethoscope, label: 'Thérapeutes', value: overview?.totalTherapists || 0, color: 'bg-safran-500', trend: '+5%' },
            { icon: Calendar, label: 'Séances/mois', value: overview?.totalSessions || 0, color: 'bg-green-500', trend: '+23%' },
            { icon: DollarSign, label: 'Revenus', value: `${overview?.totalRevenue || 0} DH`, color: 'bg-yellow-500', trend: '+18%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-moroccan p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} text-white flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Thérapeutes en attente */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-majorelle-500">
                Thérapeutes en attente ({pendingTherapists?.length || 0})
              </h2>
              <Link href="/admin/therapists" className="text-sm text-safran-500 hover:underline flex items-center gap-1">
                Voir tout <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {pendingTherapists && pendingTherapists.length > 0 ? (
              <div className="space-y-3">
                {pendingTherapists.slice(0, 5).map((therapist, index) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-moroccan p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-lg shrink-0">
                        {therapist.firstName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">
                          {therapist.title} {therapist.firstName} {therapist.lastName}
                        </h3>
                        <p className="text-sm text-majorelle-500">{therapist.specialty}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-tadelakt-100 text-tadelakt-700 px-2 py-1 rounded-full">
                            {therapist.yearsExperience} ans exp.
                          </span>
                          <span className="text-xs bg-tadelakt-100 text-tadelakt-700 px-2 py-1 rounded-full">
                            {therapist.university}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Inscrit le {new Date(therapist.user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={async () => {
                            await api.put(`/admin/therapists/${therapist.id}/verify`, { verified: true });
                            window.location.reload();
                          }}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          title="Vérifier"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/admin/therapists/${therapist.id}`}
                          className="p-2 bg-majorelle-500 text-white rounded-lg hover:bg-majorelle-600 transition-colors"
                          title="Voir détails"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card-moroccan p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Aucun thérapeute en attente</p>
              </div>
            )}
          </div>

          {/* Alertes récentes */}
          <div>
            <h2 className="text-xl font-bold text-majorelle-500 mb-4">
              Alertes récentes
            </h2>
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-moroccan p-4 border-l-4 border-red-500 bg-red-50"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-700 text-sm">Signalement: Patient Ahmed B.</h3>
                    <p className="text-xs text-red-600 mt-1">
                      Problème de connexion lors de la séance #45
                    </p>
                    <p className="text-xs text-red-400 mt-2">Il y a 2 heures</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="card-moroccan p-4 border-l-4 border-green-500 bg-green-50"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-700 text-sm">Paiement confirmé: 12,500 DH</h3>
                    <p className="text-xs text-green-600 mt-1">
                      Batch de paiements thérapeutes - Mai 2026
                    </p>
                    <p className="text-xs text-green-400 mt-2">Il y a 5 heures</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card-moroccan p-4 border-l-4 border-yellow-500 bg-yellow-50"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-yellow-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-yellow-700 text-sm">Nouveau record: 45 séances/jour</h3>
                    <p className="text-xs text-yellow-600 mt-1">
                      Pic d'activité détecté hier
                    </p>
                    <p className="text-xs text-yellow-400 mt-2">Hier</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activité récente */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-3">Nouveaux utilisateurs</h3>
              <div className="space-y-2">
                {stats?.recentActivity?.users?.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-tadelakt-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 text-xs font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
