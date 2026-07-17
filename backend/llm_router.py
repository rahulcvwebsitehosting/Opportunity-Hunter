import os
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL")

MODEL_REASONER = os.getenv("MODEL_REASONER", "openai/gpt-oss-120b")
MODEL_PARSER = os.getenv("MODEL_PARSER", "mistralai/mistral-large-2512")
MODEL_ORCHESTRATOR = os.getenv("MODEL_ORCHESTRATOR", "minimax/minimax-m3")

or_client = OpenAI(
    base_url=OPENROUTER_BASE_URL,
    api_key=OPENROUTER_API_KEY,
)


def get_client(model: str) -> OpenAI:
    return or_client


def chat_completion(
    model: str,
    messages: List[Dict[str, str]],
    tools: Optional[List[Dict[str, Any]]] = None,
    tool_choice: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 4096,
) -> Any:
    kwargs = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if tools:
        kwargs["tools"] = tools
    if tool_choice:
        kwargs["tool_choice"] = tool_choice
    return or_client.chat.completions.create(**kwargs)


def chat_completion_structured(
    model: str,
    messages: List[Dict[str, str]],
    response_format: Dict[str, Any],
    temperature: float = 0.1,
    max_tokens: int = 4096,
) -> Any:
    return or_client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        response_format=response_format,
    )