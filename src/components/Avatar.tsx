'use client'
import { useStorage } from '@/hooks/useStorage'
import Image from 'next/image'
import { FaCamera } from 'react-icons/fa'
import { DEFAULT_AVATAR } from '@/types/profile'

type AvatarProps = {
  uid: string
  url: string | null
  size?: number
  onUpload?: (url: string) => void
  editable?: boolean
}

export default function Avatar({ uid, url, size = 150, onUpload, editable = false }: AvatarProps) {
  const { uploadFile, uploading } = useStorage()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const newUrl = await uploadFile(uid, file, 'avatars')
      if (newUrl && onUpload) {
        onUpload(newUrl)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="w-full h-full rounded-full overflow-hidden">
        <Image
          src={url || DEFAULT_AVATAR}
          alt="Avatar"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      
      {editable && (
        <label className="absolute bottom-0 right-0 p-2 rounded-full bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            disabled={uploading}
          />
          <FaCamera className="w-4 h-4 text-white" />
        </label>
      )}
    </div>
  )
} 