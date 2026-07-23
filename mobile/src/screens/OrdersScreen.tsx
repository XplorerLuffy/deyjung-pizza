import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { supabase } from '@/lib/supabase'
import OrderCard from '@/components/OrderCard'
import { Colors } from '@/constants/colors'
import { fireOrderNotification, useNotificationTap } from '@/hooks/useNotifications'
import type { Order, OrderStatus, RootStackParamList } from '@/types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Orders'>

const ACTIVE_STATUSES: OrderStatus[] = ['new', 'pending', 'preparing', 'ready']

const STATUS_ORDER: Record<string, number> = {
  new: 0, pending: 0, preparing: 1, ready: 2,
}

function sortOrders(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    const sa = STATUS_ORDER[a.status] ?? 99
    const sb = STATUS_ORDER[b.status] ?? 99
    if (sa !== sb) return sa - sb
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Navigate to order when user taps a notification
  useNotificationTap(useCallback((orderId: string) => {
    navigation.navigate('OrderDetail', { orderId })
  }, [navigation]))

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ACTIVE_STATUSES)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setOrders(sortOrders(data as Order[]))
    }
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }, [fetchOrders])

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false))

    const channel = supabase
      .channel('orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order
            setOrders((prev) => sortOrders([newOrder, ...prev]))
            // Fire notification for every new order
            fireOrderNotification(newOrder).catch(() => null)
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Order
            setOrders((prev) => {
              const filtered = prev.filter((o) => o.id !== updated.id)
              if (ACTIVE_STATUSES.includes(updated.status)) {
                return sortOrders([...filtered, updated])
              }
              return filtered
            })
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== (payload.old as Order).id))
          }
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected')
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setRealtimeStatus('error')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: Colors.dark }}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text className="mt-3 text-sm" style={{ color: Colors.brandMuted }}>
          Loading orders…
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.dark }}>
      {/* Realtime status bar */}
      <View
        className="flex-row items-center gap-2 px-4 py-2"
        style={{ backgroundColor: Colors.surface }}
      >
        <View
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor:
              realtimeStatus === 'connected'
                ? '#22C55E'
                : realtimeStatus === 'error'
                ? '#EF4444'
                : '#F59E0B',
          }}
        />
        <Text className="text-xs" style={{ color: Colors.brandMuted }}>
          {realtimeStatus === 'connected'
            ? 'Live — receiving orders'
            : realtimeStatus === 'error'
            ? 'Realtime disconnected'
            : 'Connecting…'}
        </Text>
        <Text className="text-xs ml-auto font-semibold" style={{ color: Colors.gold }}>
          {orders.length} active
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-32">
            <Text className="text-5xl mb-4">🍕</Text>
            <Text className="text-lg font-semibold" style={{ color: Colors.brandText }}>
              No active orders
            </Text>
            <Text className="text-sm mt-1 text-center" style={{ color: Colors.brandMuted }}>
              New orders will appear here{'\n'}as customers place them
            </Text>
          </View>
        }
      />
    </View>
  )
}
