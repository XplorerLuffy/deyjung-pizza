'use client'

import React, { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/admin/TopBar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'

interface Settings {
  restaurant_name?: string
  whatsapp_number?: string
  daily_fixed_costs?: string
  opening_hours?: string
  address?: string
  tagline?: string
}

export default function SettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Password change
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json() as Settings
      setSettings({
        restaurant_name: 'DEYJUNG Restro & Pizzeria',
        whatsapp_number: '17723849',
        daily_fixed_costs: '0',
        opening_hours: 'Mon–Sun 11AM–10PM',
        address: 'Gelephu Mindfulness City, Bhutan',
        tagline: 'Where Bhutanese Flavors Meet Italian Fire',
        ...data,
      })
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange() {
    if (!newPassword) {
      toast.error('Enter a new password')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setChangingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password changed successfully!')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Settings" />
        <div className="flex-1 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Settings" />
      <main className="flex-1 p-6 max-w-2xl space-y-6">
        {/* Restaurant Info */}
        <div className="bg-surface-card border border-gold/10 rounded-2xl p-6">
          <h2 className="font-playfair text-lg text-brand-text mb-4">Restaurant Info</h2>
          <div className="space-y-4">
            <Input
              label="Restaurant Name"
              value={settings.restaurant_name ?? ''}
              onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
            />
            <Input
              label="Tagline"
              value={settings.tagline ?? ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
            <Input
              label="Address"
              value={settings.address ?? ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
            <Input
              label="Opening Hours"
              value={settings.opening_hours ?? ''}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
            />
          </div>
        </div>

        {/* Ordering */}
        <div className="bg-surface-card border border-gold/10 rounded-2xl p-6">
          <h2 className="font-playfair text-lg text-brand-text mb-4">Ordering</h2>
          <div className="space-y-4">
            <Input
              label="WhatsApp Number (with country code)"
              placeholder="97517000000"
              value={settings.whatsapp_number ?? ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            />
            <Input
              label="Daily Fixed Costs (Nu.)"
              type="number"
              placeholder="0"
              value={settings.daily_fixed_costs ?? ''}
              onChange={(e) => setSettings({ ...settings, daily_fixed_costs: e.target.value })}
            />
          </div>
        </div>

        <Button variant="gold" size="lg" loading={saving} onClick={handleSave}>
          Save Settings
        </Button>

        {/* Password Change */}
        <div className="bg-surface-card border border-gold/10 rounded-2xl p-6">
          <h2 className="font-playfair text-lg text-brand-text mb-4">Change Password</h2>
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="outline-gold" loading={changingPassword} onClick={handlePasswordChange}>
              Change Password
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
