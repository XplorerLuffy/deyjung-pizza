import React from 'react'
import { View, Text } from 'react-native'
import { StatusColors, StatusLabels } from '@/constants/colors'
import type { OrderStatus } from '@/types'

interface Props {
  status: OrderStatus
}

export default function StatusBadge({ status }: Props) {
  const color = StatusColors[status] ?? '#6B7280'
  const label = StatusLabels[status] ?? status

  return (
    <View
      style={{ backgroundColor: color + '25', borderColor: color, borderWidth: 1 }}
      className="px-2.5 py-0.5 rounded-full"
    >
      <Text style={{ color }} className="text-xs font-semibold">
        {label}
      </Text>
    </View>
  )
}
