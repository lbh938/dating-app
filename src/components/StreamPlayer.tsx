'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { FaHeart, FaComment, FaShare, FaTimes } from 'react-icons/fa'

type StreamPlayerProps = {
  streamId: string
  onToggleChatAction: () => void
  likes: number
  comments: number
  onSwipeAction?: (direction: 'left' | 'right') => void
}

export default function StreamPlayer({ streamId, onToggleChatAction, likes, comments, onSwipeAction }: StreamPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [exitX, setExitX] = useState<number>(0)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 150) {
      const direction = offset > 0 ? 'right' : 'left'
      setExitX(direction === 'right' ? 200 : -200)
      
      await controls.start({ x: direction === 'right' ? 200 : -200 })
      onSwipeAction?.(direction)
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <motion.div 
        ref={playerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="absolute inset-0 touch-none"
        style={{ x: 0 }}
        whileDrag={{
          scale: 0.95,
        }}
      >
        {/* Placeholder pour le stream */}
        <div className="w-full h-full flex items-center justify-center text-white/60 bg-gray-900 rounded-lg">
          Stream Player Placeholder
        </div>

        {/* Indicateurs de swipe */}
        <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none opacity-0 transition-opacity"
             style={{
               opacity: exitX !== 0 ? 1 : 0
             }}>
          <div className={`p-4 rounded-full bg-red-500/80 ${exitX > 0 ? 'opacity-0' : 'opacity-100'}`}>
            <FaTimes className="w-8 h-8 text-white" />
          </div>
          <div className={`p-4 rounded-full bg-green-500/80 ${exitX < 0 ? 'opacity-0' : 'opacity-100'}`}>
            <FaHeart className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      <div className="absolute right-4 bottom-28 flex flex-col gap-6 z-10">
        {/* Like */}
        <button 
          className="group flex flex-col items-center gap-1"
          onClick={() => {
            controls.start({ x: 200 })
            setExitX(200)
            onSwipeAction?.('right')
          }}
        >
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-rose-500/50 transition-colors">
            <FaHeart className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{likes}</span>
        </button>

        {/* Commentaires */}
        <button 
          onClick={onToggleChatAction}
          className="group flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-rose-500/50 transition-colors">
            <FaComment className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{comments}</span>
        </button>

        {/* Partager */}
        <button className="group flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-rose-500/50 transition-colors">
            <FaShare className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </button>
      </div>
    </div>
  )
} 