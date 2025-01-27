'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import MainLayout from '@/components/layouts/MainLayout'
import StreamPlayer from '@/components/StreamPlayer'
import ChatSection from '@/components/ChatSection'
import { AnimatePresence } from 'framer-motion'

export default function StreamPage() {
  const { id } = useParams()
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <StreamPlayer
            streamId={id as string}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            likes={1200}
            comments={450}
          />
        </div>

        <AnimatePresence>
          <ChatSection
            streamId={id as string}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </AnimatePresence>
      </div>
    </MainLayout>
  )
} 