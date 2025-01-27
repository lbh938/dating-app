import Image from 'next/image'
import { useState } from 'react'

type SafeImageProps = {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  className = '',
  width,
  height,
  fill = false,
  priority = false
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
} 