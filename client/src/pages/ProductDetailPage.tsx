import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import type { MenuItem, SpiceLevel } from '../types';
import { TOPPINGS, SPICE_LEVELS, CATEGORY_GRADIENTS } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/Spinner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const { data: item, loading } = useApi<MenuItem>(id ? `/menu/${id}` : null);

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sizeMultiplier = useMemo(() => {
    if (!item) return 1;
    const size = item.sizes.find((s) => s.label === selectedSize);
    return size?.multiplier ?? 1;
  }, [item, selectedSize]);

  const toppingsTotal = useMemo(() => {
    return selectedToppings.reduce((sum, name) => {
      const topping = TOPPINGS.find((t) => t.name === name);
      return sum + (topping?.price ?? 0);
    }, 0);
  }, [selectedToppings]);

  const unitPrice = useMemo(() => {
    if (!item) return 0;
    return Math.round(item.basePrice * sizeMultiplier) + toppingsTotal;
  }, [item, sizeMultiplier, toppingsTotal]);

  const totalPrice = unitPrice * quantity;

  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleAddToCart = () => {
    if (!item) return;
    addItem(item, quantity, {
      size: selectedSize,
      sizeMultiplier,
      toppings: selectedToppings,
      spiceLevel,
      specialInstructions,
    });
    showToast(`${item.name} added to cart!`);
    navigate('/menu');
  };

  if (loading) return <div className="app-container"><PageLoader /></div>;

  if (!item) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="text-5xl">🍽</span>
        <p className="text-charcoal-mid">Item not found</p>
        <button className="btn-primary" onClick={() => navigate('/menu')}>
          Back to Menu
        </button>
      </div>
    );
  }

  const gradient = CATEGORY_GRADIENTS[item.category.slug] || CATEGORY_GRADIENTS.pizza;

  return (
    <div className="app-container pb-28">
      {/* Hero image */}
      <div
        className="w-full h-[300px] relative flex items-center justify-center"
        style={{ background: gradient }}
      >
        <span className="text-8xl drop-shadow-2xl">{item.category.icon}</span>

        {/* Back arrow */}
        <button
          className="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:bg-black/50"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {item.isBestseller && (
            <span className="bg-gold text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full">
              BESTSELLER
            </span>
          )}
          {item.isNew && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-1">
          <h1
            className="text-charcoal font-bold text-2xl leading-tight flex-1 pr-4"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px' }}
          >
            {item.name}
          </h1>
          <span className="text-charcoal font-bold text-xl">₹{item.basePrice}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-gold">★</span>
          <span className="text-charcoal font-semibold text-sm">{item.rating.toFixed(1)}</span>
          <span className="text-charcoal-mid/60 text-sm">({item.reviewCount} reviews)</span>
          <span className="text-gray-300 mx-1">•</span>
          <span className="text-charcoal-mid/60 text-sm">{item.category.name}</span>
        </div>

        <p className="text-charcoal-mid/70 text-sm leading-relaxed mb-5">{item.description}</p>

        <hr className="border-gray-100 mb-5" />

        {/* Size picker */}
        <section className="mb-5">
          <h3 className="text-charcoal font-semibold text-sm mb-2.5">
            Size <span className="text-charcoal-mid/50 font-normal text-xs ml-1">Choose one</span>
          </h3>
          <div className="flex gap-2">
            {item.sizes.map((size) => {
              const sizePrice = Math.round(item.basePrice * size.multiplier);
              const isActive = selectedSize === size.label;
              return (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center gap-0.5 transition-all duration-150 ${
                    isActive
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-gray-200 text-charcoal-mid'
                  }`}
                >
                  <span className="font-bold text-sm">{size.label}</span>
                  <span className="text-xs opacity-70">₹{sizePrice}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Toppings */}
        <section className="mb-5">
          <h3 className="text-charcoal font-semibold text-sm mb-2.5">
            Toppings <span className="text-charcoal-mid/50 font-normal text-xs ml-1">Optional</span>
          </h3>
          <div className="flex flex-col gap-2">
            {TOPPINGS.map((topping) => {
              const isChecked = selectedToppings.includes(topping.name);
              return (
                <label
                  key={topping.name}
                  className="flex items-center justify-between p-3 bg-surface-gray rounded-xl cursor-pointer active:bg-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                        isChecked ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isChecked && <span className="text-white text-xs leading-none">✓</span>}
                    </div>
                    <span className="text-charcoal text-sm font-medium">{topping.name}</span>
                  </div>
                  <span className="text-charcoal-mid/60 text-sm">+₹{topping.price}</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleTopping(topping.name)}
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* Spice level */}
        <section className="mb-5">
          <h3 className="text-charcoal font-semibold text-sm mb-2.5">Spice Level</h3>
          <div className="flex gap-2 flex-wrap">
            {SPICE_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`chip ${spiceLevel === level ? 'chip-active' : 'chip-inactive'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Special instructions */}
        <section className="mb-5">
          <h3 className="text-charcoal font-semibold text-sm mb-2.5">Special Instructions</h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests? (allergies, preferences...)"
            rows={3}
            className="w-full p-3 bg-surface-gray rounded-xl text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </section>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-white border-t border-gray-100 px-4 py-3 z-50 flex items-center gap-4">
        {/* Quantity */}
        <div className="flex items-center gap-3 bg-surface-gray rounded-xl p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-charcoal font-bold text-lg active:bg-gray-100"
          >
            −
          </button>
          <span className="text-charcoal font-bold text-base w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg active:bg-primary-dark"
          >
            +
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-white font-semibold rounded-full py-3.5 text-sm active:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <span>Add to Cart</span>
          <span className="font-bold">₹{totalPrice}</span>
        </button>
      </div>
    </div>
  );
}
