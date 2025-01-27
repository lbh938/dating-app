'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import MainLayout from '@/components/layouts/MainLayout'
import PageHeader from '@/components/PageHeader'
import DashboardClient from '@/components/DashboardClient'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Tableau de bord</h1>
          <DashboardClient />
        </div>
      </div>
    </MainLayout>
  )
} 