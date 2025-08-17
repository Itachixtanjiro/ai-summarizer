# AI Summarizer – Minimal Full-Stack MVP

## 1) Quick start
```bash
pnpm i   # or npm i / yarn
cp .env.local.example .env.local
pnpm dev
```

## 2) Env (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GROQ_API_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=Your App <no-reply@yourdomain.com>
```

## 3) Deploy
- Frontend+API: Vercel
- DB+Storage: Supabase (execute `schema.sql`)
