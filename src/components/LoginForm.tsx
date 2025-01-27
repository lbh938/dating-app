'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onSubmitAction: (formData: FormData) => Promise<void>
  loading: boolean
  error: string | null
}

export default function LoginForm({ onSubmitAction, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Connexion
      </h1>

      <form action={onSubmitAction} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-white mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-white mb-2">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
} 