'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import SignOutButton from '@/components/SignOutButton'

export default function DashboardClient() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-300 to-purple-500 p-4">
      <div className="backdrop-blur-md bg-white/30 rounded-2xl p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Bienvenue {user.email}
        </h1>
        <SignOutButton />
      </div>
    </div>
  )
} 