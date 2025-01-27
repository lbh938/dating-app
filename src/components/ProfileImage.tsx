import Image from 'next/image'
import { getImageUrl } from '@/utils/imageLoader'

type ProfileImageProps = {
  src: string | null | undefined
  alt: string
  className?: string
  size?: number
  fill?: boolean
}

export default function ProfileImage({ 
  src, 
  alt, 
  className = '', 
  size = 100,
  fill = false 
}: ProfileImageProps) {
  const imageUrl = getImageUrl(src)

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover ${className}`}
    />
  )
} 