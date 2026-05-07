'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  MessageCircle,
  Calendar,
  User,
  Stethoscope,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

const patientNav = [
  { href: '/patient/dashboard', label: 'Accueil', icon: Home },
  { href: '/patient/messages', label: 'Messages', icon: MessageCircle },
  { href: '/patient/sessions', label: 'Séances', icon: Calendar },
  { href: '/patient/profile', label: 'Profil', icon: User },
];

const therapistNav = [
  { href: '/therapist/dashboard', label: 'Tableau', icon: BarChart3 },
  { href: '/therapist/patients', label: 'Patients', icon: Users },
  { href: '/therapist/sessions', label: 'Séances', icon: Calendar },
  { href: '/therapist/profile', label: 'Paramètres', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user?.role === 'PATIENT' ? patientNav : therapistNav;

  if (!user || user.role === 'ADMIN') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-tadelakt-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 ${
                isActive ? 'text-majorelle-500' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
