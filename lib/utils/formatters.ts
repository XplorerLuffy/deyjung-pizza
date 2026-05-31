export const formatPrice = (p: number) => `Nu. ${p.toFixed(0)}`

export const formatDate = (d: string) =>
  new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

export const statusColor: Record<string, string> = {
  new: 'bg-gold/20 text-gold',
  preparing: 'bg-crimson/20 text-crimson-light',
  ready: 'bg-olive/20 text-olive-light',
  done: 'bg-brand-muted/20 text-brand-muted',
  cancelled: 'bg-red-900/20 text-red-400',
}

export const statusLabel: Record<string, string> = {
  new: 'New',
  preparing: 'Preparing',
  ready: 'Ready',
  done: 'Done',
  cancelled: 'Cancelled',
}
