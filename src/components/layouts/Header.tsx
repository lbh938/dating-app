'use client'
import { useAuth } from '@/components/AuthProvider'
import UserNav from '@/components/UserNav'
import siteConfig from '@/config/site'

export default function Header() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          {siteConfig.name}
        </h1>
        <UserNav />
      </div>
    </header>
  )
} 