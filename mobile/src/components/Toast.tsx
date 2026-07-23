import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Animated, Text, View } from 'react-native'
import { Colors } from '@/constants/colors'

interface ToastMsg { message: string; type: 'success' | 'error' }

interface ToastContextValue {
  success: (msg: string) => void
  error: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({ success: () => {}, error: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMsg | null>(null)
  const opacity = useRef(new Animated.Value(0)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((message: string, type: 'success' | 'error') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type })
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setToast(null)
      })
    }, 3000)
  }, [opacity])

  const success = useCallback((msg: string) => show(msg, 'success'), [show])
  const error = useCallback((msg: string) => show(msg, 'error'), [show])

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      {toast && (
        <Animated.View
          style={{
            opacity,
            position: 'absolute',
            bottom: 96,
            left: 20,
            right: 20,
            zIndex: 999,
            backgroundColor: toast.type === 'error' ? '#EF4444' : Colors.gold,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{ color: toast.type === 'error' ? '#fff' : Colors.dark, fontWeight: '600', fontSize: 14 }}>
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}
