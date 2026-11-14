import { createHash } from 'node:crypto'

// Meta Conversions API: the form's Lead, sent from our server as well as from the browser pixel. Both carry the same
// event_id (the lead's ID), so Meta counts it once, and still gets it when the browser pixel is blocked.
// Only sent when the visitor accepted cookies. Server-only (node:crypto).

/** Marketing API version; Meta retires each about a year after the next one comes out (v25.0: February 2026). */
const GRAPH_URL = 'https://graph.facebook.com/v25.0'

export type MetaLead = {
  pixelId: string
  /** The lead's ID, also used by the browser pixel as eventID. */
  eventId: string
  /** Seconds since 1970. */
  eventTime: number
  sourceUrl: string
  email: string | null
  /** International format, e.g. +34600111222. */
  phone: string | null
  ip: string | null
  userAgent: string | null
  /** The _fbp and _fbc cookies, as the pixel set them. */
  fbp: string | null
  fbc: string | null
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

/** The event as Meta expects it: email and phone normalised and hashed, the rest as is; empty values left out. */
export function leadEvent(lead: MetaLead) {
  const userData: Record<string, string | string[]> = {}
  if (lead.email?.trim()) userData.em = [sha256(lead.email.trim().toLowerCase())]
  if (lead.phone) userData.ph = [sha256(lead.phone.replace(/\D/g, '').replace(/^0+/, ''))]
  if (lead.ip) userData.client_ip_address = lead.ip
  if (lead.userAgent) userData.client_user_agent = lead.userAgent
  if (lead.fbp) userData.fbp = lead.fbp
  if (lead.fbc) userData.fbc = lead.fbc
  return { event_name: 'Lead', event_time: lead.eventTime, event_id: lead.eventId, action_source: 'website', event_source_url: lead.sourceUrl, user_data: userData }
}

/** Sends the Lead. Never throws: a failure here must not affect the visitor's request. */
export async function sendMetaLead(lead: MetaLead) {
  const event = leadEvent(lead)
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!token) {
    console.warn(`[meta] META_CAPI_ACCESS_TOKEN not set; skipped Lead ${lead.eventId} (user_data: ${Object.keys(event.user_data).join(', ')})`)
    return
  }
  try {
    const testCode = process.env.META_CAPI_TEST_EVENT_CODE
    const response = await fetch(`${GRAPH_URL}/${lead.pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event], ...(testCode ? { test_event_code: testCode } : {}) }),
    })
    if (!response.ok) console.error(`[meta] Conversions API ${response.status} for Lead ${lead.eventId}: ${await response.text()}`)
  } catch (error) {
    console.error(`[meta] failed to send Lead ${lead.eventId}`, error)
  }
}
