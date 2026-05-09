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
  Shield,
  Heart,
} from 'lucide-react';

const patientNav = [
  { href: '/patient/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/patient/therapists', label: 'Therapeutes', icon: Stethoscope },
  { href: '/patient/messages', label: 'Messages', icon: MessageCircle },
  { href: '/patient/sessions', label: 'Seances', icon: Calendar },
  { href: '/patient/mood', label: 'Humeur', icon: Heart },
  { href: '/patient/profile', label: 'Profil', icon: User },
];

const therapistNav = [
  { href: '/therapist/dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { href: '/therapist/patients', label: 'Patients', icon: Users },
  { href: '/therapist/messages', label: 'Messages', icon: MessageCircle },
  { href: '/therapist/sessions', label: 'Seances', icon: Calendar },
  { href: '/therapist/profile', label: 'Profil', icon: Settings },
];

const adminNav = [
  { href: '/admin/dashboard', label: 'Statistiques', icon: BarChart3 },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/therapists', label: 'Therapeutes', icon: Stethoscope },
  { href: '/admin/sessions', label: 'Seances', icon: Calendar },
  { href: '/admin/settings', label: 'Parametres', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = React.useMemo(() => {
    switch (user?.role) {
      case 'PATIENT': return patientNav;
      case 'THERAPIST': return therapistNav;
      case 'ADMIN': return adminNav;
      default: return [];
    }
  }, [user?.role]);

  if (!user) return null;

  return (
    <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-tadelakt-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6 p-4 bg-majorelle-50 rounded-moroccan">
          <p className="text-sm text-majorelle-600 font-semibold">
            {user.role === 'PATIENT' && 'Espace Patient'}
            {user.role === 'THERAPIST' && 'Espace Therapeute'}
            {user.role === 'ADMIN' && 'Administration'}
          </p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-20">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i % 2 === 0 ? 'bg-safran-500' : 'bg-majorelle-500'}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}