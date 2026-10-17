import { CookieSettingsLink } from '@/components/consent'
import { REFORMAS_GALLERY_NOTE } from '@/lib/reformas'
import { ContactLinks } from '@/app/contact-buttons'
import { LeadForm } from '@/app/lead-form'
import type { WORK_TYPES } from '@/lib/leads'

// Pieces shared by the home page and the service pages.

export function ReformasHeader({ home = false }: { home?: boolean }) {
  return <header className="reformas-header">
    {home ? <span className="wordmark">URAWISE<span>.</span></span> : <a className="wordmark" href="/">URAWISE<span>.</span></a>}
  </header>
}

/** Shown in every hero: the thing people searching for "presupuesto" want to know first. */
export function FreeQuoteBadge() {
  return <p className="reformas-free">✓ Visita y presupuesto gratis · Sin compromiso</p>
}

export const STEPS = [
  { title: 'Contacto', body: 'Escríbenos por WhatsApp o por email y cuéntanos qué quieres reformar.' },
  { title: 'Visita y presupuesto gratis', body: 'Visitamos la vivienda y te damos un presupuesto claro y detallado antes de empezar. Gratis y sin compromiso.' },
  { title: 'Ejecución', body: 'Hacemos la obra según lo acordado y te mantenemos informado en cada fase.' },
]

export function StepsSection() {
  return <section className="reformas-section is-tinted" aria-labelledby="como-trabajamos">
    <h2 id="como-trabajamos">Cómo trabajamos</h2>
    <ol className="reformas-steps">{STEPS.map((step, index) => <li key={step.title}><span className="reformas-step-number">{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
  </section>
}

export function QuoteSection({ workType = '' }: { workType?: (typeof WORK_TYPES)[number] | '' }) {
  return <section className="reformas-section reformas-form-section" id="presupuesto" aria-labelledby="presupuesto-titulo">
    <h2 id="presupuesto-titulo">Pide tu presupuesto</h2>
    <p className="reformas-about">Cuéntanos qué quieres reformar y te contactamos para acordar una visita. <strong>La visita y el presupuesto son gratis y sin compromiso.</strong></p>
    <LeadForm defaultWorkType={workType} />
  </section>
}

export function GallerySection({ photos, title = 'Galería' }: { photos: { src: string; alt: string }[]; title?: string }) {
  if (photos.length === 0) return null
  return <section className="reformas-section" aria-labelledby="galeria">
    <h2 id="galeria">{title}</h2>
    <div className="reformas-gallery">{photos.map(photo => <figure key={photo.src} className="reformas-photo"><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption>{photo.alt}</figcaption></figure>)}</div>
    <p className="reformas-gallery-note">{REFORMAS_GALLERY_NOTE}</p>
  </section>
}

export function ReformasFooter() {
  return <footer className="reformas-footer" id="contacto">
    <ContactLinks />
    <p className="reformas-legal"><a href="/">Reformas en Barcelona</a> · <a href="/privacidad">Política de privacidad</a> · <CookieSettingsLink label="Configuración de cookies" /></p>
  </footer>
}
