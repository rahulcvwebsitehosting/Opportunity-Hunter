# Opportunity Hunter — Frontend

An AI-Native, accessibility-first dashboard for discovering scholarships, hackathons, grants, and internships tailored to a user's profile.

## Design System

- **Style:** AI-Native UI (light theme, conversational, minimal chrome)
- **Palette:** Violet `#7C3AED` + Cyan `#0891B2` on warm white `#FAF5FF`
- **Typography:** Fira Sans / Fira Code (Google Fonts)
- **Accessibility:** WCAG AA — 4.5:1 contrast, visible focus rings, keyboard nav, `prefers-reduced-motion` respected, semantic HTML, ARIA labels
- **Effects:** Typing indicators (3-dot pulse), smooth reveals, count-up numbers, subtle hover lift
- **Mobile:** Responsive 375px / 768px / 1024px / 1440px

## Tech Stack

| Layer       | Technology |
|-------------|------------|
| Framework   | Next.js (App Router) |
| Styling     | Tailwind CSS 4 |
| Components  | Shadcn UI (Radix primitives) |
| Animations  | Framer Motion |
| Icons       | Lucide React |
| Language    | TypeScript |

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
├── app/                      # App Router pages
│   ├── layout.tsx             # Root layout + AnimatedBackground
│   └── page.tsx               # Onboarding ↔ Dashboard switch
├── components/
│   ├── ui/                    # Shadcn primitives
│   ├── animated-background.tsx  # Subtle AI orbs + grid
│   ├── onboarding-form.tsx    # Accessible hero + drag-drop uploader
│   ├── dashboard.tsx          # Profile card + hunt + results grid
│   ├── opportunity-card.tsx   # Score ring + collapsible reasoning
│   ├── score-badge.tsx        # Animated circular progress (WCAG alt text)
│   └── copilot-modal.tsx      # Cover letter + checklist (focus trap, ESC close)
├── lib/
│   ├── api.ts                 # Backend REST client
│   ├── animations.tsx         # ScrollReveal, Stagger, useCountUp (reduced-motion aware)
│   └── utils.ts               # cn() helper
└── styles/
    └── globals.css           # Theme tokens + WCAG-compliant focus rings + reduced-motion
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Deployment

Deploy to Vercel (Root Directory: `frontend/`):

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL in the Vercel dashboard.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Accessible onboarding (drag-drop PDF / text + GitHub) with typing-dot loading |
| `/` (post-onboard) | Dashboard: AI profile → Hunter Agent → scored opportunity grid → Co-Pilot modal |