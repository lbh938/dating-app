'use client'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type PageHeaderProps = {
  title: string
  showBack?: boolean
  rightElement?: React.ReactNode
}

export default function PageHeader({ title, showBack = true, rightElement }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4 z-10">
      <div className="container mx-auto flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full hover:scale-110 transition-all"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white flex-1">{title}</h1>
        {rightElement}
      </div>
    </div>
  )
} 