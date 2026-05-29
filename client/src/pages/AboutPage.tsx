import { BottomNav } from '../components/BottomNav';

const GALLERY_ITEMS = [
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍝', label: 'Pasta' },
  { emoji: '🥤', label: 'Drinks' },
  { emoji: '🍰', label: 'Desserts' },
  { emoji: '🍽', label: 'Ambiance' },
];

export function AboutPage() {
  return (
    <div className="app-container pb-24">
      {/* Hero banner */}
      <div
        className="w-full h-52 relative flex flex-col items-center justify-center text-center px-8"
        style={{ background: 'linear-gradient(160deg, #1A1A1A 0%, #2D1A0A 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-3">
          <span className="text-3xl">🍕</span>
        </div>
        <h1 className="text-cream font-bold text-2xl leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
          DEYJUNG
        </h1>
        <p className="text-gold text-xs tracking-widest uppercase mt-1">Restro &amp; Pizzeria</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Our Story */}
        <section className="card p-5">
          <h2 className="text-charcoal font-bold text-xl mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Our Story
          </h2>
          <p className="text-charcoal-mid/80 text-sm leading-relaxed mb-3">
            DEYJUNG Restro &amp; Pizzeria was born from a passion for bringing the authentic flavours of Italian and
            Western cuisine to every table. Founded with a vision to create a warm, welcoming space where great food
            meets great company.
          </p>
          <p className="text-charcoal-mid/80 text-sm leading-relaxed">
            Every dish is crafted with love using the finest fresh ingredients. From our hand-tossed pizzas to our
            artisanal desserts, we pour our heart into every plate we serve. Come experience the DEYJUNG difference.
          </p>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-charcoal font-bold text-xl mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Our Specialities
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.label}
                className="aspect-square rounded-2xl bg-surface-gray flex flex-col items-center justify-center gap-1"
                style={{
                  background: item.label === 'Pizza'
                    ? 'linear-gradient(135deg, #C8102E22, #8B250022)'
                    : item.label === 'Burgers'
                    ? 'linear-gradient(135deg, #8B5E3C22, #4A2C0A22)'
                    : item.label === 'Pasta'
                    ? 'linear-gradient(135deg, #D4A85322, #8B691422)'
                    : item.label === 'Drinks'
                    ? 'linear-gradient(135deg, #2D6A4F22, #1A3D2B22)'
                    : item.label === 'Desserts'
                    ? 'linear-gradient(135deg, #6B35B522, #3B1A6B22)'
                    : 'linear-gradient(135deg, #D4A85322, #8B5E3C22)',
                }}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-charcoal-mid text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Opening Hours */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🕒</span>
            <h2 className="text-charcoal font-bold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              Opening Hours
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { day: 'Monday – Friday', hours: '11:00 AM – 11:00 PM' },
              { day: 'Saturday', hours: '10:00 AM – 11:30 PM' },
              { day: 'Sunday', hours: '10:00 AM – 10:00 PM' },
            ].map(({ day, hours }) => (
              <div key={day} className="flex justify-between items-center">
                <span className="text-charcoal-mid text-sm">{day}</span>
                <span className="text-charcoal font-semibold text-sm">{hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 text-sm font-medium">Open Now</span>
          </div>
        </section>

        {/* Find Us */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📍</span>
            <h2 className="text-charcoal font-bold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              Find Us
            </h2>
          </div>
          <div
            className="w-full h-36 rounded-2xl bg-surface-gray flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #D4A85322 0%, #8B5E3C22 100%)' }}
          >
            <span className="text-4xl">🗺</span>
          </div>
          <p className="text-charcoal-mid text-sm leading-relaxed">
            123 Flavour Street, Food District<br />
            Thimphu, Bhutan – 11001
          </p>
        </section>

        {/* Contact */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📞</span>
            <h2 className="text-charcoal font-bold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              Contact Us
            </h2>
          </div>
          <div className="space-y-3">
            <a
              href="tel:+97517123456"
              className="flex items-center gap-3 p-3 bg-surface-gray rounded-xl active:bg-gray-200"
            >
              <span className="text-xl">📱</span>
              <div>
                <p className="text-charcoal font-medium text-sm">Phone</p>
                <p className="text-charcoal-mid/60 text-xs">+975 17 123 456</p>
              </div>
            </a>
            <a
              href="mailto:hello@deyjung.bt"
              className="flex items-center gap-3 p-3 bg-surface-gray rounded-xl active:bg-gray-200"
            >
              <span className="text-xl">✉️</span>
              <div>
                <p className="text-charcoal font-medium text-sm">Email</p>
                <p className="text-charcoal-mid/60 text-xs">hello@deyjung.bt</p>
              </div>
            </a>
          </div>
        </section>

        {/* Brand footer */}
        <div className="text-center py-4">
          <p className="text-charcoal font-bold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
            DEYJUNG
          </p>
          <p className="text-gold text-xs tracking-widest uppercase mt-1">Restro &amp; Pizzeria</p>
          <p className="text-charcoal-mid/40 text-xs mt-2">Made with ❤ for food lovers</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
