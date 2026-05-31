'use client'

import React, { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTables } from '@/lib/hooks/useTables'
import { useToast } from '@/components/ui/Toast'
import type { RestaurantTable } from '@/lib/types'

interface TableEditState {
  id: number
  status: RestaurantTable['status']
  guestName: string
}

export default function TablesPage() {
  const toast = useToast()
  const { tables, loading, updateTable } = useTables()
  const [editState, setEditState] = useState<TableEditState | null>(null)
  const [saving, setSaving] = useState(false)

  function openEdit(table: RestaurantTable) {
    setEditState({
      id: table.id,
      status: table.status,
      guestName: table.guest_name ?? '',
    })
  }

  async function handleSaveTable() {
    if (!editState) return
    setSaving(true)
    try {
      await updateTable(editState.id, editState.status, editState.guestName || undefined)
      toast.success(`Table ${editState.id} updated`)
      setEditState(null)
    } catch {
      toast.error('Failed to update table')
    } finally {
      setSaving(false)
    }
  }

  async function handleResetAll() {
    if (!confirm('Reset all tables to Available? This will remove all guest names.')) return
    const displayTables = tables.length > 0
      ? tables
      : Array.from({ length: 6 }, (_, i) => ({ id: i + 1, status: 'available' as const, guest_name: null, updated_at: '' }))

    for (const table of displayTables) {
      try {
        await updateTable(table.id, 'available', undefined)
      } catch {
        // Continue with others
      }
    }
    toast.success('All tables reset to available')
  }

  const tableColorMap: Record<RestaurantTable['status'], string> = {
    available: 'bg-olive/10 border-olive/30 hover:border-olive/50',
    occupied: 'bg-crimson/10 border-crimson/30 hover:border-crimson/50',
    reserved: 'bg-gold/10 border-gold/30 hover:border-gold/50',
  }

  const tableTextMap: Record<RestaurantTable['status'], string> = {
    available: 'text-olive-light',
    occupied: 'text-crimson-light',
    reserved: 'text-gold',
  }

  const displayTables = tables.length > 0
    ? tables
    : Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        status: 'available' as const,
        guest_name: null,
        updated_at: new Date().toISOString(),
      }))

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Table Management" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6 text-sm text-brand-muted">
            {(['available', 'occupied', 'reserved'] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    s === 'available' ? 'bg-olive' : s === 'occupied' ? 'bg-crimson' : 'bg-gold'
                  }`}
                />
                <span className="capitalize">{s}</span>
              </div>
            ))}
          </div>
          <Button variant="outline-gold" size="sm" onClick={handleResetAll}>
            Reset All Tables
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 bg-surface-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayTables.map((table) => (
              <button
                key={table.id}
                onClick={() => openEdit(table)}
                className={`
                  p-6 rounded-2xl border-2 text-left transition-all
                  ${tableColorMap[table.status]}
                  hover:-translate-y-0.5 hover:shadow-lg
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">🪑</div>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${tableTextMap[table.status]}`}>
                    {table.status}
                  </div>
                </div>
                <div className={`font-playfair text-xl font-bold ${tableTextMap[table.status]}`}>
                  Table {table.id}
                </div>
                {table.guest_name && (
                  <div className="text-brand-muted text-xs mt-1 truncate">
                    👤 {table.guest_name}
                  </div>
                )}
                <div className="text-brand-muted text-xs mt-2 opacity-60">
                  Click to manage
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Edit Table Modal */}
      <Modal
        isOpen={!!editState}
        onClose={() => setEditState(null)}
        title={`Manage Table ${editState?.id}`}
        size="sm"
      >
        {editState && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-brand-muted mb-3 font-medium">Status</p>
              <div className="grid grid-cols-3 gap-2">
                {(['available', 'occupied', 'reserved'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setEditState({ ...editState, status: s })}
                    className={`py-2.5 rounded-lg border text-xs font-medium capitalize transition-all ${
                      editState.status === s
                        ? s === 'available'
                          ? 'border-olive bg-olive/20 text-olive-light'
                          : s === 'occupied'
                            ? 'border-crimson bg-crimson/20 text-crimson-light'
                            : 'border-gold bg-gold/20 text-gold'
                        : 'border-gold/20 text-brand-muted hover:border-gold/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Guest Name (optional)"
              placeholder="e.g. Jigme Wangchuck"
              value={editState.guestName}
              onChange={(e) => setEditState({ ...editState, guestName: e.target.value })}
            />

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 justify-center" onClick={() => setEditState(null)}>
                Cancel
              </Button>
              <Button variant="gold" className="flex-1 justify-center" loading={saving} onClick={handleSaveTable}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
