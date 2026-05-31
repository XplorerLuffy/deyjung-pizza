'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '📋', label: 'Orders', href: '/admin/orders' },
  { icon: '🍽️', label: 'Menu', href: '/admin/menu' },
  { icon: '🪑', label: 'Tables', href: '/admin/tables' },
  { icon: '🏷️', label: 'Categories', href: '/admin/categories' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
]

interface SidebarProps {
  userEmail?: string | null
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gold/10 flex flex-col z-20">
      {/* Logo */}
      <div className="p-6 border-b border-gold/10">
        <div className="font-playfair text-2xl text-gold font-bold">DEYJUNG</div>
        <div className="text-brand-muted text-xs mt-0.5">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'text-gold bg-gold/10 border-l-2 border-gold'
                  : 'text-brand-muted hover:text-brand-text hover:bg-surface-light'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gold/10">
        {userEmail && (
          <div className="text-brand-muted text-xs mb-3 px-2 truncate">{userEmail}</div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
