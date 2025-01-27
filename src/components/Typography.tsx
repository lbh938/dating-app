type TextProps = {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small'
  className?: string
}

export function Text({ children, variant = 'body', className = '' }: TextProps) {
  const baseStyles = {
    h1: "text-2xl font-bold text-black",
    h2: "text-xl font-semibold text-black",
    h3: "text-lg font-semibold text-black",
    body: "text-base text-black",
    small: "text-sm text-black"
  }

  return (
    <div className={`${baseStyles[variant]} ${className}`}>
      {children}
    </div>
  )
} 