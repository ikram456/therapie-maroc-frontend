'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Calendar,
  Star,
  ChevronRight,
  TrendingUp,
  Clock,
  Video,
} from 'lucide-react';

interface DashboardData {
  patient: {
    firstName: string;
    lastName: string;
    currentMoodScore: number | null;
    questionnaireCompleted: boolean;
  };
  connections: Array<{
    id: string;
    status: string;
    therapist: {
      firstName: string;
      lastName: string;
      title: string;
      user: { profilePicture: string | null };
    };
    sessions: Array<{ id: string; status: string; scheduledAt: string }>;
  }>;
  upcomingSessions: Array<{
    id: string;
    scheduledAt: string;
    therapist: {
      firstName: string;
      lastName: string;
      title: string;
    };
    status: string;
  }>;
  stats: {
    totalSessions: number;
    totalMessages: number;
    progressScore: number;
  };
}

export function PatientDashboard() {
  const { data, isLoading } = useQuery<DashboardData>(
    'patient-dashboard',
    async () => {
      const response = await api.get('/patients/dashboard');
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

  const patient = data?.patient;
  const connections = data?.connections || [];
  const upcomingSessions = data?.upcomingSessions || [];
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-tadelakt-50 pb-20">
      {/* Header avec arch */}
      <div className="bg-majorelle-500 text-white pb-12 pt-6 px-4 arch-header">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-amiri font-bold mb-2">
              Salam, {patient?.firstName}!
            </h1>
            <p className="text-tadelakt-200">
              Comment vous sentez-vous aujourd'hui?
            </p>
          </motion.div>

          {/* Mood tracker */}
          <div className="mt-6 flex justify-center gap-4">
            {[
              { emoji: '😊', label: 'Bien', value: 10 },
              { emoji: '😐', label: 'Moyen', value: 5 },
              { emoji: '😔', label: 'Triste', value: 3 },
              { emoji: '😰', label: 'Anxieux', value: 2 },
            ].map((mood) => (
              <motion.button
                key={mood.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Prochaine séance */}
        {upcomingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-moroccan p-4 mb-6 border-l-4 border-safran-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-safran-500 font-semibold">Prochaine séance</p>
                <p className="text-lg font-bold text-gray-800">
                  Dr. {upcomingSessions[0].therapist.firstName} {upcomingSessions[0].therapist.lastName}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(upcomingSessions[0].scheduledAt).toLocaleString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Link
                href={`/patient/sessions/${upcomingSessions[0].id}`}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-majorelle-500 text-white hover:bg-majorelle-600 transition-colors"
              >
                <Video className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Calendar, label: 'Séances', value: stats?.totalSessions || 0, color: 'text-majorelle-500' },
            { icon: MessageCircle, label: 'Messages', value: stats?.totalMessages || 0, color: 'text-safran-500' },
            { icon: TrendingUp, label: 'Progrès', value: `${stats?.progressScore || 0}%`, color: 'text-green-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card-moroccan p-4 text-center"
            >
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Thérapeutes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-majorelle-500">Mes thérapeutes</h2>
            <Link
              href="/patient/therapists"
              className="text-sm text-safran-500 hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {connections.length === 0 ? (
            <div className="card-moroccan p-8 text-center">
              <Heart className="h-12 w-12 text-tadelakt-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de thérapeute</p>
              <Link href="/patient/therapists" className="btn-primary inline-block">
                Trouver un thérapeute
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {connections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={`/patient/messages/${connection.id}`}>
                    <div className="card-moroccan p-4 flex items-center gap-4 hover:shadow-xl transition-shadow">
                      <div className="w-14 h-14 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-xl">
                        {connection.therapist.firstName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">
                          {connection.therapist.title} {connection.therapist.firstName} {connection.therapist.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            connection.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {connection.status === 'ACCEPTED' ? 'Actif' : 'En attente'}
                          </span>
                          {connection.sessions.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {connection.sessions.length} séance{connection.sessions.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recommandations */}
        <div className="card-moroccan p-6 bg-gradient-to-br from-majorelle-50 to-safran-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-majorelle-500 text-white flex items-center justify-center">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-majorelle-500 mb-1">
                Conseil du jour
              </h3>
              <p className="text-sm text-gray-600">
                Prenez 5 minutes aujourd'hui pour respirer profondément. 
                Inspirez par le nez pendant 4 secondes, retenez 4 secondes, 
                expirez par la bouche pendant 6 secondes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
