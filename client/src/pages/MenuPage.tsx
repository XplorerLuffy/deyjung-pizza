import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import type { MenuItem, Category } from '../types';
import { FoodCard } from '../components/FoodCard';
import { BottomNav } from '../components/BottomNav';
import { PageLoader } from '../components/Spinner';
import { useCart } from '../context/CartContext';

const ALL_CATEGORY: Category = { id: 0, name: 'All', icon: '🍽', slug: 'all' };

export function MenuPage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data: categories, loading: catLoading } = useApi<Category[]>('/categories');
  const queryParams = new URLSearchParams();
  if (activeCategory !== 'all') queryParams.set('category', activeCategory);
  if (search) queryParams.set('search', search);
  const menuPath = `/menu?${queryParams.toString()}`;
  const { data: menuItems, loading: menuLoading } = useApi<MenuItem[]>(menuPath);

  const allCategories = useMemo(
    () => [ALL_CATEGORY, ...(categories || [])],
    [categories]
  );

  // Featured items (bestsellers for "Popular Right Now")
  const popularItems = useMemo(
    () => (menuItems || []).filter((item) => item.isBestseller).slice(0, 4),
    [menuItems]
  );

  const tableNumber = sessionStorage.getItem('tableNumber') || 'Table 1';

  return (
    <div className="app-container pb-24">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-surface-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div>
          <h1
            className="text-charcoal font-bold text-xl leading-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            DEYJUNG
          </h1>
          <p className="text-charcoal-mid/60 text-xs">{tableNumber}</p>
        </div>
        <button
          className="relative w-10 h-10 bg-surface-gray rounded-xl flex items-center justify-center active:bg-gray-200"
          onClick={() => navigate('/cart')}
          aria-label="Cart"
        >
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* Search input */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-gray rounded-2xl text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category chips */}
        {catLoading ? (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-20 bg-surface-gray rounded-full animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`chip flex-shrink-0 ${activeCategory === cat.slug ? 'chip-active' : 'chip-inactive'}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {menuLoading ? (
        <PageLoader />
      ) : (
        <>
          {/* Popular Right Now section */}
          {activeCategory === 'all' && !search && popularItems.length > 0 && (
            <section className="px-4 mb-6">
              <h2
                className="text-charcoal font-bold text-lg mb-3"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Popular Right Now 🔥
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {popularItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* All items grid */}
          <section className="px-4">
            <h2
              className="text-charcoal font-bold text-lg mb-3"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {activeCategory === 'all' && !search
                ? 'Full Menu'
                : search
                ? `Results for "${search}"`
                : allCategories.find((c) => c.slug === activeCategory)?.name || 'Menu'}
            </h2>

            {menuItems && menuItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {menuItems
                  .filter((item) => !(activeCategory === 'all' && !search && item.isBestseller))
                  .map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="text-5xl opacity-40">🍽</span>
                <p className="text-charcoal-mid/60 text-sm text-center">
                  {search ? `No items found for "${search}"` : 'No items available'}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      <BottomNav />
    </div>
  );
}
