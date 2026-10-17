'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConsent } from '@/components/consent'
import { submitLead, type LeadFormState } from '@/app/actions'
import { WORK_TYPES } from '@/lib/leads'

/** Handed from the form to the thank-you page (same tab only), which reports the conversion once and then forgets it. */
export const LEAD_HANDOFF_KEY = 'reformas-lead'
const CLICK_KEY = 'reformas-click'
type Click = { gclid: string; gbraid: string; wbraid: string; source: string }

/** Google's click IDs from the ad visit, kept for this tab while the visitor looks around. */
function readClick(): Click {
  const params = new URLSearchParams(window.location.search)
  let stored: Partial<Click> = {}
  try { stored = JSON.parse(sessionStorage.getItem(CLICK_KEY) ?? '{}') } catch {}
  const click = {
    gclid: params.get('gclid') ?? stored.gclid ?? '', gbraid: params.get('gbraid') ?? stored.gbraid ?? '', wbraid: params.get('wbraid') ?? stored.wbraid ?? '',
    source: params.get('src') ?? params.get('utm_source') ?? stored.source ?? '',
  }
  try { sessionStorage.setItem(CLICK_KEY, JSON.stringify(click)) } catch {}
  return click
}

export function LeadForm({ defaultWorkType = '' }: { defaultWorkType?: string }) {
  const router = useRouter()
  const consent = useConsent()
  const [startedAt] = useState(() => Date.now())
  const [state, action, pending] = useActionState(async (prev: LeadFormState, formData: FormData) => {
    // Ad click IDs are only kept with the visitor's consent to advertising cookies.
    const click = readClick()
    for (const key of ['gclid', 'gbraid', 'wbraid'] as const) formData.set(key, consent === 'all' ? click[key] : '')
    formData.set('source', click.source)
    const result = await submitLead(prev, formData)
    if (result.leadId) {
      // Ignored (bot) submissions still see the thank-you page but are never counted as conversions.
      if (!result.ignored) try { sessionStorage.setItem(LEAD_HANDOFF_KEY, JSON.stringify({ id: result.leadId, email: String(formData.get('email') ?? ''), phone: String(formData.get('phone') ?? '') })) } catch {}
      router.push('/gracias')
    }
    return result
  }, {})
  // Remember the ad click for this tab, in case the visitor opens other pages before sending the form.
  useEffect(() => { readClick() }, [])

  return <form action={action} className="reformas-form">
    <div className="reformas-form-grid">
      <label>Nombre<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Teléfono<input name="phone" type="tel" required maxLength={30} autoComplete="tel" inputMode="tel" placeholder="600 000 000" /></label>
      <label>Email <small>(opcional)</small><input name="email" type="email" maxLength={200} autoComplete="email" /></label>
      <label>Zona o código postal<input name="area" required maxLength={100} placeholder="p. ej. Gràcia, 08012" /></label>
      <label className="is-wide">Tipo de trabajo<select name="workType" required defaultValue={defaultWorkType}><option value="" disabled>Elige una opción</option>{WORK_TYPES.map(type => <option key={type}>{type}</option>)}</select></label>
      <label className="is-wide">Cuéntanos qué quieres reformar<textarea name="description" required minLength={10} maxLength={3000} rows={5} placeholder="Qué estancias, tamaño aproximado, materiales que te gustan, cuándo te gustaría empezar…" /></label>
    </div>
    {/* Left empty by people; bots fill it in. */}
    <label className="reformas-hp" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <input type="hidden" name="startedAt" value={startedAt} />
    <p className="reformas-form-note">Usamos tus datos solo para responder a tu solicitud y preparar el presupuesto. Más información en la <a href="/privacidad">política de privacidad</a>.</p>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button className="reformas-button is-submit" disabled={pending || Boolean(state.leadId)}>{pending || state.leadId ? 'Enviando…' : 'Enviar solicitud'}</button>
  </form>
}
