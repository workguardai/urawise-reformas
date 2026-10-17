'use client'

import { APP_URL, REFORMAS_ADS_CONVERSIONS, REFORMAS_EMAIL, REFORMAS_EMAIL_SUBJECT, REFORMAS_WHATSAPP, REFORMAS_WHATSAPP_TEXT } from '@/lib/reformas'

type Gtag = (...args: unknown[]) => void

/** Reports a contact click to GA4 (and Google Ads, once a conversion is set up). gtag only exists after cookie consent. */
function track(method: 'whatsapp' | 'email') {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (!gtag) return
  gtag('event', 'generate_lead', { method, page: 'reformas' })
  if (REFORMAS_ADS_CONVERSIONS[method]) gtag('event', 'conversion', { send_to: REFORMAS_ADS_CONVERSIONS[method] })
}

export const whatsappHref = REFORMAS_WHATSAPP ? `https://wa.me/${REFORMAS_WHATSAPP}?text=${encodeURIComponent(REFORMAS_WHATSAPP_TEXT)}` : null
export const emailHref = REFORMAS_EMAIL ? `mailto:${REFORMAS_EMAIL}?subject=${encodeURIComponent(REFORMAS_EMAIL_SUBJECT)}` : null

export function ContactButtons() {
  return <div className="reformas-actions">
    {whatsappHref
      ? <a className="reformas-button is-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp')}>Escríbenos por WhatsApp</a>
      : <span className="reformas-button is-whatsapp is-placeholder" aria-disabled="true">Escríbenos por WhatsApp <small>[falta el número]</small></span>}
    {emailHref
      ? <a className="reformas-button is-email" href={emailHref} onClick={() => track('email')}>Pide presupuesto por email</a>
      : <span className="reformas-button is-email is-placeholder" aria-disabled="true">Pide presupuesto por email <small>[falta el email]</small></span>}
  </div>
}

export function ContactLinks() {
  return <ul className="reformas-contact-list">
    <li>WhatsApp: {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp')}>+{REFORMAS_WHATSAPP}</a> : <span className="reformas-placeholder">[Pendiente: número de WhatsApp]</span>}</li>
    <li>Email: {emailHref ? <a href={emailHref} onClick={() => track('email')}>{REFORMAS_EMAIL}</a> : <span className="reformas-placeholder">[Pendiente: email de contacto]</span>}</li>
  </ul>
}

/** To the Urawise app's pitch for homeowners or contractors; the app records ?src=reformas as the signup source. */
export function AppLink({ audience, children }: { audience: 'homeowners' | 'contractors'; children: React.ReactNode }) {
  const onClick = () => (window as unknown as { gtag?: Gtag }).gtag?.('event', 'app_link', { audience, page: 'reformas' })
  return <a className="reformas-more" href={`${APP_URL}/?src=reformas#${audience}`} onClick={onClick}>{children}</a>
}
