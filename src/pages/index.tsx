import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, Shield, MessageCircle, Video, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-tadelakt-50">
      {/* Hero Section */}
      <section className="relative bg-majorelle-500 text-white py-20 px-4 overflow-hidden">
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute top-20 right-20 w-48 h-48 border-2 border-white rotate-45" />
          <div className="absolute bottom-10 left-1/4 w-24 h-24 border-2 border-white rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <Star className="h-20 w-20 text-safran-500 mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-amiri font-bold mb-4"
          >
            Nafs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-tadelakt-200 mb-8"
          >
            Nafs
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-tadelakt-100 max-w-2xl mx-auto mb-10"
          >
            Accédez à des professionnels de santé mentale qualifiés, 
            en français, arabe ou darija, depuis le confort de votre domicile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register" className="btn-secondary text-lg py-4 px-8">
              Commencer maintenant
              <ChevronRight className="inline h-5 w-5 ml-2" />
            </Link>
            <Link href="/login" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all text-lg">
              Se connecter
            </Link>
          </motion.div>
        </div>

        {/* Vague décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-amiri font-bold text-center text-majorelle-500 mb-12">
            Pourquoi choisir Nafs?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '100% Confidentiel',
                description: 'Vos conversations sont chiffrées et strictement confidentielles. Votre vie privée est notre priorité.',
                color: 'bg-majorelle-100 text-majorelle-500',
              },
              {
                icon: MessageCircle,
                title: 'Chat & Vidéo',
                description: 'Communiquez avec votre thérapeute par messagerie instantanée ou en visioconférence sécurisée.',
                color: 'bg-safran-100 text-safran-500',
              },
              {
                icon: Heart,
                title: 'Matching Intelligent',
                description: 'Notre algorithme vous met en relation avec le thérapeute le plus adapté à vos besoins.',
                color: 'bg-red-100 text-red-500',
              },
              {
                icon: Video,
                title: 'Séances en Ligne',
                description: 'Réservez et participez à vos séances de thérapie en visioconférence, où que vous soyez.',
                color: 'bg-blue-100 text-blue-500',
              },
              {
                icon: Star,
                title: 'Thérapeutes Vérifiés',
                description: 'Tous nos thérapeutes sont diplômés et leur identité est vérifiée par notre équipe.',
                color: 'bg-yellow-100 text-yellow-500',
              },
              {
                icon: ChevronRight,
                title: '3 Langues',
                description: 'Communiquez en français, arabe classique ou darija, selon votre préférence.',
                color: 'bg-green-100 text-green-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-moroccan p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-majorelle-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-amiri font-bold mb-4">
            Prêt à prendre soin de votre santé mentale?
          </h2>
          <p className="text-tadelakt-200 mb-8 text-lg">
            Rejoignez des milliers de Marocains qui ont déjà fait le premier pas.
          </p>
          <Link
            href="/register"
            className="inline-block bg-safran-500 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-safran-600 transition-all shadow-lg hover:shadow-xl"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-majorelle-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i % 2 === 0 ? 'bg-safran-500' : 'bg-tadelakt-500'
                }`}
              />
            ))}
          </div>
          <p className="text-tadelakt-200 text-sm">
            © 2026 Nafs. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
