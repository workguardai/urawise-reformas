import type { CSSProperties, ReactNode } from 'react'
import { CookieSettingsLink } from '@/components/consent'
import { REFORMAS_DETAILS, REFORMAS_GALLERY_NOTE, REFORMAS_PHOTOS } from '@/lib/reformas'
import { REFORMAS_SERVICES, servicePhotos, type ReformasService } from '@/lib/reformas-services'
import { AppLink, ContactLinks } from '@/app/contact-buttons'
import { LeadForm } from '@/app/lead-form'
import type { WORK_TYPES } from '@/lib/leads'

// Pieces shared by all pages. The design is built like a tiled wall: crystal-blue "glass" tiles next to close-ups of
// real materials from our projects, separated by grout lines.

export function ReformasHeader({ home = false, formHref = '#presupuesto' }: { home?: boolean; formHref?: string }) {
  return <header className="reformas-header">
    {home ? <span className="wordmark">URAWISE<span>.</span></span> : <a className="wordmark" href="/">URAWISE<span>.</span></a>}
    <span className="reformas-header-tag">Reformas · Barcelona</span>
    <a className="reformas-header-cta" href={formHref}>Pide presupuesto</a>
  </header>
}

/** A small section label with a tile in front of it. */
export const Eyebrow = ({ children, light = false }: { children: ReactNode; light?: boolean }) =>
  <p className={`reformas-eyebrow${light ? ' is-light' : ''}`}><span aria-hidden="true" />{children}</p>

/** Shown in every hero: the thing people searching for "presupuesto" want to know first. */
export function FreeQuoteBadge() {
  return <p className="reformas-free"><Check />Visita y presupuesto gratis · Sin compromiso</p>
}

export const Check = () => <svg className="reformas-check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.3 12.6 4.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

type Tile = { photo?: string; label?: string; strong?: string; tone?: 'glass' | 'deep' | 'clear' }
const MOSAIC: Tile[] = [
  { photo: REFORMAS_DETAILS.greenTile }, { tone: 'glass', label: 'Visita', strong: 'gratis' }, { photo: REFORMAS_DETAILS.mosaic },
  { tone: 'deep', label: 'Sigue tu obra', strong: 'en la app' }, { photo: REFORMAS_DETAILS.stone }, { tone: 'clear' },
  { photo: REFORMAS_DETAILS.pavers }, { tone: 'glass', label: 'Presupuesto', strong: 'claro' }, { photo: REFORMAS_PHOTOS[0].src },
]

/** The hero's tiled wall: tiles are "laid" one after another, diagonally (decorative; the same facts are in the text). */
export function HeroMosaic() {
  return <div className="tile-wall" aria-hidden="true">
    {MOSAIC.map((tile, index) => <div key={index} className={`tile${tile.photo ? ' is-photo' : ` is-${tile.tone}`}`}
      style={{ '--d': `${(Math.floor(index / 3) + index % 3) * 90}ms` } as CSSProperties}>
      {tile.photo ? <img src={tile.photo} alt="" /> : tile.label && <span><small>{tile.label}</small>{tile.strong}</span>}
    </div>)}
  </div>
}

/** What every client gets, in short; all taken from how we work (below). */
export function TrustStrip() {
  return <ul className="reformas-trust">
    {['Visita y presupuesto gratis', 'Presupuesto claro y detallado antes de empezar', 'Te informamos en cada fase', 'Sigue la obra en la app Urawise'].map(item => <li key={item}><Check />{item}</li>)}
  </ul>
}

export const STEPS = [
  { title: 'Contacto', body: 'Escríbenos por WhatsApp o por email y cuéntanos qué quieres reformar.' },
  { title: 'Visita y presupuesto gratis', body: 'Visitamos la vivienda y te damos un presupuesto claro y detallado antes de empezar. Gratis y sin compromiso.' },
  { title: 'Ejecución', body: 'Hacemos la obra según lo acordado y te mantenemos informado en cada fase.' },
]

