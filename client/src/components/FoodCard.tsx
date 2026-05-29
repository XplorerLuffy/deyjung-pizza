import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '../types';
import { FoodImage } from './FoodImage';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export function FoodCard({ item }: FoodCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="card cursor-pointer active:scale-[0.97] transition-transform duration-150"
      onClick={() => navigate(`/menu/${item.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/menu/${item.id}`)}
    >
      {/* Image area */}
      <div className="relative">
        <FoodImage
          categorySlug={item.category.slug}
          name={item.name}
          icon={item.category.icon}
          className="w-full h-32 rounded-t-2xl"
        />
        {item.isBestseller && (
          <span className="absolute top-2 left-2 bg-gold text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full">
            BESTSELLER
          </span>
        )}
        {item.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-charcoal font-semibold text-sm leading-tight mb-1 truncate">{item.name}</p>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-gold text-xs">★</span>
          <span className="text-charcoal-mid text-xs font-medium">{item.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({item.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-charcoal font-bold text-sm">₹{item.basePrice}</span>
          <button
            className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold leading-none active:bg-primary-dark"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/menu/${item.id}`);
            }}
            aria-label={`Add ${item.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
