export type Profile = {
  id: string
  username: string
  email: string
  avatar_url?: string
  cover_url?: string
  bio?: string
  birth_date?: string
  location?: string
  gender?: string
  seeking_gender?: string[]
  interests?: string[]
  photos?: string[]
  height?: number
  relationship_status?: string
  looking_for?: string[]
  languages?: string[]
  occupation?: string
  education?: string
  smoking?: boolean
  drinking?: boolean
  children?: string
  zodiac_sign?: string
  personality_type?: string
}

export const DEFAULT_AVATAR = '/images/placeholders/avatar.jpg'
export const DEFAULT_COVER = '/images/default-cover.jpg' 