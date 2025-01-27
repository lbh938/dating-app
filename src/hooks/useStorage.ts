import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

type StorageType = 'avatars' | 'covers'

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const supabase = getSupabaseClient()

  const uploadFile = async (
    userId: string,
    file: File,
    type: StorageType
  ): Promise<string | null> => {
    try {
      setUploading(true)

      if (!file) {
        throw new Error('You must select an image to upload.')
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed. Please use JPEG, PNG, GIF or WebP.')
      }

      // Vérifier la taille du fichier (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 2MB.')
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from(type)
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(type)
        .getPublicUrl(filePath)

      // Mettre à jour le profil
      const updateField = type === 'avatars' ? 'avatar_url' : 'cover_url'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      return publicUrl
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (
    userId: string,
    fileUrl: string,
    type: StorageType
  ) => {
    try {
      // Extraire le chemin du fichier de l'URL
      const path = fileUrl.split(`${type}/`)[1]
      if (!path) throw new Error('Invalid file URL')

      const { error: deleteError } = await supabase.storage
        .from(type)
        .remove([path])

      if (deleteError) {
        throw deleteError
      }

      // Mettre à jour le profil
      const updateField = type === 'avatars' ? 'avatar_url' : 'cover_url'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: null })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      throw error
    }
  }

  return {
    uploadFile,
    deleteFile,
    uploading
  }
} 