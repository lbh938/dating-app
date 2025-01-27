export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/defaults/default-avatar.jpg'
  
  if (path.startsWith('http')) {
    return path
  }
  
  if (path.startsWith('/')) {
    return path
  }
  
  return `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${path}`
} 