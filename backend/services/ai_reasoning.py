"""
AI Reasoning Service for Opportunity Analysis.
"""
import os
import json
from typing import Dict, Any
from openai import OpenAI
from schemas.opportunity import OpportunityAnalysisResponse, ReasoningItem


# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_opportunity_with_ai(
    opportunity_id: str, user_profile: Dict[str, Any]
) -> OpportunityAnalysisResponse:
    """
    Analyze an opportunity using OpenAI GPT-4o.
    
    Args:
        opportunity_id: ID of the opportunity.
        user_profile: User profile data.
    
    Returns:
        Structured analysis response.
    """
    # Fetch opportunity details (mock for now)
    opportunity_details = _fetch_opportunity_details(opportunity_id)
    
    # Prepare prompt for OpenAI
    prompt = _build_analysis_prompt(user_profile, opportunity_details)
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": prompt}],
        temperature=0.2,
        max_tokens=1000,
    )
    
    # Parse and validate response
    return _parse_ai_response(response.choices[0].message.content)


def _fetch_opportunity_details(opportunity_id: str) -> Dict[str, Any]:
    """
    Mock function to fetch opportunity details.
    Replace with actual database/API call.
    """
    return {
        "id": opportunity_id,
        "title": "Sample Opportunity",
        "requirements": [
            "Python",
            "FastAPI",
            "3+ years of experience",
            "Remote",
        ],
        "location": "Global",
    }


def _build_analysis_prompt(
    user_profile: Dict[str, Any], opportunity_details: Dict[str, Any]
) -> str:
    """
    Build a structured prompt for OpenAI.
    """
    return f"""
    Analyze the following opportunity for the given user profile.
    
    Opportunity Details:
    {json.dumps(opportunity_details, indent=2)}
    
    User Profile:
    {json.dumps(user_profile, indent=2)}
    
    Provide a structured response with:
    1. Opportunity Score (0-100): Integer score based on fit.
    2. Reasoning: List of criteria (e.g., "Eligible location") with met status and details.
    3. Estimated Effort: Time required (e.g., "4 hours").
    4. Estimated ROI: "Low", "Medium", or "High".
    
    Respond in JSON format only, with keys:
    - opportunity_score (int)
    - reasoning (list of dicts with keys: criterion, met, details)
    - estimated_effort (str)
    - estimated_roi (str)
    """


def _parse_ai_response(response_content: str) -> OpportunityAnalysisResponse:
    """
    Parse and validate OpenAI response.
    """
    try:
        response_data = json.loads(response_content)
        
        # Validate opportunity_score
        if not 0 <= response_data["opportunity_score"] <= 100:
            raise ValueError("Opportunity score must be between 0 and 100.")
        
        # Validate reasoning
        reasoning = [
            ReasoningItem(**item) for item in response_data["reasoning"]
        ]
        
        return OpportunityAnalysisResponse(
            opportunity_score=response_data["opportunity_score"],
            reasoning=reasoning,
            estimated_effort=response_data["estimated_effort"],
            estimated_roi=response_data["estimated_roi"],
        )
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        raise ValueError(f"Invalid AI response: {e}")