import os
import tempfile
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import httpx

from schemas.profile import (
    OnboardRequest,
    OnboardResponse,
    HuntRequest,
    HuntResponse,
    OpportunitiesListResponse,
    OpportunityResponse,
    UserProfile,
    ApplyRequest,
    ApplyResponse,
)

from profiler_agent import profile_from_pdf, profile_from_text
from hunter_agent import hunt
from reasoner_agent import analyze_opportunity
from copilot_agent import generate_application_assets
from supabase_client import (
    insert_user_profile,
    get_user_profile,
    insert_opportunity,
    get_scored_opportunities,
    get_opportunity_by_id,
)

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

app = FastAPI(title="Opportunity Hunter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fetch_github_readme(github_url: str) -> Optional[str]:
    parsed = github_url.rstrip("/").replace("https://github.com/", "")
    parts = parsed.split("/")
    if len(parts) < 2:
        return None
    owner, repo = parts[0], parts[1]
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    try:
        resp = httpx.get(url, headers=headers, follow_redirects=True)
        resp.raise_for_status()
        import base64
        return base64.b64decode(resp.json()["content"]).decode("utf-8", errors="ignore")
    except Exception:
        return None


@app.get("/")
def root():
    return {"message": "Opportunity Hunter API", "status": "ok"}


@app.post("/onboard", response_model=OnboardResponse)
async def onboard(file: UploadFile = File(None), github_url: str = Form(None), raw_text: str = Form(None)):
    profile_dict = {}
    if file and file.filename:
        suffix = os.path.splitext(file.filename)[1].lower()
        if suffix != ".pdf":
            raise HTTPException(status_code=400, detail="Only PDF resumes are supported")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        try:
            profile_dict = profile_from_pdf(tmp_path)
        finally:
            os.unlink(tmp_path)
    elif raw_text:
        profile_dict = profile_from_text(raw_text)
    else:
        raise HTTPException(status_code=400, detail="Provide a PDF file or raw resume text")

    if github_url:
        readme = fetch_github_readme(github_url)
        if readme:
            extras = profile_from_text(readme[:3000])
            existing_skills = set(profile_dict.get("skills", []))
            for skill in extras.get("skills", []):
                existing_skills.add(skill)
            profile_dict["skills"] = sorted(existing_skills)

    profile = UserProfile(**profile_dict)
    result = insert_user_profile(profile.model_dump())
    profile_id = result["id"]
    return OnboardResponse(profile_id=profile_id, profile=profile)


@app.post("/hunt", response_model=HuntResponse)
async def hunt_endpoint(req: HuntRequest):
    row = get_user_profile(req.profile_id)
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")

    user_profile = row["json_data"]
    results = hunt(user_profile)

    scored = []
    for r in results:
        title = r.get("title", "")
        url = r.get("url", "")
        raw_text = r.get("content", "") or r.get("raw_content", "")
        if not raw_text:
            raw_text = title

        try:
            analysis = analyze_opportunity(user_profile, title, raw_text[:6000])
            score = analysis.get("score", 0)
            reasoning = analysis.get("reasoning", [])
            effort = analysis.get("effort_estimate", "")
            roi = analysis.get("roi_estimate", "")
            summary = analysis.get("summary", "")
            reasoning.append(f"Effort: {effort}")
            reasoning.append(f"ROI: {roi}")
            if summary:
                reasoning.insert(0, summary)
        except Exception:
            score = 50
            reasoning = ["Unable to analyze opportunity"]

        insert_opportunity(title=title, url=url, raw_text=raw_text[:8000], score=score, reasoning=reasoning)
        scored.append({
            "title": title,
            "url": url,
            "summary": raw_text[:400],
            "score": score,
            "reasoning": reasoning,
            "effort_estimate": effort,
            "roi_estimate": roi,
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return HuntResponse(profile_id=req.profile_id, opportunities=scored)


@app.get("/opportunities", response_model=OpportunitiesListResponse)
async def list_opportunities():
    rows = get_scored_opportunities()
    opportunities = [
        OpportunityResponse(
            id=row["id"],
            title=row["title"],
            url=row["url"],
            raw_text=row.get("raw_text", ""),
            score=row.get("score"),
            reasoning=row.get("reasoning", []),
            created_at=row.get("created_at"),
        )
        for row in rows
    ]
    return OpportunitiesListResponse(opportunities=opportunities)


@app.post("/apply", response_model=ApplyResponse)
async def apply_endpoint(req: ApplyRequest):
    """Application Co-Pilot: generate a tailored cover letter + checklist."""
    profile_row = get_user_profile(req.profile_id)
    if not profile_row:
        raise HTTPException(status_code=404, detail="Profile not found")
    if not req.opportunity_id:
        raise HTTPException(status_code=400, detail="opportunity_id is required")

    opp_row = get_opportunity_by_id(req.opportunity_id)
    if not opp_row:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    user_profile = profile_row["json_data"]
    opportunity_title = opp_row["title"]
    opportunity_text = opp_row.get("raw_text", "")

    try:
        assets = generate_application_assets(
            user_profile, opportunity_title, opportunity_text
        )
        return ApplyResponse(
            profile_id=req.profile_id,
            opportunity_id=req.opportunity_id,
            cover_letter=assets.get("cover_letter", ""),
            application_checklist=assets.get("application_checklist", []),
            estimated_completion_time=assets.get("estimated_completion_time", "Unknown"),
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Co-Pilot failed: {exc}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)