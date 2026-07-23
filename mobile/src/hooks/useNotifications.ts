import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Haptics from 'expo-haptics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import type { Order } from '@/types'
import { formatPrice, formatOrderType, formatOrderId } from '@/utils/format'

const SOUND_KEY = 'deyjung_notif_sound'

async function isSoundEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(SOUND_KEY)
  return val === null ? true : val === 'true'
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function fireOrderNotification(order: Order): Promise<void> {
  const items = Array.isArray(order.items) ? order.items : []
  const itemCount = items.reduce((s, i) => s + (i.qty ?? 1), 0)
  const isDineIn = order.order_type === 'dinein' || order.order_type === 'dine_in'

  const title = isDineIn && order.table_number
    ? `New Order — Table ${order.table_number}`
    : `New Order — ${formatOrderType(order.order_type)}`

  const body = `${itemCount} item${itemCount !== 1 ? 's' : ''} · ${formatPrice(order.subtotal)}`
    + (order.customer_name ? ` · ${order.customer_name}` : '')

  const soundOn = await isSoundEnabled()

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: soundOn ? 'default' : undefined,
      badge: 1,
      data: { orderId: order.id },
    },
    trigger: null, // fire immediately
  })

  // In-app haptic + vibration when foregrounded
  if (AppState.currentState === 'active') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }
}

export function useNotificationTap(
  onTap: (orderId: string) => void,
) {
  const listenerRef = useRef<Notifications.Subscription | null>(null)

  useEffect(() => {
    listenerRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const orderId = response.notification.request.content.data?.orderId as string | undefined
      if (orderId) onTap(orderId)
    })
    return () => { listenerRef.current?.remove() }
  }, [onTap])
}
