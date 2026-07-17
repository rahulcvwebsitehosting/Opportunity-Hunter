"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityCard } from "./opportunity-card";
import { CopilotModal } from "./copilot-modal";
import {
  runHunt,
  getOpportunities,
  type UserProfile,
  type Opportunity,
  type StoredOpportunity,
} from "@/lib/api";

interface DashboardProps {
  profileId: string;
  profile: UserProfile;
}

const HUNT_STAGES = [
  "Waking up the Hunter Agent...",
  "Generating search queries based on your profile...",
  "Searching the web across multiple sources...",
  "Reading opportunity descriptions...",
  "Reasoning about your eligibility for each opportunity...",
  "Calculating Opportunity Scores...",
  "Finalizing your curated list...",
];

type UnifiedOpportunity = Opportunity | StoredOpportunity;

export function Dashboard({ profileId, profile }: DashboardProps) {
  const [hunting, setHunting] = useState(false);
  const [stage, setStage] = useState(0);
  const [opportunities, setOpportunities] = useState<UnifiedOpportunity[]>([]);
  const [error, setError] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<{ id: string; title: string } | null>(null);

  const runHunter = async () => {
    setHunting(true);
    setError("");
    setOpportunities([]);

    const stageInterval = setInterval(() => {
      setStage((s) => Math.min(s + 1, HUNT_STAGES.length - 1));
    }, 4000);

    try {
      const result = await runHunt(profileId);
      setOpportunities(result.opportunities);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hunt failed";
      setError(msg);
    } finally {
      clearInterval(stageInterval);
      setHunting(false);
    }
  };

  const loadStored = async () => {
    try {
      const result = await getOpportunities();
      setOpportunities(result.opportunities);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      setError(msg);
    }
  };

  const handleApply = (opId: string, title: string) => {
    setSelectedOpp({ id: opId, title });
    setCopilotOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Opportunity Hunter</h1>
          <Button variant="outline" onClick={() => window.location.reload()}>
            New Profile
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your AI Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Name</p>
                <p className="text-lg">{profile.name || "Unknown"}</p>
                {profile.location && (
                  <>
                    <p className="text-sm font-semibold mt-2">Location</p>
                    <p className="text-lg">{profile.location}</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Skills</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                {profile.interests.length > 0 && (
                  <>
                    <p className="text-sm font-semibold mt-3">Interests</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {profile.interests.map((interest, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {profile.education.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold">Education</p>
                {profile.education.map((edu, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {edu.degree} · {edu.institution} {edu.year && `(${edu.year})`}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={runHunter} disabled={hunting} size="lg">
            {hunting ? "Hunting..." : "Run Hunter Agent"}
          </Button>
          <Button onClick={loadStored} variant="outline" size="lg">
            Load Cached Opportunities
          </Button>
        </div>

        {hunting && (
          <Card className="border-2 border-blue-400 bg-blue-50">
            <CardContent className="py-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
                  <p className="text-sm font-medium">{HUNT_STAGES[stage]}</p>
                </div>
                {HUNT_STAGES.slice(0, stage).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 pl-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-xs text-green-700">{s}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {opportunities.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {opportunities.length} Opportunities Found
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {opportunities.map((op, i) => {
                const opId = (op as StoredOpportunity).id || `temp-${i}`;
                return (
                  <div key={opId} className="space-y-2">
                    <OpportunityCard opportunity={op} />
                    {("id" in op) && (
                      <Button
                        onClick={() => handleApply(opId, op.title)}
                        className="w-full"
                        variant="default"
                      >
                        Apply via Co-Pilot
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {selectedOpp && (
        <CopilotModal
          profileId={profileId}
          opportunityId={selectedOpp.id}
          opportunityTitle={selectedOpp.title}
          open={copilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      )}
    </div>
  );
}
