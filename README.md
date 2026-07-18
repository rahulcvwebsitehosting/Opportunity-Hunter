# Opportunity Hunter

> **Never miss a life-changing opportunity again.**  
> An autonomous AI agent that discovers scholarships, hackathons, grants, and internships tailored to your profile.

## Architecture

```
opportunity-hunter/
├── frontend/          # Next.js (App Router) + Tailwind CSS + Shadcn UI
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── vercel.json
├── backend/           # Python FastAPI multi-model agent stack
│   ├── main.py
│   ├── llm_router.py
│   ├── profiler_agent.py
│   ├── hunter_agent.py
│   ├── reasoner_agent.py
│   ├── copilot_agent.py
│   ├── supabase_client.py
│   └── requirements.txt
├── render.yaml        # Render deployment config
└── README.md
```

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Supabase project (with pgvector enabled)
- API keys for OpenRouter and Tavily

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env        # add your API keys
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a Vercel project.
2. Set the **Root Directory** to `frontend/`.
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
4. Deploy. The `vercel.json` is already configured for Next.js App Router.

### Backend → Render

1. Connect your repository to [Render](https://render.com).
2. Render will automatically detect `render.yaml` at the repo root.
3. Fill in the secret environment variables in the Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`
   - `TAVILY_API_KEY`
   - `GITHUB_TOKEN`
4. Deploy. The service starts at `https://opportunity-hunter-api.onrender.com`.

### Environment Variables

| Variable                    | Required | Description                          |
|-----------------------------|----------|--------------------------------------|
| `SUPABASE_URL`              | Yes      | Supabase project URL                 |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Supabase service role key            |
| `OPENROUTER_API_KEY`        | Yes      | OpenRouter API key                   |
| `OPENROUTER_BASE_URL`       | Yes      | `https://openrouter.ai/api/v1`       |
| `TAVILY_API_KEY`            | Yes      | Tavily web search API key            |
| `GITHUB_TOKEN`              | No       | GitHub token for repo enrichment     |
| `MODEL_REASONER`            | Yes      | `openai/gpt-oss-120b`                |
| `MODEL_PARSER`              | Yes      | `mistralai/mistral-large-2512`       |
| `MODEL_ORCHESTRATOR`        | Yes      | `minimax/minimax-m3`                 |
| `NEXT_PUBLIC_API_URL`       | Yes*     | Backend URL (frontend only)          |

## Demo Flow

1. **Onboard** – paste resume text or upload PDF
2. **Hunt** – click "Run Hunter Agent" → AI searches & scores opportunities
3. **Review** – see Match Score (✔/✘ reasoning) with effort/ROI estimates
4. **Apply** – click "Apply via Co-Pilot" → AI drafts a cover letter + checklist

## Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Frontend     | Next.js 16, Tailwind CSS 4, Shadcn UI       |
| Design       | AI-Native UI (WCAG AA), Fira Sans/Fira Code |
| Backend      | Python FastAPI                               |
| AI Models    | Mistral Large (parser), MiniMax M3 (hunter), GPT-OSS-120b (reasoner/copilot) |
| Router       | OpenRouter (multi-model, free tier)          |
| Web Search   | Tavily API                                   |
| Database     | Supabase + pgvector                          |

## Design System

The UI follows the **AI-Native UI** style powered by the [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) design intelligence:

- **Palette:** Violet `#7C3AED` + Cyan `#0891B2` on warm white `#FAF5FF`
- **Typography:** Fira Sans (headings/body) + Fira Code (data/code)
- **Accessibility:** WCAG AA — 4.5:1 contrast, visible focus rings, keyboard navigation, `prefers-reduced-motion` respected, semantic HTML, ARIA labels
- **Effects:** AI typing indicators (3-dot pulse), smooth scroll reveals, count-up score animations, subtle hover lift
