'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { getSupabaseClient } from '@/lib/supabase'
import MainLayout from '@/components/layouts/MainLayout'
import PageWithNavigation from '@/components/layouts/PageWithNavigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  type: 'like' | 'match'
  content: any
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    setNotifications(data || [])

    // Marquer comme lues
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id)
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.type === 'like') {
      // Accepter ou rejeter le like
      router.push(`/likes/${notification.content.sender_id}`)
    } else if (notification.type === 'match') {
      // Aller à la conversation
      router.push(`/chat/${notification.content.matched_user_id}`)
    }
  }

  return (
    <MainLayout>
      <PageWithNavigation>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
          
          <div className="space-y-4">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="w-full p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Contenu selon le type */}
                {notification.type === 'like' && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500" />
                    <div className="text-left">
                      <p className="text-white">
                        <span className="font-semibold">{notification.content.sender_name}</span>
                        {' vous a liké !'}
                      </p>
                      <p className="text-sm text-white/60">
                        Cliquez pour répondre
                      </p>
                    </div>
                  </div>
                )}

                {notification.type === 'match' && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500" />
                    <div className="text-left">
                      <p className="text-white">
                        {'Match avec '}
                        <span className="font-semibold">{notification.content.matched_user_name}</span>
                        {' !'}
                      </p>
                      <p className="text-sm text-white/60">
                        Cliquez pour commencer à discuter
                      </p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </PageWithNavigation>
    </MainLayout>
  )
} 