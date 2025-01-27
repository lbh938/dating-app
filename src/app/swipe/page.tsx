'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import MainLayout from '@/components/layouts/MainLayout'
import Image from 'next/image'
import { FaHeart, FaTimes, FaMapMarkerAlt, FaCalendar, FaComments } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string
  birth_date: string
  location: string
  photos: string[]
  online_status: boolean
  last_active: string
}

export default function SwipePage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchOnlineProfiles()
  }, [])

  const fetchOnlineProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .eq('online_status', true)
        .order('last_active', { ascending: false })

      if (error) throw error

      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || currentIndex >= profiles.length) return

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          liked_user_id: profiles[currentIndex].id
        })

      if (error) throw error

      setCurrentIndex(prev => prev + 1)
    } catch (error) {
      console.error('Error liking profile:', error)
    }
  }

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const handleStartConversation = async (profileId: string) => {
    try {
      // Créer ou récupérer une conversation existante
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .upsert({
          user1_id: user?.id,
          user2_id: profileId,
        }, {
          onConflict: 'user1_id,user2_id'
        })
        .select()
        .single()

      if (convError) throw convError

      // Rediriger vers la conversation
      router.push(`/messages/${conversation.id}`)
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Erreur lors de la création de la conversation')
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
        </div>
      </MainLayout>
    )
  }

  if (currentIndex >= profiles.length) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Plus personne en ligne pour le moment</h2>
            <p className="text-white/60">Revenez plus tard pour découvrir de nouveaux profils</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-lg mx-auto">
            {/* Card principale */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800/50">
              <Image
                src={currentProfile.avatar_url || '/images/default-avatar.jpg'}
                alt={currentProfile.username}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Informations du profil */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {currentProfile.username}, {calculateAge(currentProfile.birth_date)}
                </h2>
                
                <div className="flex items-center gap-4 mb-3 text-sm">
                  {currentProfile.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>{currentProfile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>En ligne</span>
                  </div>
                </div>
                
                <p className="text-white/80 line-clamp-3">{currentProfile.bio}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={handlePass}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FaTimes className="w-8 h-8 text-white" />
              </button>
              
              <button
                onClick={() => handleStartConversation(currentProfile.id)}
                className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                <FaComments className="w-8 h-8 text-white" />
              </button>
              
              <button
                onClick={handleLike}
                className="p-4 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors"
              >
                <FaHeart className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 