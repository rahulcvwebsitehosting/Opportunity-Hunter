"""In-memory caching for search results."""
from typing import Dict, List, Optional
from models.opportunity import Opportunity

# In-memory cache (replace with Supabase in production)
cache: Dict[str, List[Opportunity]] = {}


def get_cached_results(query: str) -> Optional[List[Opportunity]]:
    """Retrieve cached results for a query."""
    return cache.get(query.lower())


def cache_results(query: str, opportunities: List[Opportunity]) -> None:
    """Cache results for a query."""
    cache[query.lower()] = opportunities