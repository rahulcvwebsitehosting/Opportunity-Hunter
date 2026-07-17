import json
import os
from typing import Dict, Any
from dotenv import load_dotenv
import pdfplumber
from llm_router import chat_completion, MODEL_PARSER

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def parse_resume(resume_text: str) -> Dict[str, Any]:
    prompt = f"""
Parse the following resume text into a structured JSON object with these exact fields:
- name (string)
- skills (array of strings)
- education (array of objects: degree, institution, year)
- experience (array of objects: role, company, duration)
- location (string)
- interests (array of strings)

Resume Text:
{resume_text}

Output ONLY valid JSON. Do not include any other text or markdown formatting.
"""
    response = chat_completion(
        model=MODEL_PARSER,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
    )
    raw = response.choices[0].message.content
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def profile_from_pdf(pdf_path: str) -> Dict[str, Any]:
    resume_text = extract_text_from_pdf(pdf_path)
    return parse_resume(resume_text)


def profile_from_text(raw_text: str) -> Dict[str, Any]:
    return parse_resume(raw_text)