# Nirogidhara Hostinger VPS Deployment

## Requirements

- Node.js 24 or newer.
- Nginx with HTTPS certificate.
- PM2 installed globally: `npm i -g pm2`.
- Domain DNS pointed to the VPS.

## Setup

1. Copy `.env.example` to `.env` and set strong values for `ADMIN_PASSWORD` and `CRON_SECRET`.
2. Install dependencies: `npm install --no-audit --no-fund`.
3. Seed initial bilingual content and generated images: `npm run seed`.
4. Build production app: `npm run build`.
5. Start app and daily cron: `pm2 start ecosystem.config.cjs`.
6. Persist PM2 startup with `pm2 save` and the PM2 startup command for the VPS OS.

## Nginx Reverse Proxy

Use this as the site block shape after SSL is configured:

```nginx
server {
  server_name nirogidhara.com www.nirogidhara.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Daily Publishing

- PM2 runs `scripts/cron-runner.cjs`.
- It calls `POST /api/automation/daily` every day at `07:00 Asia/Kolkata`.
- Override the hour with `NIROGIDHARA_CRON_HOUR_IST` only when the publishing time intentionally changes.
- If social credentials are missing, website publishing still succeeds and social rows are marked `skipped`.
- Admin dashboard: `/admin` with HTTP Basic auth password from `ADMIN_PASSWORD`.

## Codex-Side Daily AI Publishing

Use this when AI generation must run from the Codex desktop/CLI login instead of an AI API key in the website or VPS.

- The website exposes `POST /api/automation/codex-publish`.
- The endpoint uses the same `CRON_SECRET` header (`x-cron-secret`) as the regular cron endpoint.
- The endpoint accepts one Codex-generated SVG image plus one English and one Hindi article, then writes the image to `public/generated` and publishes both posts to SQLite.
- The local Windows runner is `scripts/codex-daily-publisher.ps1`.
- The local task installer is `scripts/install-codex-daily-task.ps1`.

Install the Windows scheduled task from the repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-codex-daily-task.ps1 -PublishSecret "same-value-as-vps-CRON_SECRET"
```

The task runs daily at `07:00` local machine time. The Windows PC must be powered on, online, and signed in to Codex/ChatGPT for Codex-side AI publishing to run.

## SEO Launch Checklist

- Submit `https://nirogidhara.com/sitemap.xml` in Google Search Console.
- Verify `robots.txt`, `blog-sitemap.xml`, and `image-sitemap.xml`.
- Add analytics after privacy policy wording is finalized.
- Keep disease-treatment and guaranteed-result claims out of articles.
