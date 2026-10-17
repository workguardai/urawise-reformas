import { Pool } from 'pg'

// The Urawise app's Neon database; this site only reads and writes the renovation_leads table.
// Created on first use, so pages build without DATABASE_URL.

let pool: Pool | undefined

export function db() {
  if (pool) return pool
  const configured = process.env.DATABASE_URL
  if (!configured) throw new Error('DATABASE_URL is not configured')
  // Same as the app: ask pg for verify-full explicitly (what sslmode=require means today).
  pool = new Pool({ connectionString: configured.replace(/([?&]sslmode=)(prefer|require|verify-ca)\b/, '$1verify-full'), max: 3 })
  return pool
}
