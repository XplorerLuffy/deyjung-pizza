import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';

export function OrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container pb-24">
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-charcoal font-bold text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>
          Orders
        </h1>
        <p className="text-charcoal-mid/60 text-sm mt-1">Track your recent orders</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
        <div className="w-20 h-20 bg-surface-gray rounded-full flex items-center justify-center">
          <span className="text-3xl opacity-50">📋</span>
        </div>
        <div className="text-center">
          <h2 className="text-charcoal font-bold text-lg mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            No recent orders
          </h2>
          <p className="text-charcoal-mid/60 text-sm">
            Place an order and you'll be able to track it here.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/menu')}>
          Browse Menu
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
