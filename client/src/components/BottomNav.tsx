import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

export function BottomNav() {
  const { totalItems } = useCart();
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: '/', icon: '⌂', label: 'Home' },
    { to: '/menu', icon: '☰', label: 'Menu' },
    { to: '/cart', icon: '🛒', label: 'Cart', badge: totalItems },
    { to: '/orders', icon: '📋', label: 'Orders' },
    { to: '/about', icon: 'ℹ', label: 'About' },
  ];

  // Hide bottom nav on splash and orders detail pages
  if (location.pathname === '/') return null;

  return (
    <nav className="bottom-nav safe-area-bottom">
      {navItems.map((item) => {
        const isActive =
          item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 min-w-[44px] py-1 relative"
          >
            <div className="relative">
              <span className={`text-xl leading-none ${isActive ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                {item.icon}
              </span>
              {item.badge != null && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-charcoal-mid/50'}`}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
