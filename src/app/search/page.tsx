'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaComments, 
  FaCheck,
  FaSpinner
} from 'react-icons/fa'
import MainLayout from '@/components/layouts/MainLayout'
import PageHeader from '@/components/PageHeader'

type User = {
  id: string
  username: string
  avatar_url: string
  location: string
  age: number
  bio: string
  isRequested?: boolean
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [requestLoading, setRequestLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers()
    }
  }, [searchTerm])

  const searchUsers = async () => {
    setLoading(true)
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${searchTerm}%`)
        .limit(20)

      if (error) throw error

      // Vérifier les demandes existantes
      const { data: requests } = await supabase
        .from('chat_requests')
        .select('recipient_id')
        .eq('sender_id', (await supabase.auth.getUser()).data.user?.id)

      const requestedIds = new Set(requests?.map(r => r.recipient_id) || [])
      
      setUsers(users.map(user => ({
        ...user,
        isRequested: requestedIds.has(user.id)
      })))
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendChatRequest = async (recipientId: string) => {
    setRequestLoading(recipientId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('chat_requests')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          status: 'pending'
        })

      if (error) throw error

      setUsers(users.map(u => 
        u.id === recipientId ? { ...u, isRequested: true } : u
      ))
    } catch (error) {
      console.error('Erreur demande:', error)
      alert('Erreur lors de l\'envoi de la demande')
    } finally {
      setRequestLoading(null)
    }
  }

  return (
    <MainLayout>
      <PageHeader title="Recherche" showBack={false} />
      <div className="container mx-auto px-4 py-4">
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <input
            type="search"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-rose-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Résultats */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              >
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.avatar_url || '/default-avatar.jpg'}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">
                    {user.username}
                  </h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3 h-3" />
                    {user.location} • {user.age} ans
                  </p>
                  {user.bio && (
                    <p className="text-gray-300 text-sm mt-1 line-clamp-1">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Bouton d'action */}
                {!user.isRequested ? (
                  <button
                    onClick={() => sendChatRequest(user.id)}
                    disabled={requestLoading === user.id}
                    className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {requestLoading === user.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaComments className="w-5 h-5" />
                        Discuter
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-500 rounded-xl flex items-center gap-2">
                    <FaCheck className="w-5 h-5" />
                    Envoyé
                  </div>
                )}
              </div>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="text-center py-8 text-gray-400">
              Aucun utilisateur trouvé
            </div>
          ) : null}
        </div>
      </div>
    </MainLayout>
  )
} 