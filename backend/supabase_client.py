import os
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def insert_user_profile(json_data: Dict[str, Any]) -> Dict[str, Any]:
    result = supabase.table("user_profiles").insert({"json_data": json_data}).execute()
    return result.data[0]


def get_user_profile(profile_id: str) -> Optional[Dict[str, Any]]:
    result = supabase.table("user_profiles").select("*").eq("id", profile_id).execute()
    if result.data:
        return result.data[0]
    return None


def insert_opportunity(
    title: str,
    url: str,
    raw_text: str,
    score: Optional[float] = None,
    reasoning: Optional[List[str]] = None,
) -> Dict[str, Any]:
    row = {
        "title": title,
        "url": url,
        "raw_text": raw_text,
    }
    if score is not None:
        row["score"] = score
    if reasoning is not None:
        row["reasoning"] = reasoning
    result = supabase.table("opportunities").insert(row).execute()
    return result.data[0]


def get_scored_opportunities(limit: int = 10) -> List[Dict[str, Any]]:
    result = (
        supabase.table("opportunities")
        .select("*")
        .order("score", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_opportunity_by_id(opportunity_id: str) -> Optional[Dict[str, Any]]:
    result = (
        supabase.table("opportunities")
        .select("*")
        .eq("id", opportunity_id)
        .execute()
    )
    if result.data:
        return result.data[0]
    return None