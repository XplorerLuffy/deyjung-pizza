import { useParams, useNavigate } from 'react-router-dom';
import { usePolling } from '../hooks/useApi';
import type { Order } from '../types';
import { PageLoader } from '../components/Spinner';

type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered';

const ORDER_STEPS: { key: OrderStatus; label: string; icon: string; desc: string }[] = [
  { key: 'received', label: 'Order Received', icon: '✓', desc: 'Your order has been confirmed' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', desc: 'Our chefs are cooking your meal' },
  { key: 'ready', label: 'Ready', icon: '🍽', desc: 'Your order is ready to serve' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your meal!' },
];

const STATUS_ORDER: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered'];

function getStepStatus(stepKey: OrderStatus, currentStatus: OrderStatus): 'done' | 'active' | 'pending' {
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, loading } = usePolling<Order>(id ? `/orders/${id}` : null, 5000);

  if (loading && !order) {
    return (
      <div className="app-container">
        <PageLoader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4 px-8">
        <span className="text-5xl">📋</span>
        <h2 className="text-charcoal font-bold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
          Order not found
        </h2>
        <button className="btn-primary" onClick={() => navigate('/menu')}>
          Back to Menu
        </button>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status as OrderStatus);
  const estimatedMinutes = Math.max(0, (3 - currentIdx) * 6);

  return (
    <div className="app-container pb-8">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-8 text-center"
        style={{ background: 'linear-gradient(160deg, #1A1A1A 0%, #2D2D2D 100%)' }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-cream font-bold text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>
            Order #{order.orderNumber}
          </h1>
        </div>
        <p className="text-cream/60 text-sm mb-4">{order.tableNumber}</p>

        {order.status !== 'delivered' ? (
          <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-cream text-sm font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ~{estimatedMinutes} min estimated
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/40 text-green-400 text-sm font-medium px-4 py-2 rounded-full">
            <span>🎉</span>
            Delivered! Enjoy your meal
          </span>
        )}
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Stepper */}
        <div className="card p-4">
          <h2 className="text-charcoal font-bold text-base mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            Order Status
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-100" />

            <div className="space-y-0">
              {ORDER_STEPS.map((step, idx) => {
                const status = getStepStatus(step.key, order.status as OrderStatus);
                const isLast = idx === ORDER_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-4 relative" style={{ paddingBottom: isLast ? 0 : '24px' }}>
                    {/* Step indicator */}
                    <div className="flex-shrink-0 relative z-10">
                      {status === 'done' ? (
                        <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                          <span className="text-white text-base font-bold">✓</span>
                        </div>
                      ) : status === 'active' ? (
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(200,16,46,0.4)]">
                          <span className="text-xl animate-pulse">{step.icon}</span>
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-surface-gray border-2 border-gray-200 flex items-center justify-center">
                          <span className="text-xl opacity-30">{step.icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pt-1.5">
                      <p className={`font-semibold text-sm ${status === 'pending' ? 'text-charcoal-mid/40' : 'text-charcoal'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${status === 'pending' ? 'text-charcoal-mid/30' : 'text-charcoal-mid/60'}`}>
                        {status === 'active' ? (
                          <span className="text-primary font-medium">In progress...</span>
                        ) : (
                          step.desc
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order summary mini card */}
        <div className="card p-4">
          <h2 className="text-charcoal font-bold text-base mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Your Order
          </h2>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="text-charcoal text-sm font-medium">{item.name}</p>
                  <p className="text-charcoal-mid/50 text-xs">
                    {item.customization.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-charcoal font-semibold text-sm">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
            <span className="text-charcoal font-bold text-sm">Total</span>
            <span className="text-charcoal font-bold">₹{order.total}</span>
          </div>
        </div>

        {/* Help button */}
        <button
          className="w-full py-3.5 bg-surface-gray rounded-2xl text-charcoal font-semibold text-sm flex items-center justify-center gap-2 active:bg-gray-200"
          onClick={() => alert('Our staff has been notified. Someone will assist you shortly.')}
        >
          <span>💬</span>
          Need help?
        </button>

        {/* Back to menu */}
        <button
          className="w-full py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 active:bg-primary-dark"
          onClick={() => navigate('/menu')}
        >
          Order More →
        </button>
      </div>
    </div>
  );
}

