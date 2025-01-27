'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { FaCamera } from 'react-icons/fa'
import MainLayout from '@/components/layouts/MainLayout'
import { Avatar, FormInput } from '@/components'
import PageHeader from '@/components/PageHeader'

type Profile = {
  username: string
  bio: string
  age: number
  location: string
  avatar_url: string
  cover_url: string
}

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    username: '',
    bio: '',
    age: 18,
    location: '',
    avatar_url: '',
    cover_url: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id)

      if (error) throw error

      router.push('/profile')
    } catch (error) {
      console.error('Erreur mise à jour:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }))
  }

  return (
    <MainLayout>
      <PageHeader title="Modifier le profil" />
      
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar
              uid={user?.id || ''}
              url={profile.avatar_url}
              size={128}
              onUpload={handleAvatarUpload}
              editable
            />
          </div>

          {/* Formulaire */}
          <div className="space-y-4 bg-white rounded-xl p-6 border border-gray-200">
            <FormInput
              label="Nom d'utilisateur"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              required
            />

            <FormInput
              label="Bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              multiline
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Âge"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                min={18}
                required
              />

              <FormInput
                label="Ville"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 