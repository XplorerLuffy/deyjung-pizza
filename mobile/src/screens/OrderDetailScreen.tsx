import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import { useToast } from '@/components/Toast'
import { Colors } from '@/constants/colors'
import { formatPrice, formatTimeAgo, formatOrderType, formatOrderId } from '@/utils/format'
import type { Order, OrderStatus, RootStackParamList } from '@/types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>
type Route = RouteProp<RootStackParamList, 'OrderDetail'>

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'preparing',
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  new: 'Start Preparing',
  pending: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Complete Order',
}

export default function OrderDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { orderId } = route.params

  const toast = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchOrder = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (!error && data) setOrder(data as Order)
  }, [orderId])

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false))

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => setOrder(payload.new as Order),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchOrder, orderId])

  async function updateStatus(newStatus: OrderStatus) {
    if (!order) return
    const prevStatus = order.status
    setOrder((o) => o ? { ...o, status: newStatus } : o) // optimistic
    setUpdating(true)

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    setUpdating(false)

    if (error) {
      setOrder((o) => o ? { ...o, status: prevStatus } : o) // rollback
      toast.error('Failed to update status — please try again')
    } else if (newStatus === 'completed' || newStatus === 'done') {
      navigation.goBack()
    }
  }

  function handleCancel() {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Cancel Order', style: 'destructive', onPress: () => updateStatus('cancelled') },
      ],
    )
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: Colors.dark }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    )
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: Colors.dark }}>
        <Text style={{ color: Colors.brandMuted }}>Order not found</Text>
      </View>
    )
  }

  const isDineIn = order.order_type === 'dinein' || order.order_type === 'dine_in'
  const items = Array.isArray(order.items) ? order.items : []
  const nextStatus = NEXT_STATUS[order.status]
  const nextLabel = NEXT_LABEL[order.status]
  const isTerminal = order.status === 'completed' || order.status === 'done' || order.status === 'cancelled'

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.dark }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Header card */}
        <View
          className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold" style={{ color: Colors.gold }}>
              {formatOrderId(order)}
            </Text>
            <StatusBadge status={order.status} />
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-base">{isDineIn ? '🪑' : '🥡'}</Text>
            <Text className="font-semibold" style={{ color: Colors.brandText }}>
              {formatOrderType(order.order_type)}
              {isDineIn && order.table_number ? ` · Table ${order.table_number}` : ''}
            </Text>
          </View>

          {order.customer_name && (
            <Text className="text-sm mt-1" style={{ color: Colors.brandMuted }}>
              👤 {order.customer_name}
              {order.customer_phone ? `  📞 ${order.customer_phone}` : ''}
            </Text>
          )}

          <Text className="text-xs mt-2" style={{ color: Colors.brandMuted }}>
            {formatTimeAgo(order.created_at)} · {new Date(order.created_at).toLocaleTimeString()}
          </Text>
        </View>

        {/* Items */}
        <Text className="text-base font-semibold mb-3" style={{ color: Colors.brandText }}>
          Order Items
        </Text>

        <View
          className="rounded-2xl overflow-hidden mb-5"
          style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
        >
          {items.length === 0 ? (
            <Text className="p-5 text-sm" style={{ color: Colors.brandMuted }}>
              No item details available
            </Text>
          ) : (
            items.map((item, idx) => (
              <View
                key={idx}
                className="px-5 py-4"
                style={{
                  borderBottomColor: Colors.border,
                  borderBottomWidth: idx < items.length - 1 ? 1 : 0,
                }}
              >
                <View className="flex-row items-start">
                  {item.emoji ? (
                    <Text className="text-xl mr-3">{item.emoji}</Text>
                  ) : null}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold flex-1" style={{ color: Colors.brandText }}>
                        {item.name}
                      </Text>
                      <Text className="font-bold ml-3" style={{ color: Colors.gold }}>
                        {formatPrice(item.price * (item.qty ?? 1))}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-0.5">
                      <Text className="text-xs" style={{ color: Colors.brandMuted }}>
                        {formatPrice(item.price)} × {item.qty ?? 1}
                      </Text>
                    </View>
                    {item.notes ? (
                      <Text className="text-xs mt-1 italic" style={{ color: '#F59E0B' }}>
                        Note: {item.notes}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Total row */}
          <View
            className="px-5 py-4 flex-row items-center justify-between"
            style={{ borderTopColor: Colors.border, borderTopWidth: 1, backgroundColor: Colors.cardRaised }}
          >
            <Text className="font-semibold" style={{ color: Colors.brandMuted }}>Total</Text>
            <Text className="text-lg font-bold" style={{ color: Colors.gold }}>
              {formatPrice(order.subtotal)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {(order.notes ?? order.customer_note) ? (
          <View
            className="rounded-2xl p-4 mb-5"
            style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
          >
            <Text className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: Colors.brandMuted }}>
              Special Instructions
            </Text>
            <Text className="text-sm" style={{ color: Colors.brandText }}>
              {order.notes ?? order.customer_note}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom action bar */}
      {!isTerminal && (
        <View
          className="absolute bottom-0 left-0 right-0 p-4 gap-3"
          style={{ backgroundColor: Colors.surface, borderTopColor: Colors.border, borderTopWidth: 1 }}
        >
          {nextStatus && nextLabel && (
            <TouchableOpacity
              onPress={() => updateStatus(nextStatus)}
              disabled={updating}
              className="rounded-xl py-4 items-center"
              style={{ backgroundColor: Colors.gold }}
            >
              {updating ? (
                <ActivityIndicator size="small" color={Colors.dark} />
              ) : (
                <Text className="font-bold text-base" style={{ color: Colors.dark }}>
                  {nextLabel}
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleCancel}
            disabled={updating}
            className="rounded-xl py-3 items-center"
            style={{ borderColor: '#EF4444', borderWidth: 1 }}
          >
            <Text className="font-semibold text-sm" style={{ color: '#EF4444' }}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
