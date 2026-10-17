'use client'

import { useEffect } from 'react'
import { useConsent } from '@/components/consent'
import { LEAD_HANDOFF_KEY } from '@/app/lead-form'
import { REFORMAS_ADS_CONVERSIONS } from '@/lib/reformas'
import { toE164 } from '@/lib/leads'

type Gtag = (...args: unknown[]) => void

/**
 * Reports the form conversion once, only right after a real submission in this tab (opening this page directly counts
 * nothing). Waits for cookie consent; the lead ID is the transaction ID, so Google never counts the same request twice.
 * With consent, the email/phone go to Google hashed (Enhanced Conversions) for more accurate measurement.
 */
export function FormConversion() {
  const consent = useConsent()
  useEffect(() => {
    if (consent !== 'all') return
    let lead: { id: string; email: string; phone: string } | null = null
    try { lead = JSON.parse(sessionStorage.getItem(LEAD_HANDOFF_KEY) ?? 'null') } catch {}
    if (!lead?.id) return
    const handoff = lead
    // The Google tag loads just after consent; give it a moment.
    let tries = 0
    const timer = window.setInterval(() => {
      const gtag = (window as unknown as { gtag?: Gtag }).gtag
      if (!gtag && ++tries < 25) return
      window.clearInterval(timer)
      if (!gtag) return
      const phone = toE164(handoff.phone)
      gtag('set', 'user_data', { ...(handoff.email ? { email: handoff.email } : {}), ...(phone ? { phone_number: phone } : {}) })
      gtag('event', 'generate_lead', { method: 'form', page: 'reformas' })
      if (REFORMAS_ADS_CONVERSIONS.form) gtag('event', 'conversion', { send_to: REFORMAS_ADS_CONVERSIONS.form, transaction_id: handoff.id })
      try { sessionStorage.removeItem(LEAD_HANDOFF_KEY) } catch {}
    }, 200)
    return () => window.clearInterval(timer)
  }, [consent])
  return null
}
