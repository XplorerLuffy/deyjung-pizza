'use client'

import React, { useState, useEffect } from 'react'
import Hero from '@/components/customer/Hero'
import MenuSection from '@/components/customer/MenuSection'
import CartBar from '@/components/customer/CartBar'
import CartDrawer from '@/components/customer/CartDrawer'
import OrderTypeModal from '@/components/customer/OrderTypeModal'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'bg-dark/95 backdrop-blur-md border-b border-gold/20 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('top')}
            className="font-playfair text-2xl font-bold text-gold tracking-wide"
          >
            DEYJUNG
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('menu')}
              className="text-brand-muted hover:text-brand-text transition-colors text-sm"
            >
              Menu
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-brand-muted hover:text-brand-text transition-colors text-sm"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-brand-muted hover:text-brand-text transition-colors text-sm"
            >
              Contact
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsOrderModalOpen(true)}
              className="hidden md:inline-flex"
            >
              Order Now
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-brand-muted hover:text-brand-text transition-colors p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile full-screen menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-dark/98 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-8 animate-fade-in">
            <button
              onClick={() => scrollTo('menu')}
              className="font-playfair text-3xl text-brand-text hover:text-gold transition-colors"
            >
              Menu
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="font-playfair text-3xl text-brand-text hover:text-gold transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="font-playfair text-3xl text-brand-text hover:text-gold transition-colors"
            >
              Contact
            </button>
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setMobileMenuOpen(false)
                setIsOrderModalOpen(true)
              }}
            >
              Order Now
            </Button>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div id="top">
        <Hero onOrderNow={() => setIsOrderModalOpen(true)} />
      </div>

      <main>
        <MenuSection />

        {/* About Section */}
        <section id="about" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Story */}
              <div>
                <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
                  ✦ Our Story
                </span>
                <h2 className="font-playfair text-4xl md:text-5xl italic text-brand-text mb-6 leading-tight">
                  Where Bhutanese Warmth Meets Italian Craft
                </h2>
                <div className="h-0.5 w-20 bg-gold mb-8" />
                <div className="space-y-4 text-brand-muted leading-relaxed">
                  <p>
                    Nestled in the heart of Gelephu Mindfulness City, DEYJUNG Restro & Pizzeria
                    was born from a simple vision: to create a dining experience where the warmth
                    of Bhutanese hospitality harmonizes with the bold, rustic soul of Italian cuisine.
                  </p>
                  <p>
                    We craft our pizzas using traditional stone-fired techniques, pairing them with
                    locally-sourced Bhutanese ingredients that tell the story of our land. Every dish
                    is a conversation between two culinary traditions, resulting in flavors that are
                    entirely our own.
                  </p>
                  <p>
                    Whether you are a local looking for your favorite comfort dish or a traveler
                    discovering the flavors of Bhutan for the first time, DEYJUNG welcomes you to
                    our table. Come as a guest, leave as family.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10">
                  {[['2019', 'Founded'], ['100+', 'Menu Items'], ['4.8★', 'Rating']].map(([val, label]) => (
                    <div key={label} className="text-center p-4 bg-surface-light rounded-xl border border-gold/10">
                      <div className="font-playfair text-2xl text-gold font-bold">{val}</div>
                      <div className="text-brand-muted text-xs mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Decorative panel */}
              <div className="relative">
                <div
                  className="bg-dark rounded-3xl p-10 border border-gold/20 text-center"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1), transparent 70%)',
                  }}
                >
                  <div className="font-playfair text-7xl text-gold/20 font-bold mb-4">D</div>
                  <div className="font-playfair text-4xl text-gold font-bold mb-2">DEYJUNG</div>
                  <div className="text-brand-muted text-sm mb-8">Restro & Pizzeria</div>
                  <div className="h-px bg-gold/20 mb-8" />
                  <p className="font-playfair italic text-brand-text text-xl leading-relaxed">
                    &ldquo;Where Bhutanese Flavors<br />Meet Italian Fire&rdquo;
                  </p>
                  <div className="mt-8 text-gold/40 text-4xl">🍕</div>
                  <div className="mt-4 text-brand-muted text-xs tracking-widest uppercase">
                    Gelephu Mindfulness City, Bhutan
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-gold/10" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-crimson/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl text-brand-text mb-3">
                Visit <span className="text-gold italic">Us</span>
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gold/40" />
                <span className="text-gold text-lg">✦</span>
                <div className="h-px w-16 bg-gold/40" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: '📍',
                  title: 'Address',
                  lines: ['Gelephu Mindfulness City,', 'Gelephu, Bhutan'],
                },
                {
                  icon: '🕐',
                  title: 'Hours',
                  lines: ['Monday – Sunday', '11:00 AM – 10:00 PM'],
                },
                {
                  icon: '📞',
                  title: 'Contact',
                  lines: ['+975 17 000 000', 'WhatsApp Available'],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-surface border border-gold/10 rounded-2xl p-6 text-center hover:border-gold/30 transition-colors"
                >
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h3 className="font-playfair text-gold text-lg mb-3">{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line} className="text-brand-muted text-sm">{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-gold/10 mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28553.61!2d90.4746!3d26.8630!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375d6c0e85dab5a9%3A0xd5e4c3f5c4e5d6e7!2sGelephu%2C%20Bhutan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DEYJUNG location on Google Maps"
              />
            </div>

            {/* WhatsApp CTA */}
            <div className="text-center">
              <Button
                variant="gold"
                size="lg"
                className="!bg-[#25D366] !text-white hover:!bg-[#128C7E]"
                onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17723849'}`, '_blank')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gold/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-playfair text-3xl text-gold font-bold mb-2">DEYJUNG</div>
          <p className="text-brand-muted text-sm mb-6 italic font-playfair">
            &ldquo;Where Bhutanese Flavors Meet Italian Fire&rdquo;
          </p>
          <div className="h-px w-32 bg-gold/20 mx-auto mb-6" />
          <div className="flex justify-center gap-8 text-sm text-brand-muted mb-6">
            <button onClick={() => scrollTo('menu')} className="hover:text-gold transition-colors">Menu</button>
            <button onClick={() => scrollTo('about')} className="hover:text-gold transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-gold transition-colors">Contact</button>
            <a href="/admin/login" className="hover:text-gold transition-colors">Admin</a>
          </div>
          <p className="text-brand-muted/50 text-xs">
            © 2024 DEYJUNG Restro & Pizzeria. All rights reserved. | Gelephu Mindfulness City, Bhutan
          </p>
        </div>
      </footer>

      {/* Cart bar and drawer */}
      <CartBar onOpen={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Order type modal */}
      <OrderTypeModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  )
}
