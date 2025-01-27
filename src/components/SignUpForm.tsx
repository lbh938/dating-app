'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { FaHeart, FaUser, FaShieldAlt } from 'react-icons/fa'

type SignUpStep = 1 | 2 | 3
type Gender = 'homme' | 'femme' | 'non-binaire'

interface SignUpData {
  email: string
  password: string
  gender: Gender
  seekingGender: Gender[]
  birthDate: string
  isAdult: boolean
}

export default function SignUpForm() {
  const [step, setStep] = useState<SignUpStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    gender: 'homme',
    seekingGender: [],
    birthDate: '',
    isAdult: false
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.isAdult) {
      alert('Vous devez avoir plus de 18 ans pour vous inscrire.')
      return
    }
    setIsLoading(true)

    try {
      // Vérifier l'âge
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        throw new Error('Vous devez avoir plus de 18 ans pour vous inscrire.')
      }

      // Créer l'utilisateur
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined // Désactive la redirection par email
        }
      })

      if (signUpError) throw signUpError

      if (authData.user) {
        // Créer le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            gender: formData.gender,
            seeking_gender: formData.seekingGender,
            birth_date: formData.birthDate
          })

        if (profileError) {
          console.error('Erreur profil:', profileError)
          throw profileError
        }

        // Connecter l'utilisateur directement
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) throw signInError

        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Erreur:', error)
      alert(error.message || 'Erreur lors de l\'inscription!')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-rose-100 max-w-sm mx-auto">
      <div className="text-center">
        <div className="bg-rose-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaShieldAlt className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Vérification de l'âge</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center bg-rose-50 p-3 rounded-lg">
          <input
            type="checkbox"
            id="adult"
            checked={formData.isAdult}
            onChange={(e) => setFormData({ ...formData, isAdult: e.target.checked })}
            className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500 mr-3"
          />
          <label htmlFor="adult" className="text-gray-900">
            Je confirme avoir 18 ans ou plus
          </label>
        </div>

        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />

        <button
          onClick={() => formData.isAdult ? setStep(2) : alert('Vous devez confirmer avoir plus de 18 ans')}
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-medium"
        >
          Continuer
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-rose-100 max-w-sm mx-auto">
      <div className="text-center">
        <div className="bg-rose-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaUser className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Qui êtes-vous ?</h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            className="w-full p-3 text-gray-900 border-2 border-gray-200 rounded-lg appearance-none"
          >
            <option value="homme">Je suis un homme</option>
            <option value="femme">Je suis une femme</option>
            <option value="non-binaire">Je suis non-binaire</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">▼</div>
        </div>

        <div className="bg-rose-50 p-3 rounded-lg space-y-2">
          <p className="font-medium text-gray-900 mb-2">Je recherche :</p>
          {['homme', 'femme', 'non-binaire'].map((gender) => (
            <label key={gender} className="flex items-center bg-white p-2 rounded-lg">
              <input
                type="checkbox"
                checked={formData.seekingGender.includes(gender as Gender)}
                onChange={(e) => {
                  const newSeeking = e.target.checked
                    ? [...formData.seekingGender, gender as Gender]
                    : formData.seekingGender.filter(g => g !== gender)
                  setFormData({ ...formData, seekingGender: newSeeking })
                }}
                className="w-4 h-4 text-rose-500 rounded mr-3"
              />
              <span className="text-gray-900">
                {gender === 'homme' ? 'Les hommes' : gender === 'femme' ? 'Les femmes' : 'Les personnes non-binaires'}
              </span>
            </label>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setStep(1)}
            className="w-1/2 py-3 border-2 border-rose-500 text-rose-500 rounded-lg"
          >
            Retour
          </button>
          <button
            onClick={() => setStep(3)}
            className="w-1/2 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-rose-100 max-w-sm mx-auto">
      <div className="text-center">
        <div className="bg-rose-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaHeart className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Créez votre compte</h3>
      </div>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Votre email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-lg"
        />
        <input
          type="password"
          placeholder="Choisissez un mot de passe"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-lg"
        />

        <div className="flex space-x-2">
          <button
            onClick={() => setStep(2)}
            className="w-1/2 py-3 border-2 border-rose-500 text-rose-500 rounded-lg"
          >
            Retour
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-1/2 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg"
          >
            {isLoading ? '...' : 'Terminer'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </>
  )
} 