'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Order, OrderStatus } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface UseOrdersOptions {
  onNewOrder?: (order: Order) => void
  statusFilter?: OrderStatus | 'all'
}

interface UseOrdersReturn {
  orders: Order[]
  loading: boolean
  refetch: () => void
  updateStatus: (id: number, status: OrderStatus) => Promise<void>
  deleteOrder: (id: number) => Promise<void>
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const onNewOrderRef = useRef(options.onNewOrder)
  onNewOrderRef.current = options.onNewOrder

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const url = options.statusFilter && options.statusFilter !== 'all'
        ? `/api/orders?status=${options.statusFilter}`
        : '/api/orders'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json() as Order[]
      setOrders(data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [options.statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order
          setOrders((prev) => [newOrder, ...prev])
          if (onNewOrderRef.current) onNewOrderRef.current(newOrder)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as Order
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const updateStatus = useCallback(async (id: number, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update order status')
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }, [])

  const deleteOrder = useCallback(async (id: number) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete order')
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }, [])

  return { orders, loading, refetch: fetchOrders, updateStatus, deleteOrder }
}
