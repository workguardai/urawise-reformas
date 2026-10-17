# urawise-reformas

The Barcelona renovation site (Google Ads landing pages), moved out of the Urawise app to **https://reformas.urawise.eu**.
A small Next.js 16 app: same design, copy and tracking as the app's `/reformas` pages, with paths without the `/reformas` prefix.

| Page | Old URL (app) | New URL |
|---|---|---|
| Home | `/reformas` | `/` |
| Services | `/reformas/<slug>` | `/<slug>` (reforma-integral, banos, cocinas, pintura-alicatado-solados, jardines-exteriores) |
| Thank-you (form conversion) | `/reformas/gracias` | `/gracias` |
| Privacy | `/reformas/privacidad` | `/privacidad` |

- **Quote form**: a server action (`app/actions.ts`) that writes to the app's Neon table `renovation_leads` (so `/admin/leads` and the offline-conversion uploads keep working) and emails each request through Resend.
- **Tracking**: cookie banner, then GA4 `G-0S36L0HQ2Z` + Google Ads `AW-18368007697`. Conversion labels are in `lib/reformas.ts`.
- **SEO**: canonical + Open Graph on `https://reformas.urawise.eu`, `/sitemap.xml`, `/robots.txt`, `lang="es"`.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
|---|---|
| `DATABASE_URL` | the same **production** database URL the Urawise app uses in Vercel |
| `RESEND_API_KEY` | the same Resend key as the app |
| `EMAIL_FROM`, `EMAIL_REPLY_TO` | optional; default to `UraWise <notifications@urawise.eu>` / `ek@workguardai.com` |

Never commit these; `.env*` is git-ignored.

`DATABASE_URL` comes from Vercel's Neon integration (Storage → **neon-green-dog**, main branch, Production only), the same database the app uses. When the app moves to the EU database (**urawise-eu**), move this project too (disconnect neon-green-dog, connect urawise-eu), so leads keep landing where `/admin/leads` reads them.

## Local

```bash
npm install
npm run build
scripts/dev-test.sh   # http://localhost:3100, on the app's EU test database (EU_DEV_DATABASE_URL from ../urawise/.env.local), no emails
```

## Go-live checklist

1. **Git**: commit this folder and push it to a new GitHub repository (e.g. `urawise-reformas`).
2. **Vercel**: Add New → Project → import the repository (framework Next.js, defaults). Add the environment variables above (Production). Settings → Functions → region close to the database (Frankfurt `fra1` for the EU Neon database). Deploy.
3. **Domain**: Project → Settings → Domains → add `reformas.urawise.eu`. Vercel shows the DNS record to add.
4. **Squarespace DNS** (Domains → urawise.eu → DNS settings → Custom records): add the record Vercel shows, normally **CNAME**, host `reformas`, data `cname.vercel-dns.com` (use Vercel's exact value if it shows a project-specific one). Wait until Vercel shows the domain as valid and the certificate is issued.
5. **Test live**: open https://reformas.urawise.eu, accept cookies, check with Google Tag Assistant that GA4 and Ads fire; send one real form request and check it appears in `www.urawise.eu/admin/leads` and arrives by email (then mark it as spam/delete it); tap WhatsApp.
6. **Redirect in the app**: once the site is live, apply `app-redirect.patch` in the app (`git apply ../urawise-reformas/app-redirect.patch`), deploy. It 301-redirects `/reformas` and `/reformas/*` to the matching page (query strings such as `?gclid=` are kept) and removes the old URLs from the app's sitemap.
7. **Google Ads**: change the **final URLs** of ads, sitelinks and any assets from `www.urawise.eu/reformas…` to `https://reformas.urawise.eu/…` (e.g. `/banos`). The conversion actions (WhatsApp, Email, Formulario reformas) are tag-based and keep working; if any action is a URL rule ("page URL contains /reformas/gracias"), change it to `reformas.urawise.eu/gracias`. Keep auto-tagging on.
8. **GA4**: no new tag or ID needed: the same stream measures subdomains, and the `_ga` cookie is set on `urawise.eu`. Check Admin → Data filters / Data streams for hostname filters that would exclude `reformas.urawise.eu`; update any reports, audiences or explorations that filter on page path `/reformas` to use hostname `reformas.urawise.eu`. The key event `generate_lead` is unchanged.
9. **Search Console**: if you have a Domain property for `urawise.eu`, the subdomain is already covered; otherwise add a URL-prefix property for `https://reformas.urawise.eu/`. Submit `https://reformas.urawise.eu/sitemap.xml` and inspect/request indexing for `/`.
10. **Google Business Profile**: set the website to `https://reformas.urawise.eu/`.
11. **LinkedIn**: update the website / featured links and any pinned posts that point to `urawise.eu/reformas`.
12. **Later**: once the redirects have run for a while, remove the old `/reformas` code from the app.

Note: the cookie choice is stored per host, so visitors who accepted on `www.urawise.eu` are asked once more on the new site.
