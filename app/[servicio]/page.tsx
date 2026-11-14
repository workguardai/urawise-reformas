import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findService, REFORMAS_SERVICES, servicePhotos } from '@/lib/reformas-services'
import { SITE_URL } from '@/lib/reformas'
import { ContactButtons } from '@/app/contact-buttons'
import { AppSection, Check, Eyebrow, FreeQuoteBadge, GallerySection, HeroMosaic, QuoteSection, ReformasFooter, ReformasHeader, ServiceTiles, StepsSection, TrustStrip } from '@/app/parts'

// One page per renovation service (e.g. /banos), in Spanish, for Google Ads sitelinks and search.

export const dynamicParams = false
export const generateStaticParams = () => REFORMAS_SERVICES.map(service => ({ servicio: service.slug }))

export async function generateMetadata({ params }: { params: Promise<{ servicio: string }> }): Promise<Metadata> {
  const service = findService((await params).servicio)
  if (!service) return {}
  const url = `${SITE_URL}/${service.slug}`
  return { title: service.metaTitle, description: service.metaDescription, alternates: { canonical: url }, openGraph: { title: service.h1, description: service.metaDescription, url, locale: 'es_ES', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'UraWise' }] } }
}

export default async function ServicePage({ params }: { params: Promise<{ servicio: string }> }) {
  const service = findService((await params).servicio)
  if (!service) notFound()
  const others = REFORMAS_SERVICES.filter(item => item.slug !== service.slug)
  return <main className="reformas-page" lang="es">
    <ReformasHeader />

    <section className="reformas-hero">
      <div className="reformas-hero-text">
        <p className="reformas-breadcrumb"><a href="/">Reformas en Barcelona</a> › {service.card.title}</p>
        <h1 className="is-service">{service.h1}</h1>
        <p>{service.intro}</p>
        <FreeQuoteBadge />
        <ContactButtons />
        <p className="reformas-hero-form-link"><a href="#presupuesto">o pide tu presupuesto gratis con el formulario ↓</a></p>
      </div>
      <HeroMosaic />
      <TrustStrip />
    </section>

    <QuoteSection workType={service.workType} />

    <section className="reformas-section" aria-labelledby="incluye">
      <Eyebrow>{service.card.title}</Eyebrow>
      <h2 id="incluye">{service.includesTitle}</h2>
      <ul className="reformas-includes">{service.includes.map(item => <li key={item}><Check />{item}</li>)}</ul>
      <p className="reformas-about reformas-includes-note">Cada obra es distinta: en la visita vemos contigo qué necesitas y lo detallamos en el presupuesto.</p>
    </section>

    <StepsSection />
    <GallerySection photos={servicePhotos(service)} title="Trabajos anteriores" />

    <section className="reformas-section is-tinted" aria-labelledby="otros">
      <Eyebrow>Qué más hacemos</Eyebrow>
      <h2 id="otros">Otros servicios</h2>
      <ServiceTiles services={others} />
    </section>

    <AppSection />

    <ReformasFooter />
  </main>
}
