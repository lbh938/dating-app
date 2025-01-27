'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaHeart, FaComments, FaUser } from 'react-icons/fa'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
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
          href="/likes" 
          className={`flex flex-col items-center py-3 text-sm ${
            pathname === '/likes' ? 'text-rose-500' : 'text-white/60 hover:text-white'
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
    </div>
  )
} 