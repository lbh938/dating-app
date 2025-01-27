import Image from 'next/image'
import { FaMapMarkerAlt } from 'react-icons/fa'

type ProfileCardProps = {
  user: {
    username: string
    age: number
    location: string
    avatar_url: string
    bio?: string
  }
  actions?: React.ReactNode
}

export default function ProfileCard({ user, actions }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={user.avatar_url || '/default-avatar.jpg'}
          alt={user.username}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-black text-lg">
          {user.username}
        </h3>
        <p className="text-black text-sm flex items-center gap-1">
          <FaMapMarkerAlt className="w-3 h-3" />
          {user.location} • {user.age} ans
        </p>
        {user.bio && (
          <p className="text-black text-sm mt-1 line-clamp-1">
            {user.bio}
          </p>
        )}
      </div>

      {actions}
    </div>
  )
} 