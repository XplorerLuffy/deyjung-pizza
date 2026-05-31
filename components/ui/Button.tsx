'use client'

import React from 'react'

type ButtonVariant = 'gold' | 'crimson' | 'outline-gold' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  gold: 'bg-gold text-dark font-semibold hover:bg-gold-light active:bg-gold-dark',
  crimson: 'bg-crimson text-brand-text font-semibold hover:bg-crimson-light active:bg-crimson-dark',
  'outline-gold': 'border border-gold text-gold hover:bg-gold/10 active:bg-gold/20',
  ghost: 'text-brand-muted hover:text-brand-text hover:bg-surface-light',
  danger: 'bg-red-900 text-red-100 font-semibold hover:bg-red-800 active:bg-red-950',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
