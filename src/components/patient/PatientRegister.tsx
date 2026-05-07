'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, handleApiError } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Star, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  preferredLanguage: z.enum(['FR', 'AR', 'DAR']).default('FR'),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  city: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function PatientRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/patient', {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
      });

      const { tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      toast.success('Compte créé avec succès !');
      router.push('/patient/questionnaire');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tadelakt-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
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
          <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  {...register('firstName')}
                  className="input-moroccan"
                  placeholder="Ahmed"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  {...register('lastName')}
                  className="input-moroccan"
                  placeholder="Bennani"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-moroccan"
                placeholder="ahmed@exemple.ma"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="input-moroccan"
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  {...register('birthDate')}
                  type="date"
                  className="input-moroccan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select {...register('gender')} className="input-moroccan">
                  <option value="">Sélectionner</option>
                  <option value="MALE">Homme</option>
                  <option value="FEMALE">Femme</option>
                  <option value="OTHER">Autre</option>
                  <option value="PREFER_NOT_TO_SAY">Ne pas préciser</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                {...register('city')}
                className="input-moroccan"
                placeholder="Casablanca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue préférée
              </label>
              <div className="flex gap-2">
                {(['FR', 'AR', 'DAR'] as const).map((lang) => (
                  <label key={lang} className="flex-1">
                    <input
                      type="radio"
                      {...register('preferredLanguage')}
                      value={lang}
                      className="sr-only peer"
                    />
                    <div className="text-center py-2 rounded-lg border-2 border-tadelakt-300 cursor-pointer peer-checked:border-majorelle-500 peer-checked:bg-majorelle-50 peer-checked:text-majorelle-500 transition-all">
                      {lang === 'FR' && 'Français'}
                      {lang === 'AR' && 'العربية'}
                      {lang === 'DAR' && 'Darija'}
                    </div>
                  </label>
                ))}
              </div>
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
                  placeholder="8 caractères minimum"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                className="input-moroccan"
                placeholder="Répéter le mot de passe"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                  Création en cours...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Déjà un compte?{' '}
            <a href="/login" className="text-safran-500 hover:underline font-semibold">
              Se connecter
            </a>
          </p>
        </div>

        {/* Décoration zellige */}
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
