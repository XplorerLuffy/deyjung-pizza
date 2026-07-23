export type OrderStatus = 'new' | 'pending' | 'preparing' | 'ready' | 'completed' | 'done' | 'cancelled'
export type OrderType = 'dinein' | 'dine_in' | 'takeaway'

export interface OrderItem {
  item_id?: string
  name: string
  price: number
  qty: number
  emoji?: string
  notes?: string
}

export interface Order {
  id: string
  order_number?: number
  order_type: OrderType
  table_number?: number | null
  customer_name?: string | null
  customer_phone?: string | null
  customer_note?: string | null
  notes?: string | null
  items: OrderItem[]
  subtotal: number
  status: OrderStatus
  created_at: string
  updated_at?: string
}

export type RootStackParamList = {
  Orders: undefined
  OrderDetail: { orderId: string }
  History: undefined
  Settings: undefined
}
