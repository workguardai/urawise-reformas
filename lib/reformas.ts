// Details for the renovation site at reformas.urawise.eu (renovation work in Barcelona, for Google Ads).
// Fill these in before the campaign goes live; empty values show a clearly marked placeholder on the page.

/** WhatsApp number in international format without "+" or spaces, e.g. "34600000000". */
export const REFORMAS_WHATSAPP = '351924673825'
/** Address for quote requests by email. */
export const REFORMAS_EMAIL = 'besasonos@gmail.com'

/** Project photos: put the files in /public/reformas/ and list them here, e.g. { src: '/reformas/bano-gracia.jpg', alt: 'Baño reformado en Gràcia' }. */
export const REFORMAS_PHOTOS: { src: string; alt: string }[] = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8199-A0M3ahZq2OgovMJF5AN1vnGnNZnI6K.jpg', alt: 'Cocina en fase de acabados' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8407-jAfsWMIrHa6Vr27Bodnjj48pnByJlh.jpg', alt: 'Porche y escalón alicatados con mosaico' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7371-84mZ9ZdSgtIShDYVEP74pXqzTP2pxE.jpg', alt: 'Camino de piedra natural en un jardín' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8018-35lV4IHEFUnKD8RpuOkz6J3nHIZQue.jpg', alt: 'Escalones de entrada con adoquines' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8269-bz35AhBzG10E6r9INAFUoVj49qolPQ.jpg', alt: 'Habitación preparada para pintar' },
]
/** Shown under the gallery, so visitors know where the photos come from. */
export const REFORMAS_GALLERY_NOTE = 'Trabajos anteriores, realizados fuera de Barcelona. Pronto añadiremos proyectos en Barcelona.'

export const REFORMAS_WHATSAPP_TEXT = 'Hola, me gustaría pedir presupuesto para una reforma en Barcelona.'
export const REFORMAS_EMAIL_SUBJECT = 'Presupuesto de reforma en Barcelona'

/**
 * Google Ads conversions for contact clicks ("AW-<conversion ID>/<conversion label>"), from Google Ads → Goals →
 * Conversions → the action → Tag setup → Google Tag Manager. An empty one is skipped; the GA4 events are sent either way.
 * Everything here is sent only after the visitor accepts cookies.
 */
export const REFORMAS_ADS_CONVERSIONS: Record<'whatsapp' | 'email' | 'form', string> = {
  whatsapp: 'AW-18368007697/gUKgCPGQnv8cEJGcxrZE',
  email: 'AW-18368007697/na8mCPSQnv8cEJGcxrZE',
  /** "Formulario reformas": counted on the thank-you page after a real form submission. */
  form: 'AW-18368007697/D6spCKyT75QdEJGcxrZE',
}

/** Who runs the renovation business, for the privacy policy. Empty values show a highlighted placeholder. */
export const REFORMAS_COMPANY = {
  /** The trading name. */
  name: 'Urawise',
  /** The sole trader's full legal name; leave empty to show only the trading name and NIF. */
  owner: '',
  /** Portuguese NIF (número de identificação fiscal) of the sole trader. */
  taxId: '335038131',
  /** Postal address. */
  address: 'Avda. Francesc Botey 51, Sant Adrià de Besòs (Barcelona)',
}

/** Where this site lives; used for canonical URLs, Open Graph, the sitemap and robots.txt. */
export const SITE_URL = 'https://reformas.urawise.eu'
/** The Urawise app (the main site), linked from "Sobre Urawise". */
export const APP_URL = 'https://www.urawise.eu'