/** Drawn like a plan: a navy blueprint with a measuring line through the three steps. */
export function StepsSection() {
  return <section className="reformas-section is-blueprint" aria-labelledby="como-trabajamos">
    <Eyebrow light>El proceso</Eyebrow>
    <h2 id="como-trabajamos">Cómo trabajamos</h2>
    <ol className="reformas-steps">{STEPS.map((step, index) => <li key={step.title}><span className="reformas-step-number">{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
  </section>
}

export function QuoteSection({ workType = '' }: { workType?: (typeof WORK_TYPES)[number] | '' }) {
  return <section className="reformas-section reformas-form-section" id="presupuesto" aria-labelledby="presupuesto-titulo">
    <div className="reformas-quote-intro">
      <Eyebrow>Presupuesto</Eyebrow>
      <h2 id="presupuesto-titulo">Pide tu presupuesto</h2>
      <p className="reformas-about">Cuéntanos qué quieres reformar y te contactamos para acordar una visita. <strong>La visita y el presupuesto son gratis y sin compromiso.</strong></p>
      <ul className="reformas-quote-points">{['Visitamos la vivienda', 'Presupuesto claro y detallado', 'Sin compromiso'].map(item => <li key={item}><Check />{item}</li>)}</ul>
    </div>
    <div className="reformas-form-card"><LeadForm defaultWorkType={workType} /></div>
  </section>
}

/** Service tiles: a photo from a matching project when there is one, else a crystal tile with the service number.
 * "featured" (home page, all five services): the first one is a large tile, so the five fill a 3 × 2 grid. */
export function ServiceTiles({ services, featured = false }: { services: ReformasService[]; featured?: boolean }) {
  return <ul className={`reformas-services${featured ? ' is-featured' : ''}`}>{services.map(service => {
    const number = String(REFORMAS_SERVICES.indexOf(service) + 1).padStart(2, '0')
    const photo = servicePhotos(service)[0]
    // A whole renovation (the first service) shows all four materials, as a small tiled wall.
    const media = service === REFORMAS_SERVICES[0]
      ? <span className="reformas-service-media is-mosaic" aria-hidden="true">{Object.values(REFORMAS_DETAILS).map(src => <img key={src} src={src} alt="" loading="lazy" />)}</span>
      : <span className={`reformas-service-media${photo ? '' : ' is-empty'}`} aria-hidden="true">{photo ? <img src={photo.src} alt="" loading="lazy" /> : <b>{number}</b>}</span>
    return <li key={service.slug}>
      <a className="reformas-service-link" href={`/${service.slug}`}>
        {media}
        <span className="reformas-service-body"><small>{number}</small><h3>{service.card.title}</h3><p>{service.card.body}</p><span className="reformas-more">Ver más →</span></span>
      </a>
    </li>
  })}</ul>
}

export function GallerySection({ photos, title = 'Galería' }: { photos: { src: string; alt: string }[]; title?: string }) {
  if (photos.length === 0) return null
  return <section className="reformas-section" aria-labelledby="galeria">
    <Eyebrow>Obras</Eyebrow>
    <h2 id="galeria">{title}</h2>
    <div className="reformas-gallery">{photos.map(photo => <figure key={photo.src} className="reformas-photo"><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption>{photo.alt}</figcaption></figure>)}</div>
    <p className="reformas-gallery-note">{REFORMAS_GALLERY_NOTE}</p>
  </section>
}

/** An illustration of a renovation followed in the Urawise app (an example, not a real project). */
export function PhoneMockup() {
  return <figure className="reformas-phone-wrap">
    <div className="reformas-phone" aria-hidden="true">
      <div className="phone-screen">
        <p className="phone-top"><span className="wordmark">URAWISE<span>.</span></span><span>Ejemplo</span></p>
        <p className="phone-title">Reforma de baño</p>
        <p className="phone-chip"><Check />Acuerdo aprobado por ambos</p>
        <ol className="phone-phases">
          <li className="is-done">Desmontaje</li>
          <li className="is-done">Fontanería y electricidad</li>
          <li className="is-now">Alicatado <em>en curso</em></li>
          <li>Montaje</li>
        </ol>
        <div className="phone-photos"><img src={REFORMAS_DETAILS.mosaic} alt="" /><img src={REFORMAS_DETAILS.greenTile} alt="" /><img src={REFORMAS_PHOTOS[4].src} alt="" /></div>
        <div className="phone-change"><small>Cambio propuesto</small><strong>Enchufe adicional</strong><span>Pendiente de tu aprobación</span><p><b>Aprobar</b><i>Comentar</i></p></div>
      </div>
    </div>
    <figcaption>Ejemplo de cómo se sigue una obra en la app Urawise.</figcaption>
  </figure>
}

/** For visitors who already have a renovation company, and for renovation companies: the app keeps both sides on the same page. */
export function AppSection() {
  return <section className="reformas-section is-app" aria-labelledby="app-urawise">
    <Eyebrow>Para todos</Eyebrow>
    <h2 id="app-urawise">La app Urawise</h2>
    <p className="reformas-about">¿Ya trabajas con una empresa de reformas, o tienes una? Con la app Urawise, propietario y empresa acuerdan la obra por escrito, siguen cada fase con fotos y aprueban los cambios antes de hacerlos.</p>
    <ul className="reformas-app">
      <li className="is-light"><h3>Para propietarios</h3><p>Gratis, siempre. Invita a la empresa con la que ya trabajas y aprueba cada cambio antes de que afecte al precio.</p><AppLink audience="homeowners">Conoce la app para propietarios →</AppLink></li>
      <li className="is-dark"><h3>Para empresas de reformas</h3><p>Tu primer proyecto activo es gratis. Actualiza el avance desde el móvil y consigue por escrito la aprobación de los trabajos extra.</p><AppLink audience="contractors">Conoce la app para empresas →</AppLink></li>
    </ul>
  </section>
}

export function ReformasFooter() {
  return <footer className="reformas-footer" id="contacto">
    <div className="reformas-footer-top">
      <div><span className="wordmark">URAWISE<span>.</span></span><p>Reformas en Barcelona y alrededores: pisos, villas y jardines.</p></div>
      <ContactLinks />
    </div>
    <p className="reformas-legal"><a href="/">Reformas en Barcelona</a> · <a href="/privacidad">Política de privacidad</a> · <CookieSettingsLink label="Configuración de cookies" /></p>
  </footer>
}
