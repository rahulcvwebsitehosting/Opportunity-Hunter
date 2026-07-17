"""
Pre-seed Supabase with high-quality demo opportunities matching the PRD's 'Rahul' persona.
This ensures the live demo is reliable even if Tavily/OpenRouter APIs are slow or unavailable.

Usage:
    python seed_demo_data.py
"""
from supabase_client import insert_opportunity, insert_user_profile


DEMO_PROFILE = {
    "name": "Rahul Patel",
    "skills": ["Python", "React", "Machine Learning", "Web Development", "FastAPI"],
    "education": [
        {
            "degree": "B.Tech Civil Engineering",
            "institution": "IIT Bombay",
            "year": "2nd year",
        }
    ],
    "experience": [
        {
            "role": "Open Source Contributor",
            "company": "GitHub",
            "duration": "6 months",
            "description": "Built React dashboards and Python ML pipelines",
        }
    ],
    "location": "Mumbai, India",
    "interests": ["hackathons", "scholarships", "internships", "AI", "web development"],
}


DEMO_OPPORTUNITIES = [
    {
        "title": "NASA International Space Apps Challenge 2025",
        "url": "https://www.spaceappschallenge.org/",
        "raw_text": (
            "NASA Space Apps Challenge is the world's largest hackathon. "
            "Open to students worldwide. Teams of 2-4 solve real-world problems "
            "using NASA's open data. Requires Python or JavaScript experience. "
            "Any academic discipline is welcome. Prize: $10,000 USD + NASA mentorship. "
            "Final submissions due in 12 days. Open to all countries. "
            "Remote and in-person participation options available."
        ),
        "score": 96.0,
        "reasoning": [
            "Rahul is an exceptional match for this opportunity. Strong eligibility across all criteria.",
            "✔ Student eligible: Currently a 2nd-year student at IIT Bombay",
            "✔ Location eligible: Open to all countries, user is in India",
            "✔ Skill match: Python experience directly satisfies the technical requirement",
            "✔ Skill match: React experience enables building interactive NASA data dashboards",
            "✔ Interest aligned: User explicitly listed 'hackathons' as a core interest",
            "✔ Deadline comfortable: 12 days remaining provides ample preparation time",
            "✔ Cross-discipline friendly: Civil Engineering is explicitly accepted (any discipline)",
        ],
        "effort": "Medium",
        "roi": "Very High",
    },
    {
        "title": "OpenAI Hackathon Spring 2025 (Devpost)",
        "url": "https://openaihackathon.devpost.com/",
        "raw_text": (
            "Build an innovative AI agent using OpenAI's API. Open to developers globally. "
            "Free API credits provided. Prizes: $25,000 + startup funding opportunities. "
            "Requires: Python, web development experience. 1-week virtual hackathon. "
            "Judges look for: creative use of function calling, structured outputs, "
            "and real-world application. Must submit a working demo + 3-min video."
        ),
        "score": 94.0,
        "reasoning": [
            "Excellent fit. Rahul's skill stack is perfectly aligned with this hackathon.",
            "✔ Skill match: Python is the primary language for OpenAI API integration",
            "✔ Skill match: React enables building the demo UI required by judges",
            "✔ Skill match: Machine Learning experience adds depth to AI agent design",
            "✔ Location eligible: Virtual hackathon, open to India-based participants",
            "✔ Interest aligned: User lists 'AI' and 'hackathons' as core interests",
            "✔ Effort manageable: 1-week sprint matches user's project experience",
            "✔ Funding opportunity matches user's interest in internships",
            "✘ Will need to form a team if not solo participating",
        ],
        "effort": "High",
        "roi": "Very High",
    },
    {
        "title": "Stealth Startup - Full Stack Engineering Intern (Remote, India)",
        "url": "https://example-startup-jobs.com/fullstack-intern",
        "raw_text": (
            "Y Combinator-backed stealth startup in the AI infra space hiring a remote "
            "Full Stack Engineering Intern for 3 months. Requirements: Python, React, "
            "FastAPI experience. Open to current students. Stipend ₹40,000/month. "
            "Flexible hours around academic schedule. Will work directly with founding team. "
            "Quick application: GitHub profile + 200-word 'why you' essay."
        ),
        "score": 92.0,
        "reasoning": [
            "Outstanding fit. Stack matches user's exact skill set.",
            "✔ Skill match: Python (core requirement)",
            "✔ Skill match: React (core requirement)",
            "✔ Skill match: FastAPI (rare, highly valued)",
            "✔ Student-friendly: Explicitly open to current students",
            "✔ Location eligible: Remote, India-based candidates welcome",
            "✔ Compensation: ₹40K/month stipend well above market for interns",
            "✔ Hours flexible: Accommodates IIT academic schedule",
            "✔ Quick application: GitHub profile + 200-word essay (~12 min)",
            "✘ Will require writing a compelling 'why you' essay",
        ],
        "effort": "Low",
        "roi": "High",
    },
    {
        "title": "Microsoft AI for Good Grant 2025",
        "url": "https://example.com/microsoft-ai-for-good",
        "raw_text": (
            "Microsoft AI for Good Lab invites applications for grants of $5,000 USD "
            "for student projects applying AI to social impact. Open to undergraduate "
            "students worldwide. Requires: project proposal (3 pages), resume, and "
            "a faculty recommendation. Focus areas: climate, accessibility, health. "
            "60-day application window. Results announced in 90 days."
        ),
        "score": 75.0,
        "reasoning": [
            "Good fit for user's interests but requires more upfront effort.",
            "✔ Student eligible: Undergraduate status confirmed",
            "✔ Location eligible: Open worldwide",
            "✔ Skill match: ML experience relevant to AI project proposal",
            "✔ Interest aligned: 'AI' listed in user profile",
            "✘ Effort high: Requires 3-page project proposal",
            "✘ Requires faculty recommendation letter (not yet secured)",
            "✘ Long wait time: Results in 90 days",
            "✘ Doesn't directly address Civil Engineering domain",
        ],
        "effort": "High",
        "roi": "Medium",
    },
]


def seed():
    print("Seeding demo user profile...")
    profile_row = insert_user_profile(DEMO_PROFILE)
    profile_id = profile_row["id"]
    print(f"  Created profile: {profile_id}")

    print(f"\nSeeding {len(DEMO_OPPORTUNITIES)} demo opportunities...")
    for opp in DEMO_OPPORTUNITIES:
        row = insert_opportunity(
            title=opp["title"],
            url=opp["url"],
            raw_text=opp["raw_text"],
            score=opp["score"],
            reasoning=opp["reasoning"],
        )
        print(f"  [{opp['score']:.0f}] {opp['title']} -> {row['id']}")

    print(f"\nDone. To use the demo, call /hunt with profile_id: {profile_id}")


if __name__ == "__main__":
    seed()