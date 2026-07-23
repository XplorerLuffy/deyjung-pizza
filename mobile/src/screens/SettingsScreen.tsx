import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { Colors } from '@/constants/colors'

const SOUND_KEY = 'deyjung_notif_sound'

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [pinging, setPinging] = useState(false)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    AsyncStorage.getItem(SOUND_KEY).then((val) => {
      if (val !== null) setSoundEnabled(val === 'true')
    })

    const channel = supabase
      .channel('settings-ping')
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected')
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setRealtimeStatus('error')
      })
    channelRef.current = channel

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function toggleSound(val: boolean) {
    setSoundEnabled(val)
    await AsyncStorage.setItem(SOUND_KEY, String(val))
  }

  async function handleRefresh() {
    setPinging(true)
    const { error } = await supabase.from('orders').select('id').limit(1)
    setPinging(false)
    if (error) {
      Alert.alert('Connection Error', error.message)
    } else {
      Alert.alert('Success', 'Connected to Supabase ✓')
    }
  }

  const statusColor =
    realtimeStatus === 'connected' ? '#22C55E' : realtimeStatus === 'error' ? '#EF4444' : '#F59E0B'

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: Colors.dark }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Connection Status */}
      <View
        className="rounded-2xl p-5 mb-5"
        style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
      >
        <Text className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: Colors.brandMuted }}>
          Connection
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-semibold" style={{ color: Colors.brandText }}>
            Realtime Status
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <Text className="text-sm font-semibold capitalize" style={{ color: statusColor }}>
              {realtimeStatus}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRefresh}
          disabled={pinging}
          className="rounded-xl py-3 items-center"
          style={{ backgroundColor: Colors.cardRaised, borderColor: Colors.border, borderWidth: 1 }}
        >
          {pinging ? (
            <ActivityIndicator size="small" color={Colors.gold} />
          ) : (
            <Text className="font-semibold" style={{ color: Colors.gold }}>
              Test Connection
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View
        className="rounded-2xl p-5 mb-5"
        style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
      >
        <Text className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: Colors.brandMuted }}>
          Notifications
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="font-semibold" style={{ color: Colors.brandText }}>
              Notification Sound
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: Colors.brandMuted }}>
              Play sound when new order arrives
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: Colors.border, true: Colors.goldDim }}
            thumbColor={soundEnabled ? Colors.gold : Colors.brandMuted}
          />
        </View>
      </View>

      {/* App info */}
      <View
        className="rounded-2xl p-5"
        style={{ backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1 }}
      >
        <Text className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: Colors.brandMuted }}>
          About
        </Text>
        <Text className="text-lg font-bold mb-1" style={{ color: Colors.gold }}>
          DEYJUNG Orders
        </Text>
        <Text className="text-sm" style={{ color: Colors.brandMuted }}>
          Restaurant order management app{'\n'}for DEYJUNG Restro & Pizzeria
        </Text>
        <Text className="text-xs mt-3" style={{ color: Colors.brandMuted }}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  )
}
