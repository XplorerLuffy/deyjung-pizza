'use client'

import React, { useState, useEffect } from 'react'

interface TopBarProps {
  title: string
  onAddItem?: () => void
}

export default function TopBar({ title, onAddItem }: TopBarProps) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    function updateTime() {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-16 bg-surface border-b border-gold/10 flex items-center justify-between px-6">
      <h1 className="font-playfair text-xl text-brand-text">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-brand-muted text-sm font-mono">{time}</div>
        {onAddItem && (
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>
    </header>
  )
}
