'use client'

import Script from 'next/script'
import { useState, useSyncExternalStore } from 'react'

// Cookie consent and the Google tag, as on the Urawise app (Spanish only here).

export const CONSENT_COOKIE = 'urawise_consent'
export const CONSENT_EVENT = 'urawise:consent'
const OPEN_EVENT = 'urawise:consent-open'
type Choice = 'all' | 'necessary' | null

const TEXT = {
  title: 'Cookies',
  text: 'Usamos cookies necesarias para que la web funcione. Con tu permiso también usamos cookies de analítica y publicidad (Google Analytics y Google Ads) para ver qué páginas ayudan a la gente y qué anuncios funcionan; nunca para vender tus datos.',
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

export function CookieSettingsLink({ label }: { label: string }) {
  return <button type="button" className="cookie-settings-link" onClick={openCookieSettings}>{label}</button>
}
