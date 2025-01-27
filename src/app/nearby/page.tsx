'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import { 
  FaMapMarkerAlt, 
  FaHeart, 
  FaFilter, 
  FaTimes, 
  FaFlag,
  FaStar,
  FaInfoCircle
} from 'react-icons/fa'
import MainLayout from '@/components/layouts/MainLayout'
import PageHeader from '@/components/PageHeader'

type NearbyUser = {
  id: string
  username: string
  age: number
  distance: number
  avatar_url: string
  location: string
  bio: string
}

export default function NearbyPage() {
  const [currentUser, setCurrentUser] = useState<NearbyUser | null>(null)
  const [users, setUsers] = useState<NearbyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showReport, setShowReport] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    maxDistance: 50,
    minAge: 18,
    maxAge: 99,
    gender: 'all'
  })

  const supabase = createClient()

  useEffect(() => {
    fetchNearbyUsers()
  }, [filters])

  const fetchNearbyUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(20)

      if (error) throw error
      if (data) {
        setUsers(data)
        if (data.length > 0) setCurrentUser(data[0])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentUser) return
    try {
      // Logique de like à implémenter
      nextUser()
    } catch (error) {
      console.error('Erreur like:', error)
    }
  }

  const handleDislike = () => {
    nextUser()
  }

  const nextUser = () => {
    const currentIndex = users.findIndex(u => u.id === currentUser?.id)
    if (currentIndex < users.length - 1) {
      setCurrentUser(users[currentIndex + 1])
    } else {
      // Plus de profils disponibles
      setCurrentUser(null)
    }
  }

  return (
    <MainLayout>
      <PageHeader 
        title="Découvrir" 
        showBack={false}
        rightElement={
          <button 
            onClick={() => setShowFilters(true)}
            className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

      <div className="container mx-auto px-4 py-4">
        {currentUser ? (
          <div className="relative max-w-lg mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-white">
            {/* Image de profil */}
            <Image
              src={currentUser.avatar_url || '/default-avatar.jpg'}
              alt={currentUser.username}
              fill
              className="object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Infos profil */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {currentUser.username}, {currentUser.age}
                  </h2>
                  <p className="text-white/90 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {currentUser.location} • {currentUser.distance} km
                  </p>
                </div>
                <button
                  onClick={() => setShowReport(true)}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <FaFlag className="w-5 h-5 text-white/80" />
                </button>
              </div>

              <p className="text-white/90 mb-6">{currentUser.bio}</p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleDislike}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={handleLike}
                  className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                >
                  <FaHeart className="w-8 h-8 text-white" />
                </button>
                <button
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FaStar className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-black">
            <FaInfoCircle className="w-16 h-16 mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-2 text-white">Plus personne à proximité</h2>
            <p className="text-center">
              Modifiez vos filtres ou revenez plus tard pour découvrir de nouveaux profils
            </p>
          </div>
        )}
      </div>

      {/* Modal de signalement */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 m-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Signaler le profil</h3>
            <div className="space-y-2">
              {['Faux profil', 'Contenu inapproprié', 'Harcèlement', 'Autre'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setShowReport(false)
                  }}
                  className="w-full p-3 text-left rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReport(false)}
              className="w-full mt-4 p-3 text-rose-500 font-medium rounded-xl hover:bg-rose-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal des filtres */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            {/* Ajoutez ici les contrôles de filtre */}
          </div>
        </div>
      )}
    </MainLayout>
  )
} 