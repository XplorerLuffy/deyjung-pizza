import React from 'react'

type BadgeVariant = 'gold' | 'crimson' | 'olive' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold/20 text-gold border border-gold/30',
  crimson: 'bg-crimson/20 text-crimson-light border border-crimson/30',
  olive: 'bg-olive/20 text-olive-light border border-olive/30',
  muted: 'bg-brand-muted/10 text-brand-muted border border-brand-muted/20',
}

export default function Badge({ variant = 'gold', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
