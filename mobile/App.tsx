import './global.css'
import React, { useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Notifications from 'expo-notifications'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainerRef } from '@react-navigation/native'
import RootNavigator from '@/navigation/RootNavigator'
import { ToastProvider } from '@/components/Toast'
import { requestNotificationPermission } from '@/hooks/useNotifications'
import type { RootStackParamList } from '@/types'

// Show alerts even when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function App() {
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null)

  useEffect(() => {
    // Ask for permission
    requestNotificationPermission()

    // Handle tap when app was killed/backgrounded
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const orderId = response?.notification.request.content.data?.orderId as string | undefined
      if (orderId) {
        // Slight delay so navigator is mounted
        setTimeout(() => {
          navRef.current?.navigate('OrderDetail', { orderId })
        }, 500)
      }
    })

    // Clear badge when app opens
    Notifications.setBadgeCountAsync(0)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ToastProvider>
        <RootNavigator navRef={navRef} />
      </ToastProvider>
    </GestureHandlerRootView>
  )
}
