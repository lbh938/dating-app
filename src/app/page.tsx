'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import MainLayout from '@/components/layouts/MainLayout'
import Image from 'next/image'
import { FaCircle } from 'react-icons/fa'
import HeroCarousel from '@/components/HeroCarousel'

type Profile = {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  online_status: boolean
  last_active: string
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [onlineProfiles, setOnlineProfiles] = useState<Profile[]>([])
  const supabase = createClientComponentClient()
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchOnlineProfiles()
    const channel = supabase
      .channel('online-users')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'online_status=eq.true'
      }, () => {
        fetchOnlineProfiles()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOnlineProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, bio, online_status, last_active')
        .eq('online_status', true)
        .neq('id', user?.id)
        .order('last_active', { ascending: false })
        .limit(8)

      if (error) throw error
      setOnlineProfiles(data || [])
    } catch (error) {
      console.error('Error fetching online profiles:', error)
    }
  }

  const handleProfileClick = (profileId: string) => {
    router.push(`/profile/${profileId}`)
  }

  const handleImageError = (profileId: string) => {
    setImageError(prev => ({
      ...prev,
      [profileId]: true
    }))
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-20">
        <HeroCarousel />

        {/* Online Profiles Section */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCircle className="w-3 h-3 text-green-500" />
            <span>En ligne maintenant</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onlineProfiles.map((profile) => (
              <div
                key={profile.id}
                className="relative group cursor-pointer"
                onClick={() => handleProfileClick(profile.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={imageError[profile.id] ? '/images/default-avatar.jpg' : (profile.avatar_url || '/images/default-avatar.jpg')}
                    alt={profile.username}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    onError={() => handleImageError(profile.id)}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent rounded-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold truncate">
                      {profile.username}
                    </h3>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  {profile.bio && (
                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
