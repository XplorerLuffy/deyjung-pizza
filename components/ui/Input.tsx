'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-brand-muted font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 bg-surface-light border rounded-lg text-brand-text text-sm
          placeholder:text-brand-muted/50 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
          ${error ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-brand-muted font-medium">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-4 py-2.5 bg-surface-light border rounded-lg text-brand-text text-sm
          placeholder:text-brand-muted/50 transition-all duration-200 resize-none
          focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
          ${error ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
