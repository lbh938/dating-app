'use client'
import MainLayout from '@/components/layouts/MainLayout'
import PageHeader from '@/components/PageHeader'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Message = {
  id: string
  username: string
  lastMessage: string
  time: string
  avatar: string
  isOnline: boolean
}

const messages: Message[] = [
  {
    id: '1',
    username: 'Sophie',
    lastMessage: 'Salut ! Comment vas-tu ?',
    time: '12:30',
    avatar: '/profiles/user1.jpg',
    isOnline: true
  },
  // Ajoutez plus de messages...
]

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMessages = messages.filter(message =>
    message.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout hideNav={true}>
      <PageHeader title="Messages" showBack={false} />
      <div className="container mx-auto px-4">
        <div className="py-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-y-2">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:scale-[1.02] transition-all"
                onClick={() => router.push(`/messages/${message.id}`)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={message.avatar}
                      alt={message.username}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  {message.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{message.username}</h3>
                  <p className="text-gray-500 text-sm">{message.lastMessage}</p>
                </div>
                <span className="text-gray-500 text-xs">{message.time}</span>
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No messages found
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 