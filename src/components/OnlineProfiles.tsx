'use client'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'
import { FaMapMarkerAlt, FaCircle } from 'react-icons/fa'
import { DEFAULT_AVATAR } from '@/types/profile'

type OnlineProfilesProps = {
  filters?: any
}

type Profile = {
  id: string
  username: string
  avatar_url: string | null
  age: number
  is_online: boolean
}

export default function OnlineProfiles({ filters }: OnlineProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const supabase = getSupabaseClient()

  useEffect(() => {
    loadProfiles()
  }, [filters])

  const loadProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .limit(12)

    setProfiles(data || [])
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {profiles.map((profile) => (
        <div 
          key={profile.id}
          className="relative group cursor-pointer"
        >
          {/* Card container */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-rose-500/50 transition-colors">
            {/* Image container */}
            <div className="relative aspect-[4/5]">
              <Image
                src={profile.avatar_url || DEFAULT_AVATAR}
                alt={profile.username || 'Profile'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Indicateur en ligne */}
              <div className="absolute top-2 right-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  profile.is_online 
                    ? 'bg-emerald-500/20 text-emerald-500' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <FaCircle className="w-2 h-2" />
                  <span className="text-xs font-medium">
                    {profile.is_online ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info container */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white truncate">
                  {profile.username || 'Anonyme'}
                </h3>
                <span className="text-sm font-medium text-white/80">
                  {profile.age} ans
                </span>
              </div>

              {profile.location && (
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  <span className="truncate">{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 