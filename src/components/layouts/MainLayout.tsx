'use client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Header from './Header'
import Link from 'next/link'
import { FaHome, FaHeart, FaComments, FaUser } from 'react-icons/fa'

type MainLayoutProps = {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const publicRoutes = ['/login', '/register']

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push('/login')
    }
  }, [user, loading, requireAuth, router])

  if (loading) {
    return <LoadingScreen />
  }

  const isPublicRoute = publicRoutes.includes(pathname || '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {user && !isPublicRoute && <Header />}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Navigation Bar */}
      {user && !isPublicRoute && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-white/10">
          <div className="flex justify-around">
            <Link 
              href="/" 
              className={`flex flex-col items-center py-3 text-sm ${
                pathname === '/' ? 'text-rose-500' : 'text-white/60 hover:text-white'
              }`}
            >
              <FaHome className="w-6 h-6 mb-1" />
              <span className="text-xs">Accueil</span>
            </Link>

            <Link 
              href="/swipe" 
              className={`flex flex-col items-center py-3 text-sm ${
                pathname === '/swipe' ? 'text-rose-500' : 'text-white/60 hover:text-white'
              }`}
            >
              <FaHeart className="w-6 h-6 mb-1" />
              <span className="text-xs">Likes</span>
            </Link>

            <Link 
              href="/messages" 
              className={`flex flex-col items-center py-3 text-sm ${
                pathname.startsWith('/messages') ? 'text-rose-500' : 'text-white/60 hover:text-white'
              }`}
            >
              <FaComments className="w-6 h-6 mb-1" />
              <span className="text-xs">Messages</span>
            </Link>

            <Link 
              href="/profile" 
              className={`flex flex-col items-center py-3 text-sm ${
                pathname === '/profile' ? 'text-rose-500' : 'text-white/60 hover:text-white'
              }`}
            >
              <FaUser className="w-6 h-6 mb-1" />
              <span className="text-xs">Profil</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
} 