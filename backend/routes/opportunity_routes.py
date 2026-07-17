"""FastAPI routes for opportunity search."""
from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.opportunity import SearchResponse, Opportunity
from services.tavily_service import search_tavily
from services.cache_service import get_cached_results, cache_results

router = APIRouter(prefix="/opportunity", tags=["opportunities"])


@router.get("/search-opportunities", response_model=SearchResponse)
async def search_opportunities(
    query: str = Query(..., min_length=3, description="Search query for opportunities")
) -> SearchResponse:
    """Search for opportunities using Tavily API."""
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")

    # Check cache first
    cached_results = get_cached_results(query)
    if cached_results:
        return SearchResponse(opportunities=cached_results, query=query, cached=True)

    # Fetch from Tavily API
    opportunities = search_tavily(query)
    if not opportunities:
        raise HTTPException(status_code=404, detail="No opportunities found")

    # Cache results
    cache_results(query, opportunities)
    return SearchResponse(opportunities=opportunities, query=query, cached=False)


@router.get("/{id}", response_model=Opportunity)
async def get_opportunity(id: str) -> Opportunity:
    """Retrieve a specific opportunity by ID (URL)."""
    # In a real implementation, fetch from a database or cache
    # For now, return a dummy response
    raise HTTPException(status_code=501, detail="Not implemented")