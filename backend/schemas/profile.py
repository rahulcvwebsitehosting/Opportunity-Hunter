from pydantic import BaseModel
from typing import List, Optional


class Education(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None


class Experience(BaseModel):
    role: str
    company: str
    duration: Optional[str] = None
    description: Optional[str] = None


class UserProfile(BaseModel):
    name: Optional[str] = None
    skills: List[str] = []
    education: List[Education] = []
    experience: List[Experience] = []
    location: Optional[str] = None
    interests: List[str] = []


class OnboardRequest(BaseModel):
    raw_text: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class OnboardResponse(BaseModel):
    profile_id: str
    profile: UserProfile


class HuntRequest(BaseModel):
    profile_id: str


class HuntResponse(BaseModel):
    profile_id: str
    opportunities: List[dict]


class ApplyRequest(BaseModel):
    profile_id: str
    opportunity_id: str


class ApplyResponse(BaseModel):
    profile_id: str
    opportunity_id: str
    cover_letter: str
    application_checklist: List[str]
    estimated_completion_time: str


class OpportunityResponse(BaseModel):
    id: str
    title: str
    url: str
    raw_text: str
    score: Optional[float] = None
    reasoning: Optional[List[str]] = None
    created_at: Optional[str] = None


class OpportunitiesListResponse(BaseModel):
    opportunities: List[OpportunityResponse]