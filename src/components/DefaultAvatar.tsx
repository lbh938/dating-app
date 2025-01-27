export default function DefaultAvatar({ size = 150 }: { size?: number }) {
  return (
    <div 
      className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        className="w-1/2 h-1/2 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )
} 