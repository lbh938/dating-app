'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaHome, FaHeart, FaVideo, FaComments, FaUser } from 'react-icons/fa'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: FaHome,
      active: pathname === '/'
    },
    {
      label: 'Swipe',
      href: '/swipe',
      icon: FaHeart,
      active: pathname === '/swipe'
    },
    {
      label: 'Live',
      href: '/stream',
      icon: FaVideo,
      active: pathname.startsWith('/stream')
    },
    {
      label: 'Chat',
      href: '/chat',
      icon: FaComments,
      active: pathname.startsWith('/chat')
    },
    {
      label: 'Profil',
      href: '/profile',
      icon: FaUser,
      active: pathname === '/profile'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10 z-50">
      <div className="container mx-auto px-4 safe-area-bottom">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-3 px-5 transition-colors ${
                  item.active
                    ? 'text-rose-500'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}