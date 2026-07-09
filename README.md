# yawnme.com

Static Astro site for [yawnme.com](https://yawnme.com) — interactive exploration of contagious yawning, deployed as **Cloudflare Workers Static Assets** (assets-only, no adapter).

## Stack

- Astro 6 (`output: 'static'`) — no `@astrojs/cloudflare` adapter
- Tailwind CSS 4 + TypeScript
- Content Collections (`src/content/topics`)
- Cloudflare Images CDN for hero / OG imagery
- Sitemap + `robots.txt` + structured data + full Open Graph meta
- Domain acquisition CTA → `sales@desertrich.com`

## Commands

```bash
npm install
npm run dev
npm run build
npx wrangler deploy   # after build; assets from ./dist
```

Or: `npm run deploy`

## Deploy notes

`wrangler.jsonc` is **assets-only** (no `main` Worker script). Bind the custom domain `yawnme.com` in the Cloudflare dashboard after the first deploy.
