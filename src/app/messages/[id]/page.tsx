'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import MainLayout from '@/components/layouts/MainLayout'
import PageHeader from '@/components/PageHeader'
import Image from 'next/image'
import { FaPaperPlane, FaImage, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '@/components/AuthProvider'

type MessageType = 'text' | 'image' | 'file'

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: MessageType
  file_url?: string
  is_edited: boolean
  edited_at?: string
  created_at: string
  deleted_at?: string
  reply_to_id?: string
  metadata?: any
}

type Conversation = {
  id: string
  title?: string
  is_group: boolean
  created_at: string
  updated_at: string
  last_message?: string
  last_message_at?: string
}

type Participant = {
  conversation_id: string
  user_id: string
  joined_at: string
  last_read_at?: string
  is_admin: boolean
}

export default function MessageDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const getOrCreateConversation = async () => {
      try {
        // Vérifier si une conversation existe déjà
        const { data: existingParticipations, error: participationError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)

        if (participationError) throw participationError

        const conversationIds = existingParticipations?.map(p => p.conversation_id) || []

        if (conversationIds.length > 0) {
          const { data: existingConv, error: convError } = await supabase
            .from('conversations')
            .select(`
              *,
              conversation_participants!inner(user_id)
            `)
            .in('id', conversationIds)
            .eq('conversation_participants.user_id', params.id)
            .single()

          if (existingConv) {
            setConversation(existingConv)
            return existingConv.id
          }
        }

        // Créer une nouvelle conversation
        const { data: newConv, error: createError } = await supabase
          .rpc('create_conversation', {
            user1_id: user.id,
            user2_id: params.id
          })

        if (createError) throw createError

        return newConv
      } catch (error) {
        console.error('Error with conversation:', error)
        return null
      }
    }

    const fetchMessages = async () => {
      try {
        const conversationId = await getOrCreateConversation()
        if (!conversationId) return

        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .is('deleted_at', null)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError

        setMessages(messages || [])
        scrollToBottom()

        // Marquer les messages comme lus
        await supabase
          .from('conversation_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id)

      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()

    // Souscription aux nouveaux messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: conversation?.id ? `conversation_id=eq.${conversation.id}` : undefined
        }, 
        (payload) => {
          setMessages(current => [...current, payload.new as Message])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, params.id, router, supabase, conversation?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading || !conversation?.id) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user?.id,
          content: newMessage,
          message_type: 'text'
        })

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Erreur lors de l\'envoi du message')
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* Header - ajusté avec pt-16 pour la navbar du haut */}
        <div className="fixed top-0 left-0 right-0 z-10 pt-16 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center h-16 px-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors mr-2"
            >
              <FaArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center flex-1">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/images/default-avatar.jpg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-white">Nom du contact</h2>
                <p className="text-xs text-white/60">En ligne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container - ajusté avec pt-32 (16+16) pour les deux barres et pb-36 pour la zone de saisie + navbar */}
        <div className="flex-1 overflow-y-auto pt-32 pb-36">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender_id !== user?.id && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      src="/images/default-avatar.jpg"
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`group relative max-w-[75%] ${
                    message.sender_id === user?.id ? 'bg-rose-500' : 'bg-gray-800'
                  } rounded-2xl px-4 py-2`}
                >
                  {message.message_type === 'text' ? (
                    <p className="text-white">{message.content}</p>
                  ) : message.message_type === 'image' ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={message.file_url || ''}
                        alt="Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <FaImage className="w-5 h-5" />
                      <span>Fichier</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/60">
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.is_edited && (
                      <span className="text-xs text-white/40">modifié</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar - ajusté avec bottom-16 pour laisser de la place à la navbar */}
        <div className="fixed bottom-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10">
          <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-2">
            <button
              type="button"
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <FaImage className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-3 rounded-full bg-gray-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="p-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:hover:bg-rose-500"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  )
} 