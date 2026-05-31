import type { CartItem, OrderContext } from '@/lib/types'

export function buildWhatsAppMessage(items: CartItem[], total: number, ctx: OrderContext): string {
  const typeStr =
    ctx.type === 'dinein'
      ? `📍 *Dine In* | Table ${ctx.tableNumber}`
      : '🥡 *Takeaway*'
  const itemLines = items
    .map((i) => `${i.emoji} ${i.qty}× ${i.name} — Nu. ${(i.price * i.qty).toFixed(0)}`)
    .join('\n')

  return [
    '🍕 *DEYJUNG ORDER*',
    '━━━━━━━━━━━━━━━━━━',
    typeStr,
    `👤 ${ctx.customerName}`,
    `📞 ${ctx.customerPhone}`,
    '━━━━━━━━━━━━━━━━━━',
    itemLines,
    '━━━━━━━━━━━━━━━━━━',
    `💰 *TOTAL: Nu. ${total.toFixed(0)}*`,
    '━━━━━━━━━━━━━━━━━━',
    '_Sent via DEYJUNG Online Order_',
  ].join('\n')
}

export function openWhatsApp(message: string, number: string) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
