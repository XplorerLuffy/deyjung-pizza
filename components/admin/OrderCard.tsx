'use client'

import React, { useState } from 'react'
import type { Order, OrderStatus } from '@/lib/types'
import { formatPrice, formatDate, statusColor, statusLabel } from '@/lib/utils/formatters'

interface OrderCardProps {
  order: Order
  onStatusChange: (id: number, status: OrderStatus) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const statusOptions: OrderStatus[] = ['new', 'preparing', 'ready', 'done', 'cancelled']

export default function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true)
    try {
      await onStatusChange(order.id, status)
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    await onDelete(order.id)
  }

  const displayItems = order.items.slice(0, 2)
  const overflowCount = order.items.length - 2

  return (
    <div className="bg-surface-card border border-gold/10 rounded-2xl p-5 hover:border-gold/20 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-brand-text font-semibold">#{order.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
              {statusLabel[order.status]}
            </span>
          </div>
          <div className="text-brand-muted text-xs">
            {formatDate(order.created_at)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-playfair text-gold font-bold">{formatPrice(order.subtotal)}</div>
          <div className="flex items-center gap-1.5 mt-0.5 justify-end">
            <span className="text-xs">{order.order_type === 'dinein' ? '🪑' : '🥡'}</span>
            <span className="text-brand-muted text-xs capitalize">
              {order.order_type === 'dinein' ? `Dine In · T${order.table_number}` : 'Takeaway'}
            </span>
          </div>
        </div>
      </div>

      {/* Customer */}
      {(order.customer_name || order.customer_phone) && (
        <div className="mb-3 py-2 px-3 bg-surface-light rounded-lg text-xs text-brand-muted">
          <span className="font-medium text-brand-text">{order.customer_name}</span>
          {order.customer_phone && <span className="ml-2">· {order.customer_phone}</span>}
        </div>
      )}

      {/* Items */}
      <div className="mb-4 space-y-1">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span>{item.emoji}</span>
            <span className="text-brand-text flex-1">{item.qty}× {item.name}</span>
            <span className="text-brand-muted text-xs">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
        {overflowCount > 0 && (
          <div className="text-brand-muted text-xs pl-6">+{overflowCount} more item{overflowCount > 1 ? 's' : ''}</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gold/10">
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          disabled={updating}
          className="flex-1 bg-surface border border-gold/20 text-brand-text text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold/40"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          className={`px-3 py-2 rounded-lg text-xs transition-colors ${
            confirmDelete
              ? 'bg-red-600 text-white'
              : 'text-red-400 hover:bg-red-900/20'
          }`}
        >
          {confirmDelete ? 'Confirm?' : '🗑️'}
        </button>
      </div>
    </div>
  )
}
