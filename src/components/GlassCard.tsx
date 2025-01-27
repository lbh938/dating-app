type GlassCardProps = {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 ${className}`}>
      {children}
    </div>
  )
} 