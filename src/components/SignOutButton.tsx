'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
    >
      Déconnexion
    </button>
  )
} 