import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/hooks/useCart'
import { ToastProvider } from '@/components/ui/Toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'DEYJUNG Restro & Pizzeria | Gelephu Mindfulness City, Bhutan',
  description:
    'Experience the finest flavors at DEYJUNG Restro & Pizzeria in Gelephu Mindfulness City, Bhutan. Authentic Bhutanese cuisine meets Italian fire. Dine in, takeaway, or order online.',
  keywords: 'DEYJUNG, restaurant, pizza, Gelephu, Bhutan, order online, dine in, takeaway',
  openGraph: {
    title: 'DEYJUNG Restro & Pizzeria',
    description: 'Where Bhutanese Flavors Meet Italian Fire',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F0A06',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
