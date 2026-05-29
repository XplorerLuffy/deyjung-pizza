import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../hooks/useApi';
import type { PaymentMethod } from '../types';
import { FoodImage } from '../components/FoodImage';
import { BottomNav } from '../components/BottomNav';

interface OrderResponse {
  id: number;
  orderNumber: string;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { value: 'cash', label: 'Cash', icon: '💵', desc: 'Pay at the table' },
  { value: 'card', label: 'Card', icon: '💳', desc: 'Debit or credit card' },
  { value: 'wallet', label: 'Wallet', icon: '📱', desc: 'UPI / Digital wallet' },
];

export function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, gst, total, removeItem, updateQuantity, clearCart } = useCart();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const tableNumber = sessionStorage.getItem('tableNumber') || 'Table 1';

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsPlacing(true);
    try {
      const response = await apiFetch<OrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          tableNumber,
          items,
          subtotal,
          gst,
          total,
          paymentMethod,
          specialInstructions,
        }),
      });
      clearCart();
      navigate(`/orders/${response.id}`);
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="app-container pb-24 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-surface-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/menu')} className="text-charcoal text-xl p-1">←</button>
          <h1 className="text-charcoal font-bold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
            Your Order
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16">
          <div className="w-24 h-24 bg-surface-gray rounded-full flex items-center justify-center">
            <span className="text-4xl opacity-50">🛒</span>
          </div>
          <div className="text-center">
            <h2 className="text-charcoal font-bold text-xl mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
              Your cart is empty
            </h2>
            <p className="text-charcoal-mid/60 text-sm">Add some delicious items to get started!</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-container pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/menu')} className="text-charcoal text-xl p-1">←</button>
          <div>
            <h1 className="text-charcoal font-bold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
              Your Order
            </h1>
            <span className="inline-flex items-center gap-1 text-xs text-charcoal-mid/60 bg-surface-gray px-2 py-0.5 rounded-full">
              📍 {tableNumber} · Auto-detected
            </span>
          </div>
        </div>
        <button
          onClick={() => { if (window.confirm('Clear all items?')) clearCart(); }}
          className="text-charcoal-mid/50 text-xs py-1 px-2 rounded-lg active:bg-surface-gray"
        >
          Clear
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Cart items */}
        <div className="card divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3">
              {/* Thumbnail */}
              <FoodImage
                categorySlug={item.categorySlug}
                name={item.name}
                className="w-16 h-16 rounded-xl flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-charcoal font-semibold text-sm truncate">{item.name}</p>
                <p className="text-charcoal-mid/50 text-xs mt-0.5">
                  {item.customization.size}
                  {item.customization.toppings.length > 0 && ` • ${item.customization.toppings.join(', ')}`}
                  {` • ${item.customization.spiceLevel}`}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-surface-gray rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-charcoal font-bold active:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-charcoal font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center font-bold active:bg-primary-dark"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-charcoal font-bold text-sm">₹{item.totalPrice}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center text-sm active:bg-primary active:text-white"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="card p-4 space-y-2">
          <h2 className="text-charcoal font-bold text-base mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Order Summary
          </h2>
          <div className="flex justify-between text-sm text-charcoal-mid">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-charcoal-mid">
            <span>GST (5%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-sm text-charcoal-mid">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between text-charcoal font-bold text-base">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="card p-4">
          <h2 className="text-charcoal font-bold text-base mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Payment Method
          </h2>
          <div className="space-y-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                  paymentMethod === opt.value
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-100 bg-surface-gray'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === opt.value ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="text-charcoal font-semibold text-sm">{opt.label}</p>
                  <p className="text-charcoal-mid/60 text-xs">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Special instructions */}
        <div className="card p-4">
          <h2 className="text-charcoal font-bold text-base mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Special Instructions
          </h2>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special notes for your order..."
            rows={3}
            className="w-full p-3 bg-surface-gray rounded-xl text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-white border-t border-gray-100 px-4 py-3 z-50">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || items.length === 0}
          className="w-full bg-primary text-white font-bold rounded-full py-4 text-base active:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isPlacing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Placing Order...
            </>
          ) : (
            <>Place Order — ₹{total}</>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
