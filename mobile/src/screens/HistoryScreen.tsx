import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { supabase } from '@/lib/supabase'
import OrderCard from '@/components/OrderCard'
import { Colors } from '@/constants/colors'
import type { Order, RootStackParamList } from '@/types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>

type Filter = 'today' | 'week'

function startOfDay(d: Date) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

export default function HistoryScreen() {
  const navigation = useNavigation<Nav>()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<Filter>('today')

  const fetchHistory = useCallback(async (f: Filter) => {
    const since = f === 'today'
      ? startOfDay(new Date()).toISOString()
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['completed', 'done', 'cancelled'])
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) setOrders(data as Order[])
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchHistory(filter)
    setRefreshing(false)
  }, [fetchHistory, filter])

  useEffect(() => {
    setLoading(true)
    fetchHistory(filter).finally(() => setLoading(false))
  }, [fetchHistory, filter])

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.dark }}>
      {/* Filter tabs */}
      <View
        className="flex-row px-4 py-3 gap-2"
        style={{ backgroundColor: Colors.surface, borderBottomColor: Colors.border, borderBottomWidth: 1 }}
      >
        {(['today', 'week'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: filter === f ? Colors.gold : Colors.card,
              borderColor: filter === f ? Colors.gold : Colors.border,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: filter === f ? Colors.dark : Colors.brandMuted }}
            >
              {f === 'today' ? 'Today' : 'This Week'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      ) : (
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-32">
              <Text className="text-5xl mb-4">📋</Text>
              <Text className="text-lg font-semibold" style={{ color: Colors.brandText }}>
                No orders {filter === 'today' ? 'today' : 'this week'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}
