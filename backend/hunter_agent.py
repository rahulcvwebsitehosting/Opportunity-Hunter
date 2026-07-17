import json
import os
from typing import Dict, Any, List
from dotenv import load_dotenv
from tavily import TavilyClient
from llm_router import chat_completion, MODEL_ORCHESTRATOR

load_dotenv()

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def search_web(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    response = tavily_client.search(query=query, max_results=max_results)
    return response.get("results", [])


def generate_search_queries(user_profile: Dict[str, Any]) -> List[str]:
    prompt = f"""
Based on the user profile below, generate 4 targeted web search queries to find scholarships,
hackathons, internships, and grants this user may be eligible for. Focus on location and skills.

User Profile:
{json.dumps(user_profile, indent=2)}

Output a JSON array of strings, e.g.:
["hackathons for engineering students in India 2025", "React developer internships remote"]

Output ONLY valid JSON. No other text.
"""
    response = chat_completion(
        model=MODEL_ORCHESTRATOR,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )
    raw = response.choices[0].message.content
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def hunt(user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    queries = generate_search_queries(user_profile)
    all_results = []
    seen_urls = set()
    for query in queries:
        results = search_web(query)
        for r in results:
            url = r.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_results.append(r)
    return all_results