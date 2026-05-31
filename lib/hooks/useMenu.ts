'use client'

import { useState, useEffect } from 'react'
import type { MenuItem, Category } from '@/lib/types'

interface UseMenuReturn {
  menu: MenuItem[]
  categories: Category[]
  loading: boolean
  error: string | null
  getByCategory: (slug: string | null) => MenuItem[]
}

export function useMenu(): UseMenuReturn {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchMenu() {
      try {
        setLoading(true)
        const res = await fetch('/api/menu')
        if (!res.ok) throw new Error('Failed to fetch menu')
        const data = await res.json() as { items: MenuItem[]; categories: Category[] }
        if (!cancelled) {
          setMenu(data.items || [])
          setCategories(data.categories || [])
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchMenu()
    return () => { cancelled = true }
  }, [])

  function getByCategory(slug: string | null): MenuItem[] {
    if (!slug || slug === 'all') return menu
    return menu.filter((item) => item.category?.slug === slug)
  }

  return { menu, categories, loading, error, getByCategory }
}
