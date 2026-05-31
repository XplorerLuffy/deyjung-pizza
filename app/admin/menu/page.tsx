'use client'

import React, { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/admin/TopBar'
import MenuItemModal from '@/components/admin/MenuItemModal'
import Badge from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils/formatters'
import type { MenuItem, Category } from '@/lib/types'
import Image from 'next/image'

export default function MenuPage() {
  const toast = useToast()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch('/api/menu?admin=true')
      const data = await res.json() as { items: MenuItem[]; categories: Category[] }
      setItems(data.items || [])
      setCategories(data.categories || [])
    } catch {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  async function handleToggleAvailability(item: MenuItem) {
    try {
      const res = await fetch(`/api/menu/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !item.is_available }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i))
      )
    } catch {
      toast.error('Failed to toggle availability')
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/menu/items/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      toast.success(`${item.name} deleted`)
    } catch {
      toast.error('Failed to delete item')
    }
  }

  function handleSaved(saved: MenuItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === saved.id)
      if (exists) return prev.map((i) => (i.id === saved.id ? saved : i))
      return [...prev, saved]
    })
  }

  const filtered = items.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category_id === categoryFilter
    const matchesSearch =
      !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Menu Management"
        onAddItem={() => {
          setEditingItem(null)
          setIsModalOpen(true)
        }}
      />
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-gold text-dark'
                  : 'bg-surface text-brand-muted hover:text-brand-text hover:bg-surface-light'
              }`}
            >
              All ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-gold text-dark'
                    : 'bg-surface text-brand-muted hover:text-brand-text hover:bg-surface-light'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-surface border border-gold/20 rounded-lg text-brand-text text-sm focus:outline-none focus:border-gold/40 w-full sm:w-48"
            />
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 bg-surface border border-gold/20 rounded-lg text-brand-muted hover:text-brand-text transition-colors"
            >
              {viewMode === 'grid' ? '☰' : '⊞'}
            </button>
          </div>
        </div>

        {/* Items */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-3'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-surface-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-brand-muted">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-lg">No items found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`bg-surface-card border rounded-2xl overflow-hidden transition-colors ${
                  item.is_available ? 'border-gold/10 hover:border-gold/20' : 'border-red-900/20 opacity-60'
                }`}
              >
                {/* Image/emoji */}
                <div className="relative h-32 bg-surface-light flex items-center justify-center">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="200px" />
                  ) : (
                    <span className="text-4xl">{item.emoji}</span>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-brand-text text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gold font-playfair text-sm">{formatPrice(item.price)}</span>
                    {item.category && (
                      <span className="text-brand-muted text-xs">{item.category.emoji}</span>
                    )}
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.is_popular && <Badge variant="gold">⭐</Badge>}
                    {item.is_spicy && <Badge variant="crimson">🌶️</Badge>}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 mt-3 pt-2 border-t border-gold/10">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex-1 py-1 rounded text-xs transition-colors ${
                        item.is_available
                          ? 'text-olive-light hover:bg-olive/10'
                          : 'text-red-400 hover:bg-red-900/10'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item)
                        setIsModalOpen(true)
                      }}
                      className="px-2 py-1 text-xs text-brand-muted hover:text-gold transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-2 py-1 text-xs text-brand-muted hover:text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 bg-surface-card border rounded-xl transition-colors ${
                  item.is_available ? 'border-gold/10 hover:border-gold/20' : 'border-red-900/20 opacity-60'
                }`}
              >
                <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="48px" />
                  ) : (
                    <span className="text-2xl">{item.emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-text font-medium text-sm">{item.name}</span>
                    {item.is_popular && <Badge variant="gold">Popular</Badge>}
                    {item.is_spicy && <Badge variant="crimson">Spicy</Badge>}
                  </div>
                  <div className="text-brand-muted text-xs mt-0.5 truncate">{item.description}</div>
                </div>
                <div className="text-gold font-playfair font-bold">{formatPrice(item.price)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      item.is_available
                        ? 'bg-olive/20 text-olive-light'
                        : 'bg-red-900/20 text-red-400'
                    }`}
                  >
                    {item.is_available ? '✓ Available' : '✕ Hidden'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item)
                      setIsModalOpen(true)
                    }}
                    className="p-2 text-brand-muted hover:text-gold transition-colors rounded-lg hover:bg-surface-light"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-brand-muted hover:text-red-400 transition-colors rounded-lg hover:bg-surface-light"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
        }}
        item={editingItem}
        categories={categories}
        onSaved={handleSaved}
      />
    </div>
  )
}
