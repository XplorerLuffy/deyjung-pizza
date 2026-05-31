'use client'

import React, { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import OrderCard from '@/components/admin/OrderCard'
import { useOrders } from '@/lib/hooks/useOrders'
import { useToast } from '@/components/ui/Toast'
import type { OrderStatus } from '@/lib/types'
import { statusLabel } from '@/lib/utils/formatters'

const statusFilters: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const toast = useToast()
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const { orders, loading, updateStatus, deleteOrder } = useOrders({
    onNewOrder: (order) => {
      toast.info(`New order #${order.id} received!`)
    },
  })

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    const matchesSearch =
      !search ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search)
    return matchesStatus && matchesSearch
  })

  async function handleStatusChange(id: number, status: OrderStatus) {
    try {
      await updateStatus(id, status)
      toast.success(`Order #${id} status updated to ${statusLabel[status]}`)
    } catch {
      toast.error('Failed to update order status')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteOrder(id)
      toast.success(`Order #${id} deleted`)
    } catch {
      toast.error('Failed to delete order')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Orders" />
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f.value
                    ? 'bg-gold text-dark'
                    : 'bg-surface text-brand-muted hover:text-brand-text hover:bg-surface-light'
                }`}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({orders.filter((o) => o.status === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <input
            placeholder="Search by name or #ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:ml-auto px-4 py-2 bg-surface border border-gold/20 rounded-lg text-brand-text text-sm focus:outline-none focus:border-gold/40 w-full sm:w-64"
          />
        </div>

        {/* Orders grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-surface-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-brand-muted">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg">No orders found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
