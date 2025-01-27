import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Créer une seule instance du client Supabase
let supabaseInstance: ReturnType<typeof supabaseCreateClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = supabaseCreateClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    })
  }
  return supabaseInstance
}

// Pour la compatibilité avec le code existant
export const createClient = getSupabaseClient 

// Ajouter cette fonction d'initialisation
export const initStorage = async () => {
  const supabase = getSupabaseClient()
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.find(b => b.name === 'avatars')) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      })
    }
  } catch (error) {
    console.error('Error initializing storage:', error)
  }
} 