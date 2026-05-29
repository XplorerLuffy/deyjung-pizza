import { CATEGORY_GRADIENTS } from '../types';

interface FoodImageProps {
  categorySlug: string;
  name: string;
  className?: string;
  icon?: string;
}

export function FoodImage({ categorySlug, name, className = '', icon }: FoodImageProps) {
  const gradient = CATEGORY_GRADIENTS[categorySlug] || CATEGORY_GRADIENTS.pizza;

  return (
    <div
      className={`flex items-center justify-center select-none ${className}`}
      style={{ background: gradient }}
      aria-label={name}
    >
      <span className="text-4xl drop-shadow-md">{icon || getCategoryEmoji(categorySlug)}</span>
    </div>
  );
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    pizza: '🍕',
    burgers: '🍔',
    pasta: '🍝',
    drinks: '🥤',
    desserts: '🍰',
  };
  return map[slug] || '🍽';
}
