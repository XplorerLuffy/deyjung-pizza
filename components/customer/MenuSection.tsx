'use client'

import React, { useState } from 'react'
import type { MenuItem } from '@/lib/types'
import { useMenu } from '@/lib/hooks/useMenu'
import CategoryNav from './CategoryNav'
import MenuItemCard from './MenuItemCard'
import { useToast } from '@/components/ui/Toast'

export default function MenuSection() {
  const { menu, categories, loading, getByCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [visible, setVisible] = useState(true)
  const toast = useToast()

  function handleCategorySelect(slug: string) {
    setVisible(false)
    setTimeout(() => {
      setSelectedCategory(slug)
      setVisible(true)
    }, 150)
  }

  function handleAddItem(item: MenuItem) {
    toast.success(`${item.emoji} ${item.name} added to cart!`)
  }

  const filtered = getByCategory(selectedCategory)

  return (
    <section id="menu" className="min-h-screen pt-8 pb-24">
      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-4xl md:text-5xl text-brand-text mb-3">
            Our <span className="text-gold italic">Menu</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gold/40" />
            <span className="text-gold text-lg">✦</span>
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <CategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-card rounded-2xl h-64 animate-pulse border border-gold/5"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-brand-muted">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-lg">No items in this category yet</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-200"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
          >
            {filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />
            ))}
          </div>
        )}

        {/* Demo items if menu is empty (for development) */}
        {!loading && menu.length === 0 && (
          <div className="text-center py-8 text-brand-muted text-sm">
            <p>Menu items will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  )
}
