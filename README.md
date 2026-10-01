# [YOUR NAME] — Developer Portfolio

A premium, dark-themed personal developer portfolio built with Next.js,
TypeScript, and Tailwind CSS — featuring a floating AI voice assistant that
answers questions about your background, skills, and projects.

## Features

- **Modern stack** — Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **One config file** — every piece of personal content lives in `data/portfolio.ts`; no component code needs to change to make this yours
- **AI voice assistant** — floating widget with Web Speech API voice input, text-to-speech output, a text fallback, and a local knowledge-base responder that works with zero configuration (optionally upgradeable to a real AI API call, kept fully server-side)
- **Live GitHub section** — pulls your public profile and top repositories at request time, with a graceful fallback if the API is unavailable
- **Working contact form** — validated client-side and server-side, pluggable into Formspree, Resend, or your own webhook — never fakes a successful send
- **Dark / light theme** — persisted, respects system preference, no flash on load
- **Accessible** — semantic HTML, visible focus states, ARIA labels, keyboard navigation, accessible modals, `prefers-reduced-motion` support throughout
- **SEO-ready** — metadata, Open Graph/Twitter cards, sitemap, robots.txt, favicon
- **Resume fallback** — resume buttons check the file exists before opening it, and show a clear message instead of a broken link if it's missing

## Tech stack

| Layer       | Choice                                   |
|-------------|-------------------------------------------|
| Framework   | Next.js 16 (App Router, TypeScript)        |
| Styling     | Tailwind CSS v4                            |
| Animation   | Framer Motion                              |
| Icons       | lucide-react (+ a few hand-rolled brand icons) |
| Voice/AI    | Web Speech API (browser) + optional Anthropic API (server-side) |
| Deployment  | Vercel (recommended) or any Node.js host   |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Make it yours

Everything personal lives in one file:

```
data/portfolio.ts
```

Replace the `[BRACKETED]` placeholders with your real name, bio, skills,
projects, experience, education, and social links. Nothing else needs to
change — every section reads from this file, and sections with empty data
(e.g. no social links, no education) simply don't render.

Add project screenshots to `public/images/` and reference them from
`data/portfolio.ts` (`image: "/images/your-screenshot.png"`). Projects
without an image show a neutral placeholder instead of a broken `<img>`.

Add your resume at `public/resume.pdf`. Until it's there, resume buttons
show a friendly "not uploaded yet" message instead of a broken download link.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need — everything
is optional, and every feature degrades gracefully without it.

```bash
cp .env.example .env.local
```

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Your deployed URL, used in SEO metadata |
| `NEXT_PUBLIC_GITHUB_USERNAME` | No | Shows a live GitHub profile + repo snapshot |
| `ANTHROPIC_API_KEY` | No | Upgrades the voice assistant from the local fallback to a real AI call (server-side only, never exposed to the browser) |
| `FORMSPREE_ENDPOINT` | No* | Contact form provider (option A) |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | No* | Contact form provider (option B) |
| `CONTACT_WEBHOOK_URL` | No* | Contact form provider (option C) |

\* Configure **one** contact form provider if you want the form to actually
send messages. Until you do, submitting the form returns a clear "not
configured yet" message instead of a fake success state.

### Voice assistant setup

The assistant works out of the box with no configuration — `/api/assistant`
answers from a small rule-based matcher driven entirely by
`assistantKnowledgeBase` in `data/portfolio.ts`.

To upgrade it to a real AI model: set `ANTHROPIC_API_KEY` in your
environment. The API route then calls the Anthropic API server-side,
passing your portfolio data as context so it only answers questions about
you. The key is read from `process.env` inside the API route and is never
sent to the client.

### GitHub integration setup

Set `NEXT_PUBLIC_GITHUB_USERNAME` to your GitHub username. The GitHub
section then fetches your public profile and top repositories using
GitHub's public, unauthenticated REST API — no token required, nothing
private is exposed. If the API is unreachable or rate-limited, the section
falls back to showing your configured projects instead.

### Contact form setup

Pick **one**:

- **Formspree** — create a form at formspree.io, set
  `FORMSPREE_ENDPOINT=https://formspree.io/f/your-id`
- **Resend** — get an API key at resend.com, set `RESEND_API_KEY` and
  `CONTACT_TO_EMAIL` (the inbox you want messages delivered to)
- **Custom webhook** — set `CONTACT_WEBHOOK_URL` to any endpoint that
  accepts a `POST` with `{ name, email, message }` JSON

All secrets stay server-side in `app/api/contact/route.ts` — nothing is
exposed to the browser.

## Development commands

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build locally
npm run lint     # ESLint
```

## Project structure

```
portfolio/
├── app/
│   ├── page.tsx                 # assembles all sections
│   ├── layout.tsx                # fonts, theme, SEO metadata
│   ├── sitemap.ts / robots.ts
│   └── api/
│       ├── assistant/route.ts    # voice assistant (local + optional AI)
│       └── contact/route.ts      # contact form (pluggable provider)
├── components/                   # one component per section/UI piece
├── data/
│   └── portfolio.ts              # ← edit this to make the site yours
├── lib/                          # theme, toast, GitHub fetch, hooks
├── public/
│   ├── images/                   # your project screenshots
│   └── resume.pdf                # ← add your resume here
├── .env.example
└── README.md
```

## Deployment (Vercel)

1. **Initialize git and commit**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   ```
2. **Create a GitHub repository** (on github.com, or via `gh repo create`)
3. **Push**
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
4. **Import into Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Framework preset: Next.js (auto-detected)
5. **Configure environment variables** in the Vercel project settings
   (Settings → Environment Variables) — add whichever ones from the table
   above you're using. None are required for the site to deploy and work.
6. **Deploy** — Vercel builds and deploys automatically
7. **Verify the production build** — open the deployed URL, check the
   voice assistant, contact form, and theme toggle
8. **Custom domain** — Project Settings → Domains → add your domain and
   follow the DNS instructions, then set `NEXT_PUBLIC_SITE_URL` to match

### Redeploying after future pushes

Vercel auto-deploys on every push to your default branch — just
`git push` and the new build goes live (with a preview deployment created
for every other branch/PR automatically).

## Error handling

The app fails gracefully rather than showing raw errors or broken UI:

- **GitHub API down/rate-limited** → falls back to configured project data
- **Voice recognition unsupported** → automatically falls back to text input
- **Microphone permission denied** → shows a message, switches to text input
- **AI API unavailable or not configured** → assistant falls back to the local knowledge-base responder
- **Contact form provider not configured** → clear message, no fake success
- **Missing resume.pdf** → toast message instead of a broken download
- **Missing project images** → neutral placeholder instead of a broken `<img>`

## Accessibility & performance notes

- All interactive elements are keyboard-reachable with visible focus states
- The project detail modal traps focus and closes on `Escape`
- Animations respect `prefers-reduced-motion`
- Images use `next/image` where the source domain is known ahead of time (GitHub avatars); user-supplied project screenshots are plain `<img>` tags since their origin isn't known in advance
- Fonts load via a `<link>` tag (Inter, Space Grotesk, JetBrains Mono) so production builds never depend on reaching Google's font API at build time

## License

This template is yours to use and modify for your own portfolio.
