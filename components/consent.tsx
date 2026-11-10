'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

// Cookie consent, the Google tag and the Meta Pixel (Spanish only here).

/** "_v2" since Meta was added: an earlier "Accept" only covered Google, so those visitors are asked again. */
export const CONSENT_COOKIE = 'urawise_consent_v2'
export const CONSENT_EVENT = 'urawise:consent'
const OPEN_EVENT = 'urawise:consent-open'
type Choice = 'all' | 'necessary' | null

const TEXT = {
  title: 'Cookies',
  text: 'Usamos cookies necesarias para que la web funcione. Con tu permiso también usamos cookies de analítica y publicidad (Google Analytics, Google Ads y Meta Pixel) para ver qué páginas ayudan a la gente y qué anuncios funcionan; nunca para vender tus datos.',
  accept: 'Aceptar analítica y publicidad',
  necessary: 'Solo necesarias',
  more: 'Política de privacidad',
}

/**
 * Google consent mode v2, "basic" implementation: Google's tags load only after "Accept", and then say consent was
 * granted; withdrawing it later (Cookie settings) tells the already-loaded tags straight away.
 */
const consentSignals = (state: 'granted' | 'denied') => ({ ad_storage: state, analytics_storage: state, ad_user_data: state, ad_personalization: state })

const readChoice = (): Choice => {
  const value = document.cookie.split('; ').find(item => item.startsWith(`${CONSENT_COOKIE}=`))?.split('=')[1]
  return value === 'all' || value === 'necessary' ? value : null
}
const META_PIXEL_ID = '1561501742641489'
type Fbq = (...args: unknown[]) => void
const fbq = () => (window as unknown as { fbq?: Fbq }).fbq

/** Reports an event to Meta. fbq only exists after "Accept", and stays on the page if consent is withdrawn later, so the choice is checked too. */
export function trackMeta(event: 'PageView' | 'Lead' | 'Contact') {
  if (readChoice() === 'all') fbq()?.('track', event)
}

const subscribe = (callback: () => void) => { window.addEventListener(CONSENT_EVENT, callback); return () => window.removeEventListener(CONSENT_EVENT, callback) }

/** The visitor's cookie choice: 'all', 'necessary', or null when they haven't chosen yet. Undefined on the server. */
export function useConsent(): Choice | undefined {
  return useSyncExternalStore(subscribe, readChoice, () => undefined)
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT))

/** Asks once; "Only necessary" is as easy as "Accept". Analytics and ads tags load only after "Accept". */
export function ConsentBanner() {
  const choice = useConsent()
  const [reopened, setReopened] = useState(false)
  useSyncExternalStore(
    callback => { const open = () => { setReopened(true); callback() }; window.addEventListener(OPEN_EVENT, open); return () => window.removeEventListener(OPEN_EVENT, open) },
    () => 0, () => 0,
  )
  if (choice === undefined || (choice !== null && !reopened)) return null
  const choose = (value: 'all' | 'necessary') => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (value === 'necessary' && gtag) gtag('consent', 'update', consentSignals('denied'))
    fbq()?.('consent', value === 'all' ? 'grant' : 'revoke')
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax${location.protocol === 'https:' ? '; secure' : ''}`
    setReopened(false)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }
  return <div className="consent-banner" role="dialog" aria-live="polite" aria-label={TEXT.title}>
    <p><strong>{TEXT.title}</strong> {TEXT.text} <a href="/privacidad#cookies">{TEXT.more}</a></p>
    <div className="consent-actions">
      <button type="button" className="auth-submit secondary" onClick={() => choose('necessary')}>{TEXT.necessary}</button>
      <button type="button" className="auth-submit" onClick={() => choose('all')}>{TEXT.accept}</button>
    </div>
  </div>
}

/** Google Analytics and Google Ads, only with consent. Same IDs as www.urawise.eu. */
export function Analytics() {
  if (useConsent() !== 'all') return null
  return <>
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-0S36L0HQ2Z" strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('consent', 'default', ${JSON.stringify(consentSignals('granted'))});
      gtag('js', new Date());
      gtag('config', 'G-0S36L0HQ2Z');
      gtag('config', 'AW-18368007697');
    `}</Script>
  </>
}

/** Meta's standard base code, only with consent. Its <noscript> image is left out on purpose: it would fire before any choice. */
export function MetaPixel() {
  const consent = useConsent()
  // The base code counts the page it loads on; the only in-app navigation after that is the form's move to /gracias.
  const pathname = usePathname()
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    trackMeta('PageView')
  }, [pathname])
  if (consent !== 'all') return null
  return <Script id="meta-pixel" strategy="afterInteractive">{`
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `}</Script>
}

export function CookieSettingsLink({ label }: { label: string }) {
  return <button type="button" className="cookie-settings-link" onClick={openCookieSettings}>{label}</button>
}
