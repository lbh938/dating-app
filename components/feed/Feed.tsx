'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    loadInitialPosts();
  }, []);

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  const loadInitialPosts = async () => {
    // Simulation de chargement de posts
    const mockPosts: Post[] = [
      {
        id: '1',
        content: 'Bonjour tout le monde! 👋',
        author: {
          name: 'Sophie Martin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
        },
        likes: 42,
        comments: 12,
        createdAt: '2024-02-20T10:00:00Z'
      },
      // Ajoutez d'autres posts mockés ici
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  };

  const loadMorePosts = async () => {
    // Implémentez le chargement de posts supplémentaires ici
  };

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {posts.map((post) => (
        <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          {/* En-tête du post */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Contenu du post */}
          <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
          
          {/* Image du post si présente */}
          {post.image && (
            <div className="aspect-video mb-4">
              <img
                src={post.image}
                alt="Post content"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions du post */}
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <button className="flex items-center space-x-1 hover:text-pink-600">
              <span>❤️</span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-pink-600">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
          </div>
        </article>
      ))}
      
      {/* Sentinel pour l'infinite scroll */}
      <div ref={ref} className="h-10 col-span-full" />
    </div>
  );
} 