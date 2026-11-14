'use client'

import { trackMeta } from '@/components/consent'
import { APP_URL, REFORMAS_ADS_CONVERSIONS, REFORMAS_EMAIL, REFORMAS_EMAIL_SUBJECT, REFORMAS_WHATSAPP, REFORMAS_WHATSAPP_TEXT } from '@/lib/reformas'

type Gtag = (...args: unknown[]) => void

/** Reports a contact click (WhatsApp or email) to Meta, GA4 and Google Ads. Each only runs after cookie consent. */
function track(method: 'whatsapp' | 'email') {
  trackMeta('Contact')
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (!gtag) return
  gtag('event', 'generate_lead', { method, page: 'reformas' })
  if (REFORMAS_ADS_CONVERSIONS[method]) gtag('event', 'conversion', { send_to: REFORMAS_ADS_CONVERSIONS[method] })
}

export const whatsappHref = REFORMAS_WHATSAPP ? `https://wa.me/${REFORMAS_WHATSAPP}?text=${encodeURIComponent(REFORMAS_WHATSAPP_TEXT)}` : null
export const emailHref = REFORMAS_EMAIL ? `mailto:${REFORMAS_EMAIL}?subject=${encodeURIComponent(REFORMAS_EMAIL_SUBJECT)}` : null

const WhatsAppIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3Z" /></svg>
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M3.5 6.5h17v11h-17zM3.8 7l8.2 6.2L20.2 7" /></svg>

export function ContactButtons() {
  return <div className="reformas-actions">
    {whatsappHref
      ? <a className="reformas-button is-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp')}><WhatsAppIcon />Escríbenos por WhatsApp</a>
      : <span className="reformas-button is-whatsapp is-placeholder" aria-disabled="true">Escríbenos por WhatsApp <small>[falta el número]</small></span>}
    {emailHref
      ? <a className="reformas-button is-email" href={emailHref} onClick={() => track('email')}><MailIcon />Pide presupuesto por email</a>
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
