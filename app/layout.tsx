import type { Metadata, Viewport } from 'next'
import { Analytics, ConsentBanner } from '@/components/consent'
import { SITE_URL } from '@/lib/reformas'
import './globals.css'

// Renovation site for Barcelona (Google Ads), moved out of the Urawise app. Always Spanish.

export const metadata: Metadata = {
  title: 'Reformas en Barcelona | Urawise',
  description: 'Reformas de pisos, villas y jardines en Barcelona y alrededores. Visita y presupuesto gratis y sin compromiso.',
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: 'UraWise', type: 'website', locale: 'es_ES' },
}

export const viewport: Viewport = { themeColor: '#0a1628', colorScheme: 'light', viewportFit: 'cover' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}<ConsentBanner /><Analytics /></body>
    </html>
  )
}
