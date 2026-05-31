'use client'

import React, { useEffect } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatters'
import { buildWhatsAppMessage, openWhatsApp } from '@/lib/utils/whatsapp'
import { useToast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, orderContext, total, updateQty, removeItem, clearCart } = useCart()
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const gst = total * 0.05
  const grandTotal = total + gst

  async function handleWhatsAppOrder() {
    if (!orderContext) {
      toast.error('Please set your order details first (name, phone, type)')
      return
    }
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    const message = buildWhatsAppMessage(items, grandTotal, orderContext)
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '97517000000'

    // Save order to DB
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: orderContext.customerName,
          customer_phone: orderContext.customerPhone,
          order_type: orderContext.type,
          table_number: orderContext.tableNumber ?? null,
          items: items,
          subtotal: grandTotal,
          status: 'new',
        }),
      })
    } catch {
      // Continue even if DB save fails
    }

    openWhatsApp(message, waNumber)
    clearCart()
    onClose()
    toast.success('Order sent via WhatsApp! 🎉')
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/70 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface border-l border-gold/20 flex flex-col
          transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/10">
          <h2 className="font-playfair text-xl text-brand-text">Your Order</h2>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text transition-colors p-1"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        {/* Order Context Info */}
        {orderContext && (
          <div className="px-6 py-3 bg-surface-light border-b border-gold/10">
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <span>{orderContext.type === 'dinein' ? '🪑' : '🥡'}</span>
              <span className="capitalize">{orderContext.type === 'dinein' ? 'Dine In' : 'Takeaway'}</span>
              {orderContext.type === 'dinein' && orderContext.tableNumber && (
                <span className="text-gold">· Table {orderContext.tableNumber}</span>
              )}
              <span className="ml-auto text-brand-text">{orderContext.customerName}</span>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-muted">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-1">Add some delicious items!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.item_id} className="flex items-center gap-3 py-2 border-b border-gold/10 last:border-0">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-text text-sm font-medium truncate">{item.name}</p>
                    <p className="text-gold text-xs font-playfair">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.item_id, item.qty - 1)}
                      className="w-6 h-6 rounded-full border border-gold/30 text-gold text-xs flex items-center justify-center hover:bg-gold/10"
                    >
                      −
                    </button>
                    <span className="text-brand-text text-sm w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.item_id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-gold text-dark text-xs flex items-center justify-center hover:bg-gold-light"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-brand-text text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                    <button
                      onClick={() => removeItem(item.item_id)}
                      className="text-red-400 text-xs hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gold/10">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-muted">
                <span>GST (5%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between font-playfair text-lg text-gold font-bold pt-2 border-t border-gold/20">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* WhatsApp Button */}
            <Button
              variant="gold"
              size="lg"
              className="w-full justify-center !bg-[#25D366] !text-white hover:!bg-[#128C7E]"
              onClick={handleWhatsAppOrder}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </Button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full mt-2 text-brand-muted text-xs hover:text-red-400 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
