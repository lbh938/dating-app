'use client'
import { useState } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import PageWithNavigation from '@/components/layouts/PageWithNavigation'
import Image from 'next/image'
import { FaSearch, FaTimes, FaHeart, FaEye, FaPlay } from 'react-icons/fa'
import { DEFAULT_AVATAR } from '@/types/profile'

type Stream = {
  id: string
  title: string
  thumbnail: string
  viewer_count: number
  likes: number
  streamer: {
    username: string
    avatar_url: string | null
    is_online: boolean
  }
  category: string
}

export default function StreamPage() {
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: '1',
      title: 'Speed Dating en direct 💕',
      thumbnail: 'https://picsum.photos/400/225?random=1',
      viewer_count: 234,
      likes: 89,
      streamer: {
        username: 'Sophie',
        avatar_url: null,
        is_online: true
      },
      category: 'Dating'
    },
    // ... autres streams
  ])

  return (
    <MainLayout>
      <PageWithNavigation>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-4">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Live</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-64 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-rose-500"
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
            </div>

            {/* Catégories */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <button className="px-4 py-2 rounded-full bg-rose-500 text-white whitespace-nowrap">
                Tous
              </button>
              <button className="px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                Speed Dating
              </button>
              <button className="px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                Événements
              </button>
              <button className="px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                Just Chat
              </button>
            </div>

            {/* Grille de streams */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {streams.map((stream) => (
                <div
                  key={stream.id}
                  className="group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <Image
                      src={stream.thumbnail}
                      alt={stream.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                        <FaPlay className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FaEye className="w-4 h-4" />
                          <span className="text-sm">{stream.viewer_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHeart className="w-4 h-4 text-rose-500" />
                          <span className="text-sm">{stream.likes}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-rose-500/90 text-sm">
                        En direct
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={stream.streamer.avatar_url || DEFAULT_AVATAR}
                        alt={stream.streamer.username}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {stream.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-white/60 text-sm">
                          {stream.streamer.username}
                        </p>
                        <span className="text-white/40 text-sm">•</span>
                        <p className="text-white/60 text-sm">
                          {stream.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWithNavigation>
    </MainLayout>
  )
} 