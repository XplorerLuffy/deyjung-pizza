'use client'

import React from 'react'
import Button from '@/components/ui/Button'

interface HeroProps {
  onOrderNow: () => void
}

export default function Hero({ onOrderNow }: HeroProps) {
  const handleViewMenu = () => {
    const menuSection = document.getElementById('menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-dark">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 100%, rgba(139,28,28,0.4), transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(212,175,55,0.15), transparent 50%)',
          }}
        />
        <div className="absolute inset-0 bg-grain opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo badge */}
        <div
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/30 text-gold text-sm font-medium animate-fade-in"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          ✦ Gelephu Mindfulness City, Bhutan
        </div>

        {/* Main heading */}
        <h1
          className="font-playfair text-5xl md:text-7xl text-brand-text mb-4 leading-tight animate-fade-in-up delay-100"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          Taste the Finest
          <br />
          <span className="text-gold italic">Flavors of Gelephu</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-brand-muted text-lg md:text-xl mb-10 font-light tracking-widest uppercase animate-fade-in-up delay-200"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          Dine In · Takeaway · Order Online
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <Button variant="gold" size="lg" onClick={onOrderNow}>
            🛒 Order Now
          </Button>
          <Button variant="outline-gold" size="lg" onClick={handleViewMenu}>
            🍕 View Menu
          </Button>
        </div>

        {/* Decorative line */}
        <div
          className="mt-16 flex items-center justify-center gap-4 animate-fade-in-up delay-400"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="h-px w-12 bg-gold/30" />
          <span className="text-gold/50 text-sm">DEYJUNG RESTRO & PIZZERIA</span>
          <div className="h-px w-12 bg-gold/30" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-brand-muted text-xs uppercase tracking-widest">Scroll</span>
        <div className="animate-bounce-slow text-gold">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
