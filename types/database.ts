export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | 'other' | null;
  location: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  privacy_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  follower_id: string;
  following_id: string;
  created_at: string;
} 