import Link from 'next/link';
import { Home, Users, Video, MessageCircle, User } from 'lucide-react';

export default function BottomNav({ className }: { className?: string }) {
  return (
    <nav className={`bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-2 ${className}`}>
      <div className="flex justify-around items-center">
        <Link href="/" className="p-2">
          <Home size={24} />
        </Link>
        <Link href="/discover" className="p-2">
          <Users size={24} />
        </Link>
        <Link href="/live" className="p-2">
          <Video size={24} />
        </Link>
        <Link href="/messages" className="p-2">
          <MessageCircle size={24} />
        </Link>
        <Link href="/profile" className="p-2">
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
} 