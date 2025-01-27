'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { FaCamera, FaEdit, FaMapMarkerAlt, FaSave, FaTimes, FaCalendar, FaLink, FaUserFriends, FaComments } from 'react-icons/fa'
import { DEFAULT_AVATAR, DEFAULT_COVER } from '@/types/profile'
import { useAuth } from '@/components/AuthProvider'
import MainLayout from '@/components/layouts/MainLayout'

type Profile = {
  id: string
  username: string
  email: string
  gender: string | null
  seeking_gender: string[] | null
  birth_date: string | null
  bio: string | null
  location: string | null
  avatar_url: string | null
  cover_url: string | null
  photos: string[]
  created_at: string
  updated_at: string
}

type EditableProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>

const defaultProfile: Profile = {
  id: '',
  username: '',
  email: '',
  gender: null,
  seeking_gender: [],
  birth_date: null,
  bio: null,
  location: null,
  avatar_url: null,
  cover_url: null,
  photos: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const genderOptions = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'other', label: 'Autre' }
]

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [editProfile, setEditProfile] = useState<EditableProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClientComponentClient()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function fetchProfile() {
      try {
        // Vérifier d'abord si le profil existe
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            email,
            gender,
            seeking_gender,
            birth_date,
            bio,
            location,
            avatar_url,
            cover_url,
            photos,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (existingProfile) {
          setProfile({
            ...defaultProfile,
            ...existingProfile,
            photos: existingProfile.photos || []
          })
          return
        }

        // Si le profil n'existe pas, on le crée
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: user.id,
              username: user.email?.split('@')[0] || 'User',
              email: user.email,
              photos: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ], {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single()

        if (createError) throw createError

        if (newProfile) {
          setProfile({
            ...defaultProfile,
            ...newProfile,
            photos: []
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        alert('Erreur lors de la récupération du profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router, supabase])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
        </div>
      </MainLayout>
    )
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    setUploading(true)

    try {
      // Supprimer l'ancien avatar s'il existe
      if (profile.avatar_url) {
        const oldPath = new URL(profile.avatar_url).pathname.split('/').slice(-2).join('/')
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldPath])
        }
      }

      // Upload du nouvel avatar
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Mettre à jour l'état local
      setProfile({ ...profile, avatar_url: publicUrl })

    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error)
      alert('Erreur lors de l\'upload de l\'avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    setUploading(true)

    try {
      // Supprimer l'ancienne cover s'il existe
      if (profile.cover_url) {
        const oldPath = profile.cover_url.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('covers')
            .remove([`${user.id}/${oldPath}`])
        }
      }

      // Upload de la nouvelle cover
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath)

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          cover_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Mettre à jour l'état local
      setProfile({ ...profile, cover_url: publicUrl })

    } catch (error) {
      console.error('Erreur lors de l\'upload de la cover:', error)
      alert('Erreur lors de l\'upload de la cover')
    } finally {
      setUploading(false)
    }
  }

  const handleEditProfile = () => {
    setEditProfile({
      username: profile.username,
      email: profile.email,
      gender: profile.gender,
      seeking_gender: profile.seeking_gender,
      birth_date: profile.birth_date,
      bio: profile.bio,
      location: profile.location,
      avatar_url: profile.avatar_url,
      cover_url: profile.cover_url,
      photos: profile.photos,
    })
  }

  const handleCancelEdit = () => {
    setEditProfile(null)
  }

  const handleSaveProfile = async () => {
    if (!editProfile || !user) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editProfile.username,
          gender: editProfile.gender,
          seeking_gender: editProfile.seeking_gender,
          birth_date: editProfile.birth_date,
          bio: editProfile.bio,
          location: editProfile.location,
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...editProfile })
      setEditProfile(null)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    setUploading(true)

    try {
      // Upload de la nouvelle photo
      const { error: uploadError, data } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          photos: [...profile.photos, publicUrl],
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Mettre à jour l'état local
      setProfile({ ...profile, photos: [...profile.photos, publicUrl] })

    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error)
      alert('Erreur lors de l\'upload de la photo')
    } finally {
      setUploading(false)
    }
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20">
        {/* Cover Section */}
        <div className="relative pt-16">
          <div className="h-48 md:h-64 relative">
            <Image
              src={profile.cover_url || DEFAULT_COVER}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
            <label className="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer z-10">
              <FaCamera className="w-5 h-5" />
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative px-4 pb-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              {/* Avatar et Nom */}
              <div className="flex items-end gap-4 -mt-12 md:-mt-16 relative z-20">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-black">
                    <Image
                      src={profile.avatar_url || DEFAULT_AVATAR}
                      alt={profile.username}
                      width={128}
                      height={128}
                      className="object-cover"
                      priority
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer">
                      <FaCamera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="mb-2">
                  <h1 className="text-xl md:text-2xl font-bold text-white">{profile.username}</h1>
                  <p className="text-white/60 text-sm">@{profile.username.toLowerCase()}</p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-4 md:mt-0 flex gap-2 justify-end">
                {!editProfile ? (
                  <>
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors flex items-center gap-2"
                    >
                      <FaEdit className="w-4 h-4" />
                      <span>Modifier le profil</span>
                    </button>
                    <button
                      onClick={() => handleStartConversation(profile.id)}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center gap-2"
                    >
                      <FaComments className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaSave className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span>Annuler</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Informations du profil */}
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.birth_date && (
                  <div className="flex items-center gap-1">
                    <FaCalendar className="w-4 h-4" />
                    <span>{calculateAge(profile.birth_date)} ans</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FaUserFriends className="w-4 h-4" />
                  <span>0 followers</span>
                </div>
              </div>

              <div className="text-white/80">
                {editProfile ? (
                  <textarea
                    value={editProfile.bio || ''}
                    onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    placeholder="Ajoutez une bio..."
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 focus:border-rose-500 outline-none"
                    rows={3}
                  />
                ) : (
                  <p>{profile.bio || 'Aucune bio'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Photos</h2>
            <label className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer flex items-center gap-2">
              <FaCamera className="w-4 h-4" />
              <span>Ajouter une photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {profile.photos.map((photo, index) => (
              <div key={index} className="aspect-square relative group rounded-lg overflow-hidden">
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <button 
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeletePhoto(index)}
                  >
                    <FaTimes className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}