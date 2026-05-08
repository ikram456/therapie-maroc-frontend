'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Globe,
  DollarSign,
  ChevronRight,
  Heart,
} from 'lucide-react';

interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  yearsExperience: number;
  languages: string[];
  sessionPrice: number;
  rating: number;
  totalReviews: number;
  user: {
    profilePicture: string | null;
  };
  specialties: Array<{ specialtyName: string }>;
}

export function TherapistList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data, isLoading } = useQuery(
    ['therapists', selectedSpecialty, selectedLanguage, priceRange],
    async () => {
      const response = await api.get('/therapists', {
        params: {
          specialty: selectedSpecialty || undefined,
          language: selectedLanguage || undefined,
          minPrice: priceRange[0] || undefined,
          maxPrice: priceRange[1] || undefined,
        },
      });
      return response.data.data;
    }
  );

  const therapists: Therapist[] = data || [];

  const specialties = [
    'Tous',
    'Psychologie clinique',
    'Psychiatrie',
    'Therapie cognitivo-comportementale',
    'Psychanalyse',
    'Therapie familiale',
    'Therapie de couple',
    'Addictologie',
    'Sexologie',
  ];

  const languages = [
    { value: '', label: 'Toutes' },
    { value: 'FR', label: 'Francais' },
    { value: 'AR', label: 'Arabe' },
    { value: 'DAR', label: 'Darija' },
  ];

  const filteredTherapists = therapists.filter((t) =>
    searchQuery === '' ||
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-tadelakt-50 pb-20">
      <div className="bg-majorelle-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-amiri font-bold mb-4">Nos therapeutes</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou specialite..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-safran-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-majorelle-500 shrink-0" />
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty === 'Tous' ? '' : specialty)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  (specialty === 'Tous' && !selectedSpecialty) || selectedSpecialty === specialty
                    ? 'bg-majorelle-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-majorelle-50'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-moroccan w-auto"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-t-4 border-majorelle-500 rounded-full" />
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-tadelakt-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun therapeute trouve</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTherapists.map((therapist, index) => (
              <motion.div
                key={therapist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/patient/therapists/${therapist.id}`}>
                  <div className="card-moroccan p-6 hover:shadow-xl transition-all">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-majorelle-100 flex items-center justify-center text-majorelle-500 font-bold text-2xl shrink-0">
                        {therapist.user.profilePicture ? (
                          <img
                            src={therapist.user.profilePicture}
                            alt={therapist.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          therapist.firstName[0]
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-gray-800">
                              {therapist.title} {therapist.firstName} {therapist.lastName}
                            </h2>
                            <p className="text-majorelle-500 font-medium">{therapist.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-safran-50 px-2 py-1 rounded-lg">
                            <Star className="h-4 w-4 text-safran-500 fill-safran-500" />
                            <span className="text-sm font-bold text-safran-600">
                              {(+therapist.rating).toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">({therapist.totalReviews})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {therapist.yearsExperience} ans experience
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {therapist.languages.join(', ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {+therapist.sessionPrice} DH/session
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {therapist.specialties?.slice(0, 3).map((s) => (
                            <span
                              key={s.specialtyName}
                              className="px-3 py-1 bg-tadelakt-100 text-tadelakt-700 rounded-full text-xs"
                            >
                              {s.specialtyName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-gray-400 self-center" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}