'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 80%, rgba(139,28,28,0.2), transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(212,175,55,0.1), transparent 50%)',
        }}
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-playfair text-4xl text-gold font-bold mb-1">DEYJUNG</div>
          <div className="text-brand-muted text-sm">Admin Panel</div>
          <div className="h-px w-16 bg-gold/20 mx-auto mt-4" />
        </div>

        {/* Card */}
        <div className="bg-surface border border-gold/20 rounded-2xl p-8">
          <h1 className="font-playfair text-xl text-brand-text mb-6 text-center">Sign In</h1>

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@deyjung.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={loading}
              className="w-full justify-center mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-brand-muted text-xs hover:text-brand-text transition-colors"
            >
              ← Back to restaurant
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
