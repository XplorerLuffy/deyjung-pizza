'use client'

import React from 'react'
import type { Category } from '@/lib/types'

interface CategoryNavProps {
  categories: Category[]
  selected: string
  onSelect: (slug: string) => void
}

export default function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
  const allCategories = [
    { id: 'all', name: 'All', slug: 'all', emoji: '🍽️', sort_order: -1 },
    ...categories,
  ]

  return (
    <div className="sticky top-16 z-20 bg-dark/90 backdrop-blur-md py-3 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className={`
                flex-none flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${
                  selected === cat.slug
                    ? 'bg-gold text-dark'
                    : 'bg-surface text-brand-muted hover:text-brand-text hover:bg-surface-light'
                }
              `}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
