'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { CartItem, OrderContext } from '@/lib/types'

interface CartState {
  items: CartItem[]
  orderContext: OrderContext | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { item_id: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_CONTEXT'; payload: OrderContext }
  | { type: 'HYDRATE'; payload: CartState }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.item_id === action.payload.item_id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.item_id === action.payload.item_id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.item_id !== action.payload) }
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.item_id !== action.payload.item_id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.item_id === action.payload.item_id ? { ...i, qty: action.payload.qty } : i
        ),
      }
    }
    case 'CLEAR_CART':
      return { items: [], orderContext: null }
    case 'SET_ORDER_CONTEXT':
      return { ...state, orderContext: action.payload }
    case 'HYDRATE':
      return action.payload
    default:
      return state
  }
}

const initialState: CartState = { items: [], orderContext: null }

interface CartContextValue {
  items: CartItem[]
  orderContext: OrderContext | null
  total: number
  count: number
  addItem: (item: CartItem) => void
  removeItem: (item_id: string) => void
  updateQty: (item_id: string, qty: number) => void
  clearCart: () => void
  setOrderContext: (ctx: OrderContext) => void
}

import React from 'react'

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('deyjung-cart')
      if (stored) {
        const parsed = JSON.parse(stored) as CartState
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem('deyjung-cart', JSON.stringify(state))
    } catch {}
  }, [state])

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), [])
  const removeItem = useCallback((item_id: string) => dispatch({ type: 'REMOVE_ITEM', payload: item_id }), [])
  const updateQty = useCallback((item_id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', payload: { item_id, qty } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const setOrderContext = useCallback((ctx: OrderContext) => dispatch({ type: 'SET_ORDER_CONTEXT', payload: ctx }), [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return React.createElement(
    CartContext.Provider,
    { value: { items: state.items, orderContext: state.orderContext, total, count, addItem, removeItem, updateQty, clearCart, setOrderContext } },
    children
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
