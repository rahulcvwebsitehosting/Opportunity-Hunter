# Opportunity Hunter — Frontend

A premium, dark-themed, animated AI dashboard that discovers scholarships, hackathons, grants, and internships tailored to a user's profile.

## Tech Stack

| Layer       | Technology |
|-------------|------------|
| Framework   | Next.js (App Router) |
| Styling     | Tailwind CSS 4 |
| Components  | Shadcn UI (Radix primitives) |
| Animations  | Framer Motion |
| Icons       | Lucide React |
| Language    | TypeScript |

## Design System

- **Theme:** Dark mode (HSL-based, violet/indigo accents)
- **Surfaces:** Glassmorphism (`glass`, `glass-strong`)
- **Effects:** Glowing orbs, grid background, noise overlay
- **Animations:** Scroll-reveal, staggered children, count-up number, animated progress rings, hover lift
- **Mobile:** Fully responsive with mobile-first breakpoints

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |

## Project Structure

```
frontend/
├── app/                      # App Router pages
│   ├── layout.tsx             # Root layout + AnimatedBackground
│   └── page.tsx               # Onboarding ↔ Dashboard switch
├── components/
│   ├── ui/                    # Shadcn primitives (button, card, etc.)
│   ├── animated-background.tsx  # Floating orbs + grid + noise
│   ├── onboarding-form.tsx    # Hero + resume uploader
│   ├── dashboard.tsx          # Profile + hunt progress + results grid
│   ├── opportunity-card.tsx   # Score ring + collapsible reasoning
│   ├── score-badge.tsx        # Animated circular progress
│   └── copilot-modal.tsx      # Cover letter + checklist modal
├── lib/
│   ├── api.ts                 # Backend REST client
│   ├── animations.tsx         # ScrollReveal, StaggerContainer, useCountUp
│   └── utils.ts               # cn() helper
└── styles/
    └── globals.css           # Theme tokens + custom animations
```

## Key UI Components

- **ScoreBadge** — Circular SVG progress ring with count-up animation
- **OpportunityCard** — Match score strip, expandable AI reasoning (✔/✘ checks), effort/ROI badges
- **CopilotModal** — Generated cover letter with copy/download + numbered application checklist
- **AnimatedBackground** — Three drifting gradient orbs + grid pattern

## Deployment

Deploy to Vercel (Root Directory: `frontend/`):

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL in the Vercel dashboard.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Onboarding form (drag-and-drop PDF / paste text + GitHub URL) |
| `/` (post-onboard) | Dashboard with profile, "Run Hunter Agent", opportunity grid, Co-Pilot modal |
