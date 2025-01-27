'use client'
import { useAuth } from '@/components/AuthProvider'
import UserNav from '@/components/UserNav'
import siteConfig from '@/config/site'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaHeart, FaComments, FaUser } from 'react-icons/fa'

const navigation = [
  { name: 'Accueil', href: '/', icon: FaHome },
  { name: 'Likes', href: '/likes', icon: FaHeart },
  { name: 'Messages', href: '/messages', icon: FaComments },
  { name: 'Profil', href: '/profile', icon: FaUser },
]

export default function PageWithNavigation({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {siteConfig.name}
          </h1>
          <UserNav />
        </div>
      </header>

      {/* Contenu principal avec padding pour header et navbar */}
      <main className="pt-16 pb-16">
        {children}
      </main>

      {/* Navigation fixe en bas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center py-3 text-sm ${
                    isActive
                      ? 'text-rose-500'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
} 