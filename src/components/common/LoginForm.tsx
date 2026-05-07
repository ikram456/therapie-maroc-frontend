'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, handleApiError } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Star, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { tokens, user, patient, therapist } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      toast.success('Connexion réussie !');

      // Redirection selon le rôle
      if (user.role === 'PATIENT') {
        if (!patient?.questionnaireCompleted) {
          router.push('/patient/questionnaire');
        } else {
          router.push('/patient/dashboard');
        }
      } else if (user.role === 'THERAPIST') {
        router.push('/therapist/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tadelakt-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Star className="h-12 w-12 text-safran-500" />
          </div>
          <h1 className="text-3xl font-amiri font-bold text-majorelle-500 mb-2">
            Thérapie Maroc
          </h1>
          <p className="text-bronze-500 italic">Santé mentale, à la marocaine</p>
        </div>

        <div className="card-moroccan p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-moroccan"
                placeholder="votre@email.ma"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-moroccan pr-10"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-majorelle-500" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-safran-500 hover:underline">
                Mot de passe oublié?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte?{' '}
              <Link href="/register" className="text-safran-500 hover:underline font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-tadelakt-200">
            <p className="text-center text-sm text-gray-500 mb-4">Ou connectez-vous en tant que</p>
            <div className="flex gap-3">
              <Link href="/register" className="flex-1 py-2 text-center border-2 border-majorelle-500 text-majorelle-500 rounded-lg hover:bg-majorelle-50 transition-colors text-sm">
                Thérapeute
              </Link>
              <Link href="/login" className="flex-1 py-2 text-center border-2 border-safran-500 text-safran-500 rounded-lg hover:bg-safran-50 transition-colors text-sm">
                Patient
              </Link>
            </div>
          </div>
        </div>

        {/* Décoration */}
        <div className="mt-8 flex justify-center gap-2 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i % 3 === 0 ? 'bg-safran-500' : i % 3 === 1 ? 'bg-majorelle-500' : 'bg-tadelakt-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
