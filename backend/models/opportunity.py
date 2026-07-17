"""Models for Opportunity data."""
from pydantic import BaseModel
from typing import List, Optional


class Opportunity(BaseModel):
    id: str
    title: str
    description: str
    url: str
    category: str  # e.g., "hackathon", "scholarship", "job"
    location: Optional[str] = None
    deadline: Optional[str] = None


class SearchResponse(BaseModel):
    opportunities: List[Opportunity]
    query: str
    cached: bool = False