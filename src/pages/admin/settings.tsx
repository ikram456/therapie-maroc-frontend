import { Layout } from '@/components/common/Layout';
import { Shield, Key, Bell, Globe } from 'lucide-react';

export default function AdminSettings() {
  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-tadelakt-50 pb-20">
        <div className="bg-majorelle-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-amiri font-bold">Parametres</h1>
            <p className="text-white/80 mt-1">Configuration de l application</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <div className="card-moroccan p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-majorelle-500" />
              <h2 className="text-lg font-bold">Securite</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-tadelakt-100">
                <div>
                  <p className="font-medium">Authentification a deux facteurs</p>
                  <p className="text-sm text-gray-500">Protection supplementaire du compte admin</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">Non configure</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-tadelakt-100">
                <div>
                  <p className="font-medium">Cle secrete admin</p>
                  <p className="text-sm text-gray-500">Utilisee pour creer des comptes admin</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="card-moroccan p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-majorelle-500" />
              <h2 className="text-lg font-bold">Application</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-tadelakt-100">
                <div>
                  <p className="font-medium">Nom de l application</p>
                  <p className="text-sm text-gray-500">Therapie Maroc</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-tadelakt-100">
                <div>
                  <p className="font-medium">Langues supportees</p>
                  <p className="text-sm text-gray-500">Francais, Arabe, Darija</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-sm text-gray-500">1.0.0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-moroccan p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-majorelle-500" />
              <h2 className="text-lg font-bold">Informations techniques</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Frontend: Next.js 14 + Tailwind CSS</p>
              <p>Backend: Node.js + Express + Prisma</p>
              <p>Base de donnees: PostgreSQL</p>
              <p>Video: Jitsi Meet</p>
              <p>Deploiement: Vercel + Render</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
