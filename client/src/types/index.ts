export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

export interface Size {
  label: string;
  multiplier: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  sizes: Size[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isBestseller: boolean;
  isNew: boolean;
  category: {
    name: string;
    icon: string;
    slug: string;
  };
}

export interface CartItemCustomization {
  size: string;
  sizeMultiplier: number;
  toppings: string[];
  spiceLevel: string;
  specialInstructions: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItemId: number;
  name: string;
  categorySlug: string;
  basePrice: number;
  quantity: number;
  customization: CartItemCustomization;
  unitPrice: number; // basePrice * sizeMultiplier + toppings cost
  totalPrice: number; // unitPrice * quantity
}

export interface OrderSummary {
  subtotal: number;
  gst: number;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  total: number;
  paymentMethod: string;
  specialInstructions: string;
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';

export interface Topping {
  name: string;
  price: number;
}

export const TOPPINGS: Topping[] = [
  { name: 'Extra Cheese', price: 50 },
  { name: 'Jalapeños', price: 30 },
  { name: 'Olives', price: 20 },
  { name: 'Mushrooms', price: 25 },
];

export const SPICE_LEVELS: SpiceLevel[] = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

export const CATEGORY_GRADIENTS: Record<string, string> = {
  pizza: 'linear-gradient(135deg, #C8102E 0%, #8B2500 100%)',
  burgers: 'linear-gradient(135deg, #8B5E3C 0%, #4A2C0A 100%)',
  pasta: 'linear-gradient(135deg, #D4A853 0%, #8B6914 100%)',
  drinks: 'linear-gradient(135deg, #2D6A4F 0%, #1A3D2B 100%)',
  desserts: 'linear-gradient(135deg, #6B35B5 0%, #3B1A6B 100%)',
};
