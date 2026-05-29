import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem, CartItemCustomization, MenuItem } from '../types';
import { TOPPINGS } from '../types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number; customization: CartItemCustomization } }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

function computeUnitPrice(basePrice: number, customization: CartItemCustomization): number {
  const sizePrice = Math.round(basePrice * customization.sizeMultiplier);
  const toppingsPrice = customization.toppings.reduce((sum, toppingName) => {
    const topping = TOPPINGS.find((t) => t.name === toppingName);
    return sum + (topping?.price ?? 0);
  }, 0);
  return sizePrice + toppingsPrice;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, customization } = action.payload;
      const unitPrice = computeUnitPrice(menuItem.basePrice, customization);
      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        categorySlug: menuItem.category.slug,
        basePrice: menuItem.basePrice,
        quantity,
        customization,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
      return { items: [...state.items, newItem] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.id !== action.payload.cartItemId) };
    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.id !== cartItemId) };
      }
      return {
        items: state.items.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  gst: number;
  total: number;
  addItem: (menuItem: MenuItem, quantity: number, customization: CartItemCustomization) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'deyjung_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const addItem = useCallback(
    (menuItem: MenuItem, quantity: number, customization: CartItemCustomization) => {
      dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, customization } });
    },
    []
  );

  const removeItem = useCallback((cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <CartContext.Provider
      value={{ items: state.items, totalItems, subtotal, gst, total, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
