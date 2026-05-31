'use client'

import React from 'react'
import { useCart } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatters'

interface CartBarProps {
  onOpen: () => void
}

export default function CartBar({ onOpen }: CartBarProps) {
  const { count, total } = useCart()

  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-slide-up">
      <button
        onClick={onOpen}
        className="w-full max-w-2xl mx-auto flex items-center justify-between bg-gold text-dark px-6 py-4 rounded-2xl shadow-2xl hover:bg-gold-light active:bg-gold-dark transition-colors font-semibold"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🛒</span>
          <span>
            {count} item{count !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>View Order →</span>
          <span className="font-playfair font-bold">{formatPrice(total)}</span>
        </div>
      </button>
    </div>
  )
}
