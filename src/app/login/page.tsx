'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layouts/MainLayout'
import LoginForm from '@/components/LoginForm'
import { siteConfig } from '@/config/site'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  async function handleLoginAction(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout requireAuth={false} hideNav={true}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {siteConfig.name}
            </h1>
            <p className="text-white/60 mt-2">
              {siteConfig.description}
            </p>
          </div>
          <LoginForm 
            onSubmitAction={handleLoginAction}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </MainLayout>
  )
} 