import { REFORMAS_PHOTOS } from '@/lib/reformas'
import type { WORK_TYPES } from '@/lib/leads'

// One page per service at /<slug> (also used as Google Ads sitelinks), and the cards on the home page.
// Describe only work we actually do; no prices, guarantees or experience claims.

export type ReformasService = {
  slug: string
  /** Card on the home page. */
  card: { title: string; body: string }
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  includesTitle: string
  includes: string[]
  /** Preselected in the quote form on this page. */
  workType: (typeof WORK_TYPES)[number] | ''
  /** Indexes into REFORMAS_PHOTOS that fit this service. */
  photos: number[]
}

export const REFORMAS_SERVICES: ReformasService[] = [
  {
    slug: 'reforma-integral',
    card: { title: 'Reforma integral de pisos y villas', body: 'Renovamos la vivienda completa o por fases, de la distribución a los acabados.' },
    h1: 'Reforma integral de pisos y villas en Barcelona',
    metaTitle: 'Reforma integral en Barcelona | Urawise',
    metaDescription: 'Reforma integral de pisos y villas en Barcelona y alrededores: distribución, instalaciones y acabados, con visita y presupuesto gratis.',
    intro: 'Renovamos tu piso o tu villa por completo o por fases: distribución, instalaciones y acabados. Antes de empezar visitamos la vivienda y te damos un presupuesto claro y detallado.',
    includesTitle: 'Qué puede incluir',
    includes: ['Cambios de distribución', 'Fontanería y electricidad', 'Cocina y baños', 'Suelos, alicatado y pintura', 'Acabados'],
    workType: 'Reforma integral',
    photos: [0, 4],
  },
  {
    slug: 'banos',
    card: { title: 'Baños', body: 'Reforma completa del baño: fontanería, alicatado, ducha o bañera y montaje.' },
    h1: 'Reformas de baños en Barcelona',
    metaTitle: 'Reformas de baños en Barcelona | Urawise',
    metaDescription: 'Reforma de baños en Barcelona y alrededores: fontanería, alicatado, plato de ducha o bañera y montaje, con visita y presupuesto gratis.',
    intro: 'Reformamos tu baño de principio a fin, o solo lo que necesites cambiar. Visitamos la vivienda, vemos contigo qué quieres hacer y te damos un presupuesto claro antes de empezar.',
    includesTitle: 'Qué puede incluir',
    includes: ['Desmontaje del baño existente', 'Fontanería y electricidad', 'Alicatado de paredes y suelo', 'Plato de ducha o bañera', 'Montaje de lavabo, inodoro y grifería'],
    workType: 'Baño',
    photos: [],
  },
  {
    slug: 'cocinas',
    card: { title: 'Cocinas', body: 'Nuevas cocinas: instalaciones, revestimientos, suelo y montaje de muebles.' },
    h1: 'Reformas de cocinas en Barcelona',
    metaTitle: 'Reformas de cocinas en Barcelona | Urawise',
    metaDescription: 'Reforma de cocinas en Barcelona y alrededores: instalaciones, revestimientos, suelo y montaje, con visita y presupuesto gratis.',
    intro: 'Renovamos tu cocina por completo o en parte: instalaciones, revestimientos, suelo y montaje. Visitamos la vivienda y te damos un presupuesto claro y detallado antes de empezar.',
    includesTitle: 'Qué puede incluir',
    includes: ['Desmontaje de la cocina antigua', 'Fontanería y electricidad', 'Alicatado y frente de cocina', 'Suelo', 'Montaje de muebles y encimera'],
    workType: 'Cocina',
    photos: [0],
  },
  {
    slug: 'pintura-alicatado-solados',
    card: { title: 'Pintura, alicatado y solados', body: 'Pintura interior y exterior, azulejos, baldosas y pavimentos interiores.' },
    h1: 'Pintura, alicatado y solados en Barcelona',
    metaTitle: 'Pintura, alicatado y solados en Barcelona | Urawise',
    metaDescription: 'Pintura interior y exterior, alicatado y colocación de suelos en Barcelona y alrededores, con visita y presupuesto gratis.',
    intro: 'Pintamos, alicatamos y colocamos suelos, tanto en una sola estancia como en toda la vivienda. Te damos un presupuesto claro antes de empezar.',
    includesTitle: 'Qué hacemos',
    includes: ['Pintura interior y exterior', 'Preparación de paredes y techos', 'Alicatado de baños, cocinas y terrazas', 'Colocación de suelos y baldosas'],
    workType: '',
    photos: [4, 1],
  },
  {
    slug: 'jardines-exteriores',
    card: { title: 'Jardines y exteriores', body: 'Jardines, caminos, terrazas, patios y accesos con piedra o adoquín.' },
    h1: 'Jardines y pavimentación exterior en Barcelona',
    metaTitle: 'Jardines y pavimentación exterior en Barcelona | Urawise',
    metaDescription: 'Jardines, caminos, terrazas, patios y accesos en Barcelona y alrededores, con visita y presupuesto gratis.',
    intro: 'Renovamos jardines y zonas exteriores: caminos, terrazas, patios, escalones y accesos. Visitamos el espacio y te damos un presupuesto claro antes de empezar.',
    includesTitle: 'Qué hacemos',
    includes: ['Caminos y accesos de piedra o adoquín', 'Terrazas y patios', 'Escalones exteriores', 'Renovación y acondicionamiento de jardines'],
    workType: 'Jardín',
    photos: [2, 3, 1],
  },
]

export const findService = (slug: string) => REFORMAS_SERVICES.find(service => service.slug === slug)
export const servicePhotos = (service: ReformasService) => service.photos.map(index => REFORMAS_PHOTOS[index]).filter(Boolean)
