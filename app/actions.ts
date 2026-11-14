'use server'

import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { LeadInput, toE164 } from '@/lib/leads'
import { sendMetaLead } from '@/lib/meta-capi'
import { APP_URL, CONSENT_COOKIE, META_PIXEL_ID, REFORMAS_EMAIL, SITE_URL } from '@/lib/reformas'

export type LeadFormState = { error?: string; leadId?: string; ignored?: boolean }

/** Saves a quote request in the Urawise app's renovation_leads table and emails it to us. The browser then opens the thank-you page. */
export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Bots fill in the hidden field or submit within a couple of seconds; pretend it worked and save nothing.
  const startedAt = Number(formData.get('startedAt'))
  if (String(formData.get('website') ?? '') || !startedAt || Date.now() - startedAt < 3000) return { leadId: crypto.randomUUID(), ignored: true }

  const read = (name: string) => String(formData.get(name) ?? '')
  const parsed = LeadInput.safeParse({
    name: read('name'), phone: read('phone'), email: read('email'), area: read('area'), workType: read('workType'), description: read('description'),
    gclid: read('gclid'), gbraid: read('gbraid'), wbraid: read('wbraid'), source: read('source'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos del formulario.' }
  const lead = parsed.data

  // The same phone number a few times a day is a duplicate or abuse.
  const { rows: [{ recent }] } = await db().query<{ recent: number }>(
    `select count(*)::int as recent from renovation_leads where phone = $1 and created_at >= now() - interval '24 hours'`, [lead.phone])
  if (recent >= 3) return { error: 'Ya hemos recibido tu solicitud. Te contactaremos pronto.' }

  const { rows: [saved] } = await db().query<{ id: string }>(
    `insert into renovation_leads (name, phone, email, area, work_type, description, gclid, gbraid, wbraid, source)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
    [lead.name, lead.phone, lead.email, lead.area, lead.workType, lead.description, lead.gclid, lead.gbraid, lead.wbraid, lead.source])
  if (REFORMAS_EMAIL) after(() => sendEmail({
    to: REFORMAS_EMAIL,
    subject: `Nueva solicitud de presupuesto: ${lead.workType} — ${lead.area}`,
    heading: 'Nueva solicitud de presupuesto',
    paragraphs: [
      `Nombre: ${lead.name}`, `Teléfono: ${lead.phone}`, `Email: ${lead.email ?? '—'}`, `Zona: ${lead.area}`, `Trabajo: ${lead.workType}`,
      `Descripción: ${lead.description}`, `Origen: ${lead.source ?? (lead.gclid || lead.gbraid || lead.wbraid ? 'google' : '—')}${lead.gclid || lead.gbraid || lead.wbraid ? ' (anuncio de Google)' : ''}`,
    ],
    action: { label: 'Ver solicitudes', url: `${APP_URL}/admin/leads` },
    footer: 'Enviado desde el formulario de reformas.urawise.eu.',
  }))
  await reportLeadToMeta(saved.id, lead, String(formData.get('fbclid') ?? ''))
  return { leadId: saved.id }
}

/** The Conversions API copy of the browser's Lead (same event ID), only for visitors who accepted cookies. */
async function reportLeadToMeta(leadId: string, lead: LeadInput, fbclid: string) {
  const cookieStore = await cookies()
  if (cookieStore.get(CONSENT_COOKIE)?.value !== 'all') return
  const headerStore = await headers()
  // The page the form was sent from, without its query string.
  let sourceUrl = `${SITE_URL}/`
  try { const page = new URL(headerStore.get('referer') ?? ''); sourceUrl = `${SITE_URL}${page.pathname}` } catch {}
  // The pixel sets _fbc when the visitor lands from an ad with consent; if they accepted later, build it from the click ID.
  const fbc = cookieStore.get('_fbc')?.value ?? (/^[\w-]{10,500}$/.test(fbclid) ? `fb.1.${Date.now()}.${fbclid}` : null)
  const metaLead = {
    pixelId: META_PIXEL_ID, eventId: leadId, eventTime: Math.floor(Date.now() / 1000), sourceUrl,
    email: lead.email, phone: toE164(lead.phone),
    ip: headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || headerStore.get('x-real-ip'),
    userAgent: headerStore.get('user-agent'), fbp: cookieStore.get('_fbp')?.value ?? null, fbc,
  }
  after(() => sendMetaLead(metaLead))
}
