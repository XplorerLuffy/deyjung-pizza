import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import OrdersScreen from '@/screens/OrdersScreen'
import OrderDetailScreen from '@/screens/OrderDetailScreen'
import HistoryScreen from '@/screens/HistoryScreen'
import SettingsScreen from '@/screens/SettingsScreen'
import { Colors } from '@/constants/colors'
import type { RootStackParamList } from '@/types'

const Stack = createNativeStackNavigator<RootStackParamList>()

function HeaderRight({ screens }: { screens: Array<{ name: keyof RootStackParamList; label: string }> }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {screens.map(({ name, label }) => (
        <TouchableOpacity key={name} onPress={() => navigation.navigate(name as never)}>
          <Text style={{ color: Colors.gold, fontWeight: '600', fontSize: 14 }}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const screenOptions = {
  headerStyle: { backgroundColor: Colors.surface },
  headerTitleStyle: { color: Colors.brandText, fontWeight: '700' as const },
  headerTintColor: Colors.gold,
  contentStyle: { backgroundColor: Colors.dark },
}

interface Props {
  navRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>
}

export default function RootNavigator({ navRef }: Props) {
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            title: 'DEYJUNG Orders',
            headerRight: () => (
              <HeaderRight
                screens={[
                  { name: 'History', label: 'History' },
                  { name: 'Settings', label: '⚙️' },
                ]}
              />
            ),
          }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: 'Order Details' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Order History' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
