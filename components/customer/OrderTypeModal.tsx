'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useCart } from '@/lib/hooks/useCart'
import { useToast } from '@/components/ui/Toast'
import type { OrderContext, RestaurantTable } from '@/lib/types'

interface OrderTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderTypeModal({ isOpen, onClose }: OrderTypeModalProps) {
  const { setOrderContext } = useCart()
  const toast = useToast()

  const [orderType, setOrderType] = useState<'dinein' | 'takeaway'>('dinein')
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      fetch('/api/tables')
        .then((r) => r.json())
        .then((data: RestaurantTable[]) => setTables(data))
        .catch(() => {})
    }
  }, [isOpen])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!customerName.trim()) errs.name = 'Name is required'
    if (!customerPhone.trim()) errs.phone = 'Phone number is required'
    if (orderType === 'dinein' && !selectedTable) errs.table = 'Please select a table'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleConfirm() {
    if (!validate()) return

    const ctx: OrderContext = {
      type: orderType,
      tableNumber: orderType === 'dinein' ? selectedTable ?? undefined : undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
    }

    setOrderContext(ctx)
    toast.success('Order details saved! Browse the menu and add items.')
    onClose()

    // Smooth scroll to menu
    setTimeout(() => {
      const menuSection = document.getElementById('menu')
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  // Generate placeholder tables if none exist
  const displayTables: RestaurantTable[] = tables.length > 0
    ? tables
    : Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        status: 'available' as const,
        guest_name: null,
        updated_at: new Date().toISOString(),
      }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How would you like to order?" size="md">
      <div className="space-y-6">
        {/* Order type selection */}
        <div className="grid grid-cols-2 gap-4">
          {(['dinein', 'takeaway'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`
                p-5 rounded-xl border-2 text-center transition-all duration-200
                ${orderType === type
                  ? 'border-gold bg-gold/10 text-brand-text'
                  : 'border-gold/20 text-brand-muted hover:border-gold/40 hover:text-brand-text'
                }
              `}
            >
              <div className="text-3xl mb-2">{type === 'dinein' ? '🪑' : '🥡'}</div>
              <div className="font-semibold">{type === 'dinein' ? 'Dine In' : 'Takeaway'}</div>
              <div className="text-xs mt-1 opacity-70">
                {type === 'dinein' ? 'Eat at the restaurant' : 'Take your food home'}
              </div>
            </button>
          ))}
        </div>

        {/* Table selection for dine-in */}
        {orderType === 'dinein' && (
          <div>
            <p className="text-sm text-brand-muted mb-3 font-medium">Select a table:</p>
            <div className="grid grid-cols-3 gap-3">
              {displayTables.map((table) => {
                const isOccupied = table.status === 'occupied'
                const isSelected = selectedTable === table.id
                return (
                  <button
                    key={table.id}
                    onClick={() => !isOccupied && setSelectedTable(table.id)}
                    disabled={isOccupied}
                    className={`
                      py-3 rounded-lg border text-sm font-medium transition-all
                      ${isOccupied
                        ? 'border-red-900/40 bg-red-900/10 text-red-600 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'border-gold bg-gold/20 text-gold'
                          : 'border-gold/20 text-brand-muted hover:border-gold/40 hover:text-brand-text'
                      }
                    `}
                  >
                    🪑 Table {table.id}
                    {isOccupied && <div className="text-xs mt-0.5">Occupied</div>}
                  </button>
                )
              })}
            </div>
            {errors.table && <p className="text-red-400 text-xs mt-2">{errors.table}</p>}
          </div>
        )}

        {/* Customer details */}
        <div className="space-y-3">
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Phone Number"
            placeholder="+975 17 XXX XXX"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            error={errors.phone}
          />
        </div>

        {/* Confirm button */}
        <Button variant="gold" size="lg" className="w-full justify-center" onClick={handleConfirm}>
          Confirm & Browse Menu →
        </Button>
      </div>
    </Modal>
  )
}
