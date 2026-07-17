import json
from typing import Dict, Any
from llm_router import chat_completion, MODEL_REASONER


def analyze_opportunity(
    user_profile: Dict[str, Any],
    opportunity_title: str,
    opportunity_text: str,
) -> Dict[str, Any]:
    prompt = f"""
You are an eligibility analyst. Compare the user profile against the opportunity below.

User Profile:
{json.dumps(user_profile, indent=2)}

Opportunity Title: {opportunity_title}
Opportunity Description:
{opportunity_text}

Output a JSON object with these fields:
- score (integer 0-100): overall match percentage
- reasoning (array of strings): line-by-line eligibility checks, each prefixed with ✔ or ✘
- effort_estimate (string): one of "Low", "Medium", "High"
- roi_estimate (string): one of "Low", "Medium", "High"
- summary (string): one-sentence verdict

Output ONLY valid JSON. No other text or markdown.
"""
    response = chat_completion(
        model=MODEL_REASONER,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=2048,
    )
    raw = response.choices[0].message.content
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)