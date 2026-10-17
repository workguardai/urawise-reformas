import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/reformas'
import { REFORMAS_SERVICES } from '@/lib/reformas-services'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...REFORMAS_SERVICES.map(service => ({ url: `${SITE_URL}/${service.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
