export function formatPrice(amount: number): string {
  return `Nu. ${amount.toLocaleString('en-IN')}`
}

export function formatTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return new Date(dateStr).toLocaleDateString()
}

export function formatOrderType(type: string): string {
  if (type === 'dinein' || type === 'dine_in') return 'Dine In'
  return 'Takeaway'
}

export function formatOrderId(order: { order_number?: number; id: string }): string {
  return order.order_number ? `#${order.order_number}` : `#${order.id.slice(-4).toUpperCase()}`
}
