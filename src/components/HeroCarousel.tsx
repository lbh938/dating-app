'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    title: "Trouvez l'amour",
    description: "Rencontrez des personnes qui vous correspondent",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2062&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Créez des connexions",
    description: "Partagez vos passions et vos intérêts",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Commencez une histoire",
    description: "Découvrez des profils qui vous inspirent",
    image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=2069&auto=format&fit=crop"
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[50vh] mb-8">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
          <div className="absolute bottom-10 left-0 right-0 text-center text-white">
            <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
            <p className="text-lg text-white/80">{slide.description}</p>
          </div>
        </div>
      ))}
      
      {/* Carousel Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-rose-500' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
} 