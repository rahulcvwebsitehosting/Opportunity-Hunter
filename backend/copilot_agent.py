import json
from typing import Dict, Any, List
from llm_router import chat_completion, MODEL_REASONER


def generate_application_assets(
    user_profile: Dict[str, Any],
    opportunity_title: str,
    opportunity_text: str,
) -> Dict[str, Any]:
    """
    Co-Pilot agent: generates a tailored cover letter and a step-by-step
    application checklist in a single LLM call.
    """
    prompt = f"""
You are an application co-pilot. The user has decided to apply to the opportunity below.
Given their profile and the opportunity details, generate:

1. A tailored **cover_letter** (300-400 words) that:
   - Opens with a hook tied to the opportunity's mission
   - Demonstrates the user's specific relevant skills/experience
   - Aligns with the opportunity's stated requirements
   - Closes with confident forward motion (not pleading)

2. An **application_checklist** (array of 5-8 action items) that:
   - Are concrete and actionable (e.g., "Update GitHub repo README with screenshots")
   - Are ordered by suggested completion sequence
   - Each item is a short string

User Profile:
{json.dumps(user_profile, indent=2)}

Opportunity Title: {opportunity_title}
Opportunity Description:
{opportunity_text}

Output ONLY valid JSON with this structure:
{{
  "cover_letter": "...",
  "application_checklist": ["...", "..."],
  "estimated_completion_time": "e.g., 4 hours"
}}

No markdown, no other text.
"""
    response = chat_completion(
        model=MODEL_REASONER,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2500,
    )
    raw = response.choices[0].message.content
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)