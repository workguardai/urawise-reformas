const RESEND_URL = 'https://api.resend.com/emails'

// The Urawise app's email layout, sent through Resend.

export type Email = { to: string; subject: string; heading: string; paragraphs: string[]; action?: { label: string; url: string }; footer: string }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

function renderHtml(email: Email) {
  const paragraphs = email.paragraphs.map(text => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a5568">${escapeHtml(text)}</p>`).join('')
  const button = email.action ? `<p style="margin:28px 0"><a href="${escapeHtml(email.action.url)}" style="display:inline-block;background:#0a1628;color:#ffffff;text-decoration:none;padding:14px 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${escapeHtml(email.action.label)}</a></p>` : ''
  return `<!doctype html><html><body style="margin:0;background:#f8f9fa;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2edf5">
<tr><td style="padding:28px 32px 0;font-family:Georgia,serif;font-size:22px;letter-spacing:.2em;color:#0a1628">URAWISE<span style="color:#a8d8ea">.</span></td></tr>
<tr><td style="padding:24px 32px 8px"><h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:26px;line-height:1.2;color:#0a1628">${escapeHtml(email.heading)}</h1>${paragraphs}${button}</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid #e2edf5;font-size:12px;line-height:1.6;color:#718096">${escapeHtml(email.footer)}</td></tr>
</table></td></tr></table></body></html>`
}

function renderText(email: Email) {
  return [email.heading, '', ...email.paragraphs.flatMap(text => [text, '']), ...(email.action ? [`${email.action.label}: ${email.action.url}`, ''] : []), '—', email.footer].join('\n')
}

/** Sends through Resend. Never throws: a failed email must not undo the action that triggered it. */
export async function sendEmail(email: Email) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set; skipped "${email.subject}"`)
    return
  }
  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'UraWise <notifications@urawise.eu>',
        reply_to: process.env.EMAIL_REPLY_TO ?? 'ek@workguardai.com',
        to: [email.to],
        subject: email.subject,
        html: renderHtml(email),
        text: renderText(email),
      }),
    })
    if (!response.ok) console.error(`[email] Resend ${response.status} for "${email.subject}": ${await response.text()}`)
  } catch (error) {
    console.error(`[email] failed to send "${email.subject}"`, error)
  }
}
