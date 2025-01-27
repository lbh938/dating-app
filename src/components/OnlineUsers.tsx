'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaCircle } from 'react-icons/fa'

type OnlineUser = {
  id: string
  name: string
  avatar: string
  lastActive: string
}

export default function OnlineUsers() {
  // Exemple de données (à remplacer par des données réelles de Supabase)
  const onlineUsers: OnlineUser[] = [
    {
      id: '1',
      name: 'Sarah',
      avatar: '/avatars/avatar1.jpg',
      lastActive: 'À l\'instant'
    },
    // Ajoutez plus d'utilisateurs...
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {onlineUsers.map((user) => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="flex-none group"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500 ring-2 ring-white/10">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-black/20 backdrop-blur-sm p-0.5">
                <FaCircle className="w-full h-full text-emerald-500" />
              </div>
            </div>
            <p className="mt-1 text-sm text-center text-white/80 font-medium truncate max-w-[64px]">
              {user.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 