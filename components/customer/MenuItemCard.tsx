'use client'

import React from 'react'
import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { useCart } from '@/lib/hooks/useCart'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils/formatters'

interface MenuItemCardProps {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}

function getCategoryGradient(slug: string | undefined): string {
  switch (slug) {
    case 'pizza':
      return 'from-crimson/30 to-crimson/10'
    case 'mains':
    case 'main':
      return 'from-olive/30 to-olive/10'
    case 'snacks':
    case 'appetizers':
      return 'from-gold/30 to-gold/10'
    case 'drinks':
    case 'beverages':
      return 'from-blue-900/30 to-blue-900/10'
    default:
      return 'from-brand-muted/20 to-brand-muted/5'
  }
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const { items, updateQty, addItem } = useCart()
  const cartItem = items.find((ci) => ci.item_id === item.id)
  const qty = cartItem?.qty ?? 0

  const gradient = getCategoryGradient(item.category?.slug)

  function handleAdd() {
    if (qty === 0) {
      addItem({
        item_id: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        emoji: item.emoji,
      })
    }
    onAdd(item)
  }

  function handleDecrement(e: React.MouseEvent) {
    e.stopPropagation()
    updateQty(item.id, qty - 1)
  }

  function handleIncrement(e: React.MouseEvent) {
    e.stopPropagation()
    updateQty(item.id, qty + 1)
  }

  return (
    <div className="group relative bg-surface-card border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10">
      {/* Image / Emoji area */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl drop-shadow-lg">{item.emoji}</span>
        )}
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_popular && <Badge variant="gold">⭐ Popular</Badge>}
          {item.is_spicy && <Badge variant="crimson">🌶️ Spicy</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair text-brand-text font-semibold text-base mb-1 line-clamp-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-brand-muted text-xs mb-3 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="font-playfair text-gold font-bold text-lg">
            {formatPrice(item.price)}
          </span>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full bg-gold text-dark font-bold text-xl flex items-center justify-center
                hover:bg-gold-light active:bg-gold-dark transition-colors shadow-md hover:shadow-gold/30"
              aria-label={`Add ${item.name} to cart`}
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-full border border-gold/40 text-gold font-bold text-lg flex items-center justify-center
                  hover:bg-gold/10 transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-brand-text font-semibold text-sm w-5 text-center">{qty}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full bg-gold text-dark font-bold text-lg flex items-center justify-center
                  hover:bg-gold-light transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
