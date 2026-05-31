export interface Category {
  id: string
  name: string
  slug: string
  emoji: string | null
  sort_order: number
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  emoji: string
  image_url: string | null
  is_popular: boolean
  is_spicy: boolean
  is_available: boolean
  sort_order: number
  category?: Category
}

export interface OrderItem {
  item_id: string
  name: string
  price: number
  qty: number
  emoji: string
}

export interface Order {
  id: number
  customer_name: string | null
  customer_phone: string | null
  order_type: 'dinein' | 'takeaway'
  table_number: number | null
  items: OrderItem[]
  subtotal: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'done' | 'cancelled'

export interface RestaurantTable {
  id: number
  status: 'available' | 'occupied' | 'reserved'
  guest_name: string | null
  updated_at: string
}

export type CartItem = OrderItem

export interface OrderContext {
  type: 'dinein' | 'takeaway'
  tableNumber?: number
  customerName: string
  customerPhone: string
}

export interface Settings {
  [key: string]: string
}
