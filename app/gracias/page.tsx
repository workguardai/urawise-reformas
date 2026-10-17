import type { Metadata } from 'next'
import { FormConversion } from '@/app/gracias/conversion'
import { ContactButtons } from '@/app/contact-buttons'

export const metadata: Metadata = { title: 'Gracias | Reformas en Barcelona', robots: { index: false } }

/** Shown after the quote form is sent. It's also where the form conversion is reported (see FormConversion). */
export default function GraciasPage() {
  return <main className="reformas-page" lang="es">
    <header className="reformas-header"><a className="wordmark" href="/">URAWISE<span>.</span></a></header>
    <section className="reformas-hero">
      <h1>¡Gracias!</h1>
      <p>Hemos recibido tu solicitud. Te contactaremos pronto para hablar de tu reforma y, si te parece bien, acordar una visita.</p>
      <p className="reformas-thanks-more">¿Prefieres hablar ya? Escríbenos:</p>
      <ContactButtons />
      <p><a className="text-link" href="/">← Volver a Reformas en Barcelona</a></p>
    </section>
    <FormConversion />
  </main>
}
