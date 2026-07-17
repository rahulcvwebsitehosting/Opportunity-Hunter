const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  name?: string;
  skills: string[];
  education: { degree: string; institution: string; year?: string }[];
  experience: { role: string; company: string; duration?: string }[];
  location?: string;
  interests: string[];
}

export interface OnboardResponse {
  profile_id: string;
  profile: UserProfile;
}

export interface Opportunity {
  title: string;
  url: string;
  summary: string;
  score: number;
  reasoning: string[];
  effort_estimate: string;
  roi_estimate: string;
}

export interface HuntResponse {
  profile_id: string;
  opportunities: Opportunity[];
}

export interface StoredOpportunity {
  id: string;
  title: string;
  url: string;
  raw_text: string;
  score: number | null;
  reasoning: string[] | null;
  created_at: string | null;
}

export async function onboardWithFile(file: File, githubUrl: string): Promise<OnboardResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (githubUrl) formData.append("github_url", githubUrl);
  const res = await fetch(`${API_BASE}/onboard`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Onboard failed: ${await res.text()}`);
  return res.json();
}

export async function onboardWithText(rawText: string, githubUrl: string): Promise<OnboardResponse> {
  const formData = new FormData();
  formData.append("raw_text", rawText);
  if (githubUrl) formData.append("github_url", githubUrl);
  const res = await fetch(`${API_BASE}/onboard`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Onboard failed: ${await res.text()}`);
  return res.json();
}

export async function runHunt(profileId: string): Promise<HuntResponse> {
  const res = await fetch(`${API_BASE}/hunt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile_id: profileId }),
  });
  if (!res.ok) throw new Error(`Hunt failed: ${await res.text()}`);
  return res.json();
}

export async function getOpportunities(): Promise<{ opportunities: StoredOpportunity[] }> {
  const res = await fetch(`${API_BASE}/opportunities`);
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  return res.json();
}

export interface CopilotResponse {
  profile_id: string;
  opportunity_id: string;
  cover_letter: string;
  application_checklist: string[];
  estimated_completion_time: string;
}

export async function generateCopilot(
  profileId: string,
  opportunityId: string
): Promise<CopilotResponse> {
  const res = await fetch(`${API_BASE}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile_id: profileId, opportunity_id: opportunityId }),
  });
  if (!res.ok) throw new Error(`Co-Pilot failed: ${await res.text()}`);
  return res.json();
}
