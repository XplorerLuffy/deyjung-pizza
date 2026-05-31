'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RestaurantTable } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface UseTablesReturn {
  tables: RestaurantTable[]
  loading: boolean
  updateTable: (id: number, status: RestaurantTable['status'], guestName?: string) => Promise<void>
}

export function useTables(): UseTablesReturn {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables')
      if (!res.ok) throw new Error('Failed to fetch tables')
      const data = await res.json() as RestaurantTable[]
      setTables(data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('tables-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'restaurant_tables' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as RestaurantTable
            setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const updateTable = useCallback(
    async (id: number, status: RestaurantTable['status'], guestName?: string) => {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, guest_name: guestName ?? null }),
      })
      if (!res.ok) throw new Error('Failed to update table')
      setTables((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, guest_name: guestName ?? null } : t
        )
      )
    },
    []
  )

  return { tables, loading, updateTable }
}
