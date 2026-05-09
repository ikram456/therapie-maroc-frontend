'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Star, Menu, X, User, LogOut } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-majorelle-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Star className="h-8 w-8 text-safran-500" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-amiri font-bold">Nafs</h1>
              <p className="text-xs text-tadelakt-200">Nafs</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-tadelakt-200">
                  {user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-safran-500 hover:bg-safran-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-safran-500 transition-colors">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-safran-500 hover:bg-safran-600 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-majorelle-600 px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <User className="h-5 w-5" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 w-full py-2 text-safran-500"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                Connexion
              </Link>
              <Link href="/register" className="block py-2 text-safran-500" onClick={() => setIsMenuOpen(false)}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
