"""Service for integrating with Tavily API."""
import os
import requests
from typing import List, Dict, Optional
from fastapi import HTTPException
from models.opportunity import Opportunity

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
TAVILY_API_URL = "https://api.tavily.com/search"


def search_tavily(query: str, max_results: int = 5) -> List[Opportunity]:
    """Search Tavily API for opportunities."""
    if not TAVILY_API_KEY:
        raise HTTPException(status_code=500, detail="Tavily API key not configured")

    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "max_results": max_results,
        "search_depth": "advanced"
    }

    try:
        response = requests.post(TAVILY_API_URL, json=payload, timeout=10)
        response.raise_for_status()
        results = response.json().get("results", [])
        
        opportunities = []
        for result in results:
            category = _categorize_opportunity(result.get("title", ""), result.get("content", ""))
            if category:
                opportunities.append(
                    Opportunity(
                        id=result.get("url"),
                        title=result.get("title", ""),
                        description=result.get("content", ""),
                        url=result.get("url", ""),
                        category=category,
                        location=_extract_location(result.get("content", ""))
                    )
                )
        return opportunities
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Tavily API error: {str(e)}")


def _categorize_opportunity(title: str, content: str) -> Optional[str]:
    """Categorize opportunity based on title and content."""
    title_lower = title.lower()
    content_lower = content.lower()
    
    if any(keyword in title_lower for keyword in ["hackathon", "codefest", "coding challenge"]):
        return "hackathon"
    elif any(keyword in title_lower for keyword in ["scholarship", "grant", "fellowship"]):
        return "scholarship"
    elif any(keyword in content_lower for keyword in ["job", "internship", "employment"]):
        return "job"
    return None


def _extract_location(content: str) -> Optional[str]:
    """Extract location from content (simplistic approach)."""
    keywords = ["in india", "at delhi", "in bangalore", "remote", "online"]
    content_lower = content.lower()
    
    for keyword in keywords:
        if keyword in content_lower:
            return keyword.replace("in ", "").replace("at ", "").title()
    return None