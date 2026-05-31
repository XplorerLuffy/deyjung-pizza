'use client'

import React, { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/admin/TopBar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import type { Category } from '@/lib/types'

interface CategoryWithCount extends Category {
  item_count: Array<{ count: number }>
}

export default function CategoriesPage() {
  const toast = useToast()
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newEmoji, setNewEmoji] = useState('🍽️')
  const [adding, setAdding] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json() as CategoryWithCount[]
      setCategories(data)
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleAdd() {
    if (!newName.trim()) {
      toast.error('Category name is required')
      return
    }
    setAdding(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          slug: newSlug.trim() || generateSlug(newName.trim()),
          emoji: newEmoji || null,
          sort_order: categories.length,
        }),
      })
      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error || 'Failed')
      }
      const created = await res.json() as CategoryWithCount
      setCategories([...categories, { ...created, item_count: [{ count: 0 }] }])
      setNewName('')
      setNewSlug('')
      setNewEmoji('🍽️')
      toast.success(`Category "${created.name}" added!`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(cat: CategoryWithCount) {
    const count = cat.item_count?.[0]?.count ?? 0
    if (count > 0) {
      toast.error(`Cannot delete "${cat.name}" — it has ${count} menu item${count > 1 ? 's' : ''}. Move items first.`)
      return
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return

    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setCategories(categories.filter((c) => c.id !== cat.id))
      toast.success(`Category "${cat.name}" deleted`)
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Categories" />
      <main className="flex-1 p-6 max-w-2xl">
        {/* Add category form */}
        <div className="bg-surface-card border border-gold/10 rounded-2xl p-6 mb-6">
          <h2 className="font-playfair text-lg text-brand-text mb-4">Add Category</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              label="Name"
              placeholder="e.g. Pizza"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                if (!newSlug) setNewSlug(generateSlug(e.target.value))
              }}
            />
            <Input
              label="Emoji"
              placeholder="🍕"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
            />
          </div>
          <Input
            label="Slug (URL-friendly)"
            placeholder="pizza"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="mb-4"
          />
          <Button variant="gold" loading={adding} onClick={handleAdd}>
            + Add Category
          </Button>
        </div>

        {/* Category list */}
        <div className="bg-surface-card border border-gold/10 rounded-2xl p-6">
          <h2 className="font-playfair text-lg text-brand-text mb-4">Categories</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-surface-light rounded-xl animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">
              <div className="text-4xl mb-2">🏷️</div>
              <p>No categories yet. Add one above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => {
                const count = cat.item_count?.[0]?.count ?? 0
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 p-3 bg-surface-light rounded-xl hover:bg-surface hover:border hover:border-gold/10 transition-all"
                  >
                    <span className="text-2xl w-10 text-center">{cat.emoji || '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-text font-medium text-sm">{cat.name}</p>
                      <p className="text-brand-muted text-xs">/{cat.slug}</p>
                    </div>
                    <div className="text-brand-muted text-xs px-2 py-1 bg-surface rounded-lg">
                      {count} item{count !== 1 ? 's' : ''}
                    </div>
                    <button
                      onClick={() => handleDelete(cat)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        count > 0
                          ? 'text-brand-muted/30 cursor-not-allowed'
                          : 'text-brand-muted hover:text-red-400 hover:bg-red-900/10'
                      }`}
                      disabled={count > 0}
                      title={count > 0 ? 'Move items first' : 'Delete category'}
                    >
                      🗑️
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
