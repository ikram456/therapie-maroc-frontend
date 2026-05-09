import { useState } from 'react';
import { PatientRegister } from '@/components/patient/PatientRegister';
import { TherapistRegister } from '@/components/therapist/TherapistRegister';
import { Star } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState<'PATIENT' | 'THERAPIST' | null>(null);

  if (role === 'PATIENT') return <PatientRegister />;
  if (role === 'THERAPIST') return <TherapistRegister />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-tadelakt-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Star className="h-12 w-12 text-safran-500" />
          </div>
          <h1 className="text-3xl font-amiri font-bold text-majorelle-500 mb-2">
            Nafs
          </h1>
          <p className="text-bronze-500 italic">Santé mentale, à la marocaine</p>
        </div>

        <div className="card-moroccan p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Créer un compte</h2>
          <p className="text-center text-gray-500 mb-8">Vous êtes ?</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole('PATIENT')}
              className="p-6 border-2 border-tadelakt-300 rounded-xl hover:border-majorelle-500 hover:bg-majorelle-50 transition-all text-center group"
            >
              <div className="text-4xl mb-3">🙋</div>
              <h3 className="font-bold text-gray-800 group-hover:text-majorelle-500">Patient</h3>
              <p className="text-xs text-gray-500 mt-1">Je cherche un thérapeute</p>
            </button>

            <button
              onClick={() => setRole('THERAPIST')}
              className="p-6 border-2 border-tadelakt-300 rounded-xl hover:border-safran-500 hover:bg-safran-50 transition-all text-center group"
            >
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="font-bold text-gray-800 group-hover:text-safran-500">Thérapeute</h3>
              <p className="text-xs text-gray-500 mt-1">Je suis professionnel</p>
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600 text-sm">
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
