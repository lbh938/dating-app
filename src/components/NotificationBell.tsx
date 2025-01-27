'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { getSupabaseClient } from '@/lib/supabase'
import { FaBell } from 'react-icons/fa'

export default function NotificationBell() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadUnreadCount()
      subscribeToNotifications()
    }
  }, [user])

  const loadUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id)
      .eq('read', false)

    setUnreadCount(count || 0)
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        loadUnreadCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  return (
    <div className="relative">
      <FaBell className="w-6 h-6" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            {unreadCount}
          </span>
        </div>
      )}
    </div>
  )
} 