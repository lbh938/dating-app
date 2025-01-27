import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

export function useAvatar() {
  const [uploading, setUploading] = useState(false)
  const supabase = getSupabaseClient()

  const uploadAvatar = async (
    userId: string,
    file: File,
    bucket = 'avatars'
  ): Promise<string | null> => {
    try {
      setUploading(true)

      if (!file) {
        throw new Error('You must select an image to upload.')
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // Mise à jour du profil avec l'URL de l'avatar
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      return publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadAvatar,
    uploading
  }
} 