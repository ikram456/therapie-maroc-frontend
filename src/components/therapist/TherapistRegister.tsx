'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api, handleApiError } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Star, Eye, EyeOff } from 'lucide-react';

export function TherapistRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/therapist', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title || 'Dr',
        specialty: data.specialty,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        yearsExperience: parseInt(data.yearsExperience) || 0,
        sessionPrice: parseInt(data.sessionPrice) || 300,
      });

      const { tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      toast.success('Compte créé ! En attente de vérification.');
      router.push('/therapist/dashboard');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tadelakt-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Star className="h-12 w-12 text-safran-500" />
          </div>
          <h1 className="text-3xl font-amiri font-bold text-majorelle-500 mb-2">Thérapie Maroc</h1>
          <p className="text-bronze-500 italic">Inscription Thérapeute</p>
        </div>

        <div className="card-moroccan p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Créer un compte thérapeute</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input {...register('firstName', { required: true })} className="input-moroccan" placeholder="Mohammed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input {...register('lastName', { required: true })} className="input-moroccan" placeholder="Bennani" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <select {...register('title')} className="input-moroccan">
                <option value="Dr">Dr</option>
                <option value="Pr">Pr</option>
                <option value="M">M.</option>
                <option value="Mme">Mme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email', { required: true })} type="email" className="input-moroccan" placeholder="docteur@exemple.ma" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input {...register('phone')} type="tel" className="input-moroccan" placeholder="+212 6XX XXX XXX" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
              <select {...register('specialty', { required: true })} className="input-moroccan">
                <option value="">Sélectionner</option>
                <option value="Psychologie clinique">Psychologie clinique</option>
                <option value="Psychiatrie">Psychiatrie</option>
                <option value="Psychothérapie">Psychothérapie</option>
                <option value="Thérapie cognitivo-comportementale">TCC</option>
                <option value="Psychanalyse">Psychanalyse</option>
                <option value="Coaching">Coaching</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de licence</label>
              <input {...register('licenseNumber', { required: true })} className="input-moroccan" placeholder="PSY-XXXX" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
                <input {...register('yearsExperience')} type="number" className="input-moroccan" placeholder="5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix séance (MAD)</label>
                <input {...register('sessionPrice')} type="number" className="input-moroccan" placeholder="300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-moroccan pr-10"
                  placeholder="8 caractères minimum"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                {...register('confirmPassword', { required: true })}
                type={showPassword ? 'text' : 'password'}
                className="input-moroccan"
                placeholder="Répéter le mot de passe"
              />
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
            Déjà un compte ?{' '}
            <a href="/login" className="text-safran-500 hover:underline font-semibold">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
