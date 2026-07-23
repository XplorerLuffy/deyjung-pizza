import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import StatusBadge from './StatusBadge'
import { formatPrice, formatTimeAgo, formatOrderType, formatOrderId } from '@/utils/format'
import { Colors } from '@/constants/colors'
import type { Order } from '@/types'

interface Props {
  order: Order
  onPress: () => void
}

export default function OrderCard({ order, onPress }: Props) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(order.created_at))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo(formatTimeAgo(order.created_at))
    }, 30_000)
    return () => clearInterval(timer)
  }, [order.created_at])

  const itemCount = Array.isArray(order.items) ? order.items.reduce((s, i) => s + (i.qty ?? 1), 0) : 0
  const isDineIn = order.order_type === 'dinein' || order.order_type === 'dine_in'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="rounded-2xl mb-3 overflow-hidden"
      style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
    >
      {/* Gold top accent for new/pending */}
      {(order.status === 'new' || order.status === 'pending') && (
        <View className="h-0.5" style={{ backgroundColor: Colors.gold }} />
      )}

      <View className="p-4">
        {/* Row 1: order id + status badge */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-bold" style={{ color: Colors.gold }}>
            {formatOrderId(order)}
          </Text>
          <StatusBadge status={order.status} />
        </View>

        {/* Row 2: type + table / customer */}
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-lg">{isDineIn ? '🪑' : '🥡'}</Text>
          <Text className="text-sm font-semibold" style={{ color: Colors.brandText }}>
            {formatOrderType(order.order_type)}
            {isDineIn && order.table_number ? ` · Table ${order.table_number}` : ''}
          </Text>
          {order.customer_name ? (
            <Text className="text-sm ml-auto" style={{ color: Colors.brandMuted }}>
              {order.customer_name}
            </Text>
          ) : null}
        </View>

        {/* Row 3: item count + total + time */}
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-sm" style={{ color: Colors.brandMuted }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
          <Text className="text-base font-bold font-playfair" style={{ color: Colors.brandText }}>
            {formatPrice(order.subtotal)}
          </Text>
        </View>

        <Text className="text-xs mt-1" style={{ color: Colors.brandMuted }}>
          {timeAgo}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
