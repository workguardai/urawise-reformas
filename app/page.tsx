import type { Metadata } from 'next'
import { APP_URL, REFORMAS_PHOTOS, SITE_URL } from '@/lib/reformas'
import { REFORMAS_SERVICES } from '@/lib/reformas-services'
import { ContactButtons } from '@/app/contact-buttons'
import { AppSection, Eyebrow, FreeQuoteBadge, GallerySection, HeroMosaic, PhoneMockup, QuoteSection, ReformasFooter, ReformasHeader, ServiceTiles, StepsSection, TrustStrip } from '@/app/parts'

// Home page of reformas.urawise.eu: the Barcelona renovation campaign (Google Ads). Spanish, public, and
// separate from the platform's pages: no app navigation or sign-in. "Sobre Urawise" says openly that Urawise also makes the app.
// Each service has its own page (/<slug>), used as Google Ads sitelinks.

export const metadata: Metadata = {
  title: 'Reformas en Barcelona | Urawise',
  description: 'Reformas de pisos, villas y jardines en Barcelona y alrededores. Visita y presupuesto gratis y sin compromiso.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { title: 'Reformas en Barcelona', description: 'Pisos, villas y jardines, con presupuesto claro antes de empezar.', url: `${SITE_URL}/`, locale: 'es_ES', type: 'website' },
}

export default function ReformasPage() {
  return <main className="reformas-page" lang="es">
    <ReformasHeader home />

    <section className="reformas-hero">
      <div className="reformas-hero-text">
        <Eyebrow>Barcelona y alrededores</Eyebrow>
        <h1>Reformas en <em>Barcelona</em></h1>
        <p>Pisos, villas y jardines, con presupuesto claro antes de empezar.</p>
        <FreeQuoteBadge />
        <ContactButtons />
        <p className="reformas-hero-form-link"><a href="#presupuesto">o pide tu presupuesto gratis con el formulario ↓</a></p>
      </div>
      <HeroMosaic />
      <TrustStrip />
    </section>

    <QuoteSection />

    <section className="reformas-section is-tinted" aria-labelledby="servicios">
      <Eyebrow>Qué hacemos</Eyebrow>
      <h2 id="servicios">Servicios</h2>
      <ServiceTiles services={REFORMAS_SERVICES} featured />
    </section>

    <StepsSection />
    <GallerySection photos={REFORMAS_PHOTOS} />

    <section className="reformas-section is-tinted reformas-about-section" aria-labelledby="sobre">
      <div>
        <Eyebrow>Quiénes somos</Eyebrow>
        <h2 id="sobre">Sobre Urawise</h2>
        <p className="reformas-about">Hacemos reformas en Barcelona y alrededores: pisos, villas y jardines. Antes de empezar visitamos la vivienda y te damos un presupuesto claro, para que sepas desde el principio qué se hace y cuánto cuesta.</p>
        <p className="reformas-about">Además de hacer reformas, en Urawise desarrollamos una aplicación con la que propietarios y profesionales acuerdan la obra por escrito, siguen cada fase con fotos y aprueban los cambios antes de hacerlos. Si nos encargas tu reforma, puedes seguirla en la app; es opcional. <a className="text-link" href={APP_URL}>Conoce la app Urawise</a></p>
        <ContactButtons />
      </div>
      <PhoneMockup />
    </section>

    <AppSection />

    <ReformasFooter />
  </main>
}
