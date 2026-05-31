import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  trend?: {
    value: number
    label: string
  }
}

export default function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="bg-surface-card border border-gold/10 rounded-2xl p-6 hover:border-gold/20 transition-colors relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-brand-muted text-sm mb-1">{title}</p>
          <p className="font-playfair text-3xl text-brand-text font-bold">{value}</p>
          {subtitle && <p className="text-brand-muted text-xs mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.value >= 0 ? 'text-olive-light' : 'text-red-400'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}
