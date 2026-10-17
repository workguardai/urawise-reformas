import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'UraWise'

/** The card WhatsApp, iMessage and email show for any UraWise link. Words-free so it works in every language. */
export default async function OpenGraphImage() {
  const icon = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/icons/icon-512.png'))).toString('base64')}`
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a1628', padding: 80, color: '#ffffff', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 56, letterSpacing: 18, fontFamily: 'serif' }}>URAWISE<span style={{ color: '#a8d8ea' }}>.</span></div>
      <div style={{ display: 'flex', gap: 18 }}>
        {['#a8d8ea', '#ffffff', '#5aafd0'].map(color => <div key={color} style={{ width: 120, height: 12, background: color, borderRadius: 6 }} />)}
      </div>
      <div style={{ display: 'flex', fontSize: 30, color: '#a8d8ea', letterSpacing: 4 }}>urawise.eu</div>
    </div>
    <img alt="" src={icon} width={300} height={300} style={{ borderRadius: 66, border: '2px solid rgba(168,216,234,.35)' }} />
    </div>,
    size,
  )
}
