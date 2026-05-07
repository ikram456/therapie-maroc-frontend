'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function Layout({ children, requireAuth = true, allowedRoles }: LayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tadelakt-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-majorelle-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tadelakt-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-majorelle-500 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tadelakt-50">
      <Navbar />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 ${isAuthenticated ? 'lg:ml-64' : ''} pb-20 lg:pb-0`}>
          {children}
        </main>
      </div>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
