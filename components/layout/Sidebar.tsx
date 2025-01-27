import Link from 'next/link';
import { Home, Users, Video, MessageCircle, User } from 'lucide-react';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <div className={`w-64 border-r border-gray-200 dark:border-gray-800 p-4 ${className}`}>
      <div className="flex flex-col space-y-6">
        <Link href="/" className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg">
          <Home size={24} />
          <span>Accueil</span>
        </Link>
        
        <Link href="/discover" className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg">
          <Users size={24} />
          <span>Découvrir</span>
        </Link>
        
        <Link href="/live" className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg">
          <Video size={24} />
          <span>Live</span>
        </Link>
        
        <Link href="/messages" className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg">
          <MessageCircle size={24} />
          <span>Messages</span>
        </Link>
        
        <Link href="/profile" className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg">
          <User size={24} />
          <span>Profil</span>
        </Link>
      </div>
    </div>
  );
} 