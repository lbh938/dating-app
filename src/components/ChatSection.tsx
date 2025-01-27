'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase'
import { FaPaperPlane, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  user_id: string
  username: string
  content: string
  created_at: string
}

type ChatSectionProps = {
  streamId: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatSection({ streamId, isOpen, onClose }: ChatSectionProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen) return

    // Charger les messages récents
    const loadMessages = async () => {
      const { data } = await supabase
        .from('stream_messages')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(30)

      if (data) setMessages(data.reverse())
    }

    loadMessages()

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel(`stream_${streamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'stream_messages',
        filter: `stream_id=eq.${streamId}`
      }, (payload) => {
        setMessages(prev => {
          const newMessages = [...prev, payload.new as Message]
          // Garder seulement les 30 derniers messages
          return newMessages.slice(-30)
        })
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.new.id))
        }, 5000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [streamId, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    setLoading(true)
    try {
      await supabase.from('stream_messages').insert({
        stream_id: streamId,
        user_id: user.id,
        username: user.email?.split('@')[0],
        content: newMessage.trim()
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full max-w-sm bg-black/90 backdrop-blur-lg border-l border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-white font-semibold">Commentaires</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <FaTimes className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[calc(100vh-180px)]">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {message.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 bg-white/10 rounded-2xl p-3">
                <p className="text-white/80 text-sm font-medium mb-1">
                  {message.username}
                </p>
                <p className="text-white">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </motion.div>
  )
} 