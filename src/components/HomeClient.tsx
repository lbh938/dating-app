'use client'
import { useAuth } from './AuthProvider'
import LoginForm from './LoginForm'
import UserNav from './UserNav'
import Banner from './Banner'
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({ subsets: ['latin'] })

export default function HomeClient() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-300 to-purple-500">
      {/* Header/Navigation */}
      <header className="backdrop-blur-md bg-white/30 p-4 flex justify-between items-center border-b border-white/30">
        <div className={`text-3xl font-bold text-white ${dancingScript.className}`}>TSLover</div>
        <div className="space-x-4">
          {!loading && (user ? <UserNav /> : (
            <button 
              className="px-4 py-2 backdrop-blur-sm bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
            >
              Connexion / Inscription
            </button>
          ))}
        </div>
      </header>

      {/* Auth Modal */}
      {!user && !loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Connexion / Inscription
            </h2>
            <LoginForm />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto">
        <Banner />
      </main>
    </div>
  )
} 