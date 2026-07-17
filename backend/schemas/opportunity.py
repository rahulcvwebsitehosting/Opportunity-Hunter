"""
Pydantic schemas for opportunity analysis.
"""
from pydantic import BaseModel
from typing import List, Optional


class OpportunityAnalysisRequest(BaseModel):
    opportunity_id: str
    user_profile: dict  # Raw user profile data


class ReasoningItem(BaseModel):
    criterion: str
    met: bool
    details: str


class OpportunityAnalysisResponse(BaseModel):
    opportunity_score: int  # 0-100
    reasoning: List[ReasoningItem]
    estimated_effort: str
    estimated_roi: str