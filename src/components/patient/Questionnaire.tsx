'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, handleApiError } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Brain, Moon, Users, Target, AlertTriangle } from 'lucide-react';

const questionnaireSchema = z.object({
  anxietyScore: z.number().min(1).max(10),
  depressionScore: z.number().min(1).max(10),
  stressScore: z.number().min(1).max(10),
  sleepQuality: z.number().min(1).max(10),
  motivationScore: z.number().min(1).max(10),
  socialConnectionScore: z.number().min(1).max(10),
  consultationMotif: z.string().min(1, 'Veuillez décrire votre motif'),
  preferredTherapistGender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  preferredLanguage: z.enum(['FR', 'AR', 'DAR']),
  urgencyLevel: z.number().min(1).max(10),
  previousTherapy: z.boolean(),
  medicalHistory: z.string().optional(),
  medications: z.string().optional(),
  symptoms: z.array(z.string()),
  goals: z.string().optional(),
});

type QuestionnaireForm = z.infer<typeof questionnaireSchema>;

const steps = [
  { id: 'mood', title: 'Comment vous sentez-vous?', icon: Heart },
  { id: 'sleep', title: 'Qualité de vie', icon: Moon },
  { id: 'social', title: 'Connexions sociales', icon: Users },
  { id: 'motivation', title: 'Motivation & Objectifs', icon: Target },
  { id: 'details', title: 'Détails complémentaires', icon: AlertTriangle },
];

const moodOptions = [
  { value: 1, label: 'Très mal', color: 'bg-red-500' },
  { value: 3, label: 'Mal', color: 'bg-orange-500' },
  { value: 5, label: 'Moyen', color: 'bg-yellow-500' },
  { value: 7, label: 'Bien', color: 'bg-lime-500' },
  { value: 10, label: 'Excellent', color: 'bg-green-500' },
];

export function QuestionnaireForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionnaireForm>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      anxietyScore: 5,
      depressionScore: 5,
      stressScore: 5,
      sleepQuality: 5,
      motivationScore: 5,
      socialConnectionScore: 5,
      urgencyLevel: 5,
      previousTherapy: false,
      symptoms: [],
      preferredLanguage: 'FR',
    },
  });

  const scores = watch(['anxietyScore', 'depressionScore', 'stressScore', 'sleepQuality', 'motivationScore', 'socialConnectionScore']);

  const updateScore = (field: keyof QuestionnaireForm, value: number) => {
    setValue(field as any, value);
  };

  const onSubmit = async (data: QuestionnaireForm) => {
    setIsSubmitting(true);
    try {
      await api.post('/questionnaires', data);
      toast.success('Questionnaire complété !');
      router.push('/patient/dashboard');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScoreSelector = (field: keyof QuestionnaireForm, label: string) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        {moodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateScore(field, option.value)}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              watch(field as any) === option.value
                ? `${option.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-lg font-bold">{option.value}</div>
            <div className="text-xs">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {renderScoreSelector('anxietyScore', "Niveau d'anxiété (1-10)")}
            {renderScoreSelector('depressionScore', "Niveau de dépression (1-10)")}
            {renderScoreSelector('stressScore', "Niveau de stress (1-10)")}
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {renderScoreSelector('sleepQuality', "Qualité du sommeil (1-10)")}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptômes physiques
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Fatigue', 'Maux de tête', 'Tensions musculaires', 'Problèmes digestifs', 'Insomnie', "Perte d'appétit"].map((symptom) => (
                  <label key={symptom} className="flex items-center gap-2 p-3 rounded-lg border-2 border-tadelakt-300 cursor-pointer hover:border-majorelle-300 transition-colors">
                    <input
                      type="checkbox"
                      value={symptom}
                      {...register('symptoms')}
                      className="w-4 h-4 text-majorelle-500"
                    />
                    <span className="text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {renderScoreSelector('socialConnectionScore', 'Connexions sociales (1-10)')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre de thérapeute préféré
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'MALE', label: 'Homme' },
                  { value: 'FEMALE', label: 'Femme' },
                  { value: 'OTHER', label: 'Indifférent' },
                ].map((option) => (
                  <label key={option.value} className="flex-1">
                    <input
                      type="radio"
                      {...register('preferredTherapistGender')}
                      value={option.value}
                      className="sr-only peer"
                    />
                    <div className="text-center py-3 rounded-lg border-2 border-tadelakt-300 cursor-pointer peer-checked:border-majorelle-500 peer-checked:bg-majorelle-50 transition-all">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {renderScoreSelector('motivationScore', 'Motivation au changement (1-10)')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vos objectifs
              </label>
              <textarea
                {...register('goals')}
                rows={4}
                className="input-moroccan resize-none"
                placeholder="Décrivez ce que vous souhaitez accomplir avec la thérapie..."
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif principal de consultation
              </label>
              <textarea
                {...register('consultationMotif')}
                rows={4}
                className="input-moroccan resize-none"
                placeholder="Décrivez en quelques lignes ce qui vous amène aujourd'hui..."
              />
              {errors.consultationMotif && (
                <p className="text-red-500 text-xs mt-1">{errors.consultationMotif.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antécédents médicaux
              </label>
              <textarea
                {...register('medicalHistory')}
                rows={3}
                className="input-moroccan resize-none"
                placeholder="Avez-vous des antécédents médicaux pertinents?"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('previousTherapy')}
                className="w-5 h-5 text-majorelle-500"
              />
              <label className="text-sm text-gray-700">
                J'ai déjà fait une thérapie auparavant
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue préférée pour les séances
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'FR', label: 'Français' },
                  { value: 'AR', label: 'العربية' },
                  { value: 'DAR', label: 'Darija' },
                ].map((option) => (
                  <label key={option.value} className="flex-1">
                    <input
                      type="radio"
                      {...register('preferredLanguage')}
                      value={option.value}
                      className="sr-only peer"
                    />
                    <div className="text-center py-3 rounded-lg border-2 border-tadelakt-300 cursor-pointer peer-checked:border-majorelle-500 peer-checked:bg-majorelle-50 transition-all">
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-tadelakt-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-majorelle-500">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-tadelakt-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-majorelle-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-majorelle-100 mb-4">
            {React.createElement(steps[currentStep].icon, { className: 'h-8 w-8 text-majorelle-500' })}
          </div>
          <h1 className="text-2xl font-amiri font-bold text-majorelle-500">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 mt-2">
            Ces informations restent strictement confidentielles
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card-moroccan p-6"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-tadelakt-300 text-gray-600 hover:bg-tadelakt-100 disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
              Précédent
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-majorelle-500 text-white rounded-lg hover:bg-majorelle-600 transition-all"
              >
                Suivant
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-safran-500 text-white rounded-lg hover:bg-safran-600 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    Terminer
                    <Brain className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
