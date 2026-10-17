import { z } from 'zod'

// Quote requests from the form: validation, shared by the browser form and the server action.
// Same rules as the Urawise app, since both write to its renovation_leads table.

export const WORK_TYPES = ['Reforma integral', 'Cocina', 'Baño', 'Pintura', 'Alicatado y solados', 'Pavimentación', 'Jardín', 'Otro'] as const

const clickId = z.string().trim().max(200).regex(/^[\w-]*$/).optional().transform(value => value || null)

export const LeadInput = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(100),
  phone: z.string().trim().min(6, 'Escribe un teléfono de contacto.').max(30).regex(/^[+\d\s().-]+$/, 'El teléfono no parece correcto.'),
  email: z.union([z.literal(''), z.email('El email no parece correcto.').max(200)]).transform(value => value || null),
  area: z.string().trim().min(2, 'Indica la zona o el código postal.').max(100),
  workType: z.enum(WORK_TYPES, 'Elige el tipo de trabajo.'),
  description: z.string().trim().min(10, 'Cuéntanos un poco más sobre la reforma (al menos una frase).').max(3000),
  gclid: clickId, gbraid: clickId, wbraid: clickId,
  source: z.string().trim().max(60).regex(/^[\w.-]*$/).optional().transform(value => value || null),
})
export type LeadInput = z.infer<typeof LeadInput>

/** A phone number in international form (+34…), for Google's Enhanced Conversions. Spanish numbers without a prefix get +34. */
export function toE164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '').replace(/^00/, '+')
  if (digits.startsWith('+')) return /^\+\d{8,15}$/.test(digits) ? digits : null
  if (/^[6789]\d{8}$/.test(digits)) return `+34${digits}`
  return null
}
