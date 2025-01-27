'use client'
import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'
import { FaUser, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa'

export default function UserNav() {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = getSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="relative z-50">
      {/* Bouton avatar - visible sur mobile et desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500">
          {user?.user_metadata?.avatar_url && (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={32}
              height={32}
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu - adapté pour mobile et desktop */}
          <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 z-40">
            <div className="space-y-1">
              {/* Notifications */}
              <button
                onClick={() => router.push('/notifications')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <FaBell className="w-5 h-5" />
                <span>Notifications</span>
              </button>

              {/* Profil */}
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <FaUser className="w-5 h-5" />
                <span>Profil</span>
              </button>

              {/* Paramètres */}
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <FaCog className="w-5 h-5" />
                <span>Paramètres</span>
              </button>

              <div className="h-px bg-white/10 my-2" />

              {/* Déconnexion */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-rose-500/20 transition-colors text-rose-500"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 