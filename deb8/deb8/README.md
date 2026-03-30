# DEB8 — Structured Debate Platform

A production-ready MVP debate platform built with Next.js 14, TypeScript, TailwindCSS, and Supabase.

---

## ⚡ Quick Start (VS Code)

### Step 1 — Prerequisites
- Install [Node.js](https://nodejs.org) (v18 or later)
- Install [VS Code](https://code.visualstudio.com)
- Create a free [Supabase](https://supabase.com) account

---

### Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Give it a name (e.g. `deb8`) and a strong database password
3. Wait ~2 min for it to provision
4. Go to **SQL Editor** → **New query**
5. Paste the entire contents of `supabase/schema.sql`
6. Click **Run**
7. You should see "Success" with no errors

Then get your keys:
- Go to **Settings** → **API**
- Copy your **Project URL** and **anon public key**

---

### Step 3 — Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 4 — Install dependencies

Open a terminal in VS Code (`Ctrl+`` or `Cmd+``):

```bash
npm install
```

---

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
deb8/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── layout.tsx                ← Root layout
│   ├── globals.css               ← Global styles + Tailwind
│   ├── login/page.tsx            ← Sign in
│   ├── register/page.tsx         ← Register
│   ├── debates/
│   │   ├── page.tsx              ← Main feed
│   │   ├── new/page.tsx          ← Create debate (protected)
│   │   └── [id]/page.tsx         ← Debate detail + thread
│   ├── profile/[username]/page.tsx
│   ├── leaderboard/page.tsx
│   ├── categories/page.tsx
│   ├── live/page.tsx             ← Placeholder
│   ├── settings/page.tsx         ← Protected
│   └── api/
│       ├── debates/route.ts
│       └── arguments/route.ts
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          ← Page wrapper with Navbar
│   │   ├── Navbar.tsx            ← Top navigation
│   │   └── Sidebar.tsx           ← Right sidebar (server)
│   ├── ui/
│   │   ├── CategoryBadge.tsx
│   │   ├── CredibilityBadge.tsx
│   │   ├── EmptyState.tsx
│   │   └── TagBadge.tsx
│   └── debate/
│       ├── DebateCard.tsx        ← Feed card
│       ├── ArgumentTree.tsx      ← Recursive argument node
│       ├── ArgumentForm.tsx      ← Post an argument
│       └── DebateThread.tsx      ← Manages thread state
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← Browser Supabase client
│   │   └── server.ts             ← Server Supabase client
│   ├── constants.ts              ← Categories, tags, scoring
│   └── utils.ts                  ← Helpers, tree builder, types
├── middleware.ts                  ← Route protection
├── supabase/schema.sql            ← Full DB schema + RLS
└── .env.local.example
```

---

## 🚀 Deploy to Vercel

1. Push your project to GitHub:
```bash
git init
git add .
git commit -m "Initial DEB8 MVP"
gh repo create deb8 --public --push
```

2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Add environment variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

---

## 🌐 Custom Domain (Vercel)

1. In Vercel → your project → **Settings** → **Domains**
2. Add your domain (e.g. `deb8.io`)
3. Follow the DNS instructions (add CNAME or A records at your registrar)
4. DNS propagates in minutes to a few hours

---

## 🎨 What to Edit First to Customize Branding

| File | What to change |
|------|---------------|
| `app/layout.tsx` | Site title and meta description |
| `app/page.tsx` | Hero headline, subtext, footer |
| `app/globals.css` | Color variables, font |
| `tailwind.config.ts` | Custom color tokens |
| `lib/constants.ts` | Categories, argument tags, credibility rewards |
| `components/layout/Navbar.tsx` | Logo text |

---

## 🔧 Troubleshooting

**"relation profiles does not exist"**
→ You haven't run the SQL schema yet. Go to Supabase SQL Editor and run `supabase/schema.sql`.

**"new row violates row-level security policy"**
→ Make sure you're logged in. Check that `auth.uid()` matches the `author_id` you're inserting.

**"increment_credibility function not found"**
→ The schema.sql didn't run fully. Re-run it in Supabase SQL Editor.

**Auth email confirmation loop**
→ In Supabase → Auth → Settings, disable "Confirm email" for local dev.

**Hydration errors**
→ Make sure Client Components have `'use client'` at the top. Server Components don't.

**Build fails on Vercel**
→ Double check both env vars are added in Vercel project settings, not just locally.

---

## 🛣️ V2 Improvements

- [ ] Real-time argument updates with Supabase Realtime subscriptions
- [ ] Argument reactions (upvotes per argument)
- [ ] Full-text search across debates
- [ ] Email notifications for replies
- [ ] Moderator roles and flagging system
- [ ] Live debates with WebRTC / streaming
- [ ] Mobile app (React Native with shared types)
- [ ] AI-powered argument quality scoring
- [ ] Debate drafts (save before publishing)
- [ ] Share debate card as image (og:image generation)
- [ ] OAuth login (Google, GitHub)
