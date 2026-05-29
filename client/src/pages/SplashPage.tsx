import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SplashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tableNumber, setTableNumber] = useState('Table 1');

  useEffect(() => {
    const tableParam = searchParams.get('table');
    const stored = sessionStorage.getItem('tableNumber');
    if (tableParam) {
      const label = `Table ${tableParam}`;
      sessionStorage.setItem('tableNumber', label);
      setTableNumber(label);
    } else if (stored) {
      setTableNumber(stored);
    }
  }, [searchParams]);

  const handleStart = () => {
    navigate('/menu');
  };

  return (
    <div
      className="app-container min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1A1A1A 0%, #2D2D2D 50%, #1A0A0A 100%)' }}
    >
      {/* Table badge top right */}
      <div className="flex justify-end p-5">
        <span className="bg-white/10 backdrop-blur border border-white/20 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
          📍 {tableNumber}
        </span>
      </div>

      {/* Hero content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20 gap-8 text-center">
        {/* Logo mark */}
        <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_60px_rgba(200,16,46,0.3)]">
          <span className="text-5xl">🍕</span>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-cream font-display font-bold text-5xl tracking-tight leading-none"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            DEYJUNG
          </h1>
          <p
            className="text-gold text-xs font-medium tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Restro &amp; Pizzeria
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/30 text-xs">✦</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Tagline */}
        <p className="text-white/60 text-base leading-relaxed max-w-xs">
          Scan, Order &amp; Enjoy
          <br />
          <span className="text-sm">Authentic flavours, delivered to your table</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="bg-primary text-white font-semibold text-base px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(200,16,46,0.4)] active:shadow-none active:scale-95 transition-all duration-150 flex items-center gap-2"
        >
          Start Ordering
          <span className="text-lg">→</span>
        </button>

        {/* Subtle features */}
        <div className="flex items-center gap-6 text-white/30 text-xs">
          <span>🕒 Fast Service</span>
          <span>⭐ Top Rated</span>
          <span>🔥 Fresh Daily</span>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(200,16,46,0.15) 0%, transparent 70%)' }}
      />
    </div>
  );
}
