"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  Database,
  RefreshCw,
  LogOut,
  Sparkles,
  Loader2,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  "Waking up the Hunter Agent",
  "Generating search queries from your profile",
  "Searching the web via Tavily",
  "Reading & scraping opportunity pages",
  "Reasoning about eligibility (GPT-OSS-120b)",
  "Calculating Opportunity Scores",
  "Finalizing your curated list",
];

type UnifiedOpportunity = Opportunity | StoredOpportunity;

export function Dashboard({ profileId, profile }: DashboardProps) {
  const [hunting, setHunting] = useState(false);
  const [stage, setStage] = useState(0);
  const [stagesDone, setStagesDone] = useState<number[]>([]);
  const [opportunities, setOpportunities] = useState<UnifiedOpportunity[]>([]);
  const [error, setError] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<{ id: string; title: string } | null>(null);
  const [loadedFromCache, setLoadedFromCache] = useState(false);

  const runHunter = async () => {
    setHunting(true);
    setError("");
    setOpportunities([]);
    setStage(0);
    setStagesDone([]);

    const stageInterval = setInterval(() => {
      setStage((s) => {
        const next = Math.min(s + 1, HUNT_STAGES.length - 1);
        setStagesDone((d) => (d.includes(s) ? d : [...d, s]));
        return next;
      });
    }, 3500);

    try {
      const result = await runHunt(profileId);
      setOpportunities(result.opportunities);
      setStagesDone(Array.from({ length: HUNT_STAGES.length }, (_, i) => i));
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
      setLoadedFromCache(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      setError(msg);
    }
  };

  useEffect(() => {
    loadStored();
  }, []);

  const handleApply = (opId: string, title: string) => {
    setSelectedOpp({ id: opId, title });
    setCopilotOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 glass-strong border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center glow-primary">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg">Opportunity Hunter</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">New Profile</span>
          </Button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Profile hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-strong rounded-2xl p-5 sm:p-7 border-white/10">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white glow-primary">
                  {profile.name?.charAt(0) || "?"}
                </div>
              </div>

              {/* Profile content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold">{profile.name || "Anonymous"}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {profile.location}
                    </span>
                  )}
                  {profile.education[0] && (
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {profile.education[0].degree} · {profile.education[0].institution}
                    </span>
                  )}
                  {profile.experience[0]?.role && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {profile.experience[0].role}
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="px-2.5 py-1 bg-violet-500/15 text-violet-300 rounded-md text-xs font-medium border border-violet-500/20"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                {profile.interests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-500/15 text-blue-300 rounded-md text-xs font-medium border border-blue-500/20"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={runHunter}
            disabled={hunting}
            size="lg"
            className="h-12 px-6 font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 glow-primary"
          >
            {hunting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Hunting...
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" /> Run Hunter Agent
              </>
            )}
          </Button>
          <Button
            onClick={loadStored}
            variant="outline"
            size="lg"
            className="h-12 px-6 border-border bg-white/[0.02] hover:bg-white/[0.05]"
          >
            <Database className="w-4 h-4" /> Load Cached
          </Button>
        </motion.div>

        {/* Hunting progress */}
        <AnimatePresence>
          {hunting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="glass-strong rounded-2xl p-6 border-violet-500/30 overflow-hidden">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                    </div>
                    <p className="text-sm font-medium">{HUNT_STAGES[stage]}...</p>
                  </div>

                  {HUNT_STAGES.map((s, i) => {
                    const done = stagesDone.includes(i) && i < stage;
                    const current = i === stage;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: done || current ? 1 : 0.3, x: 0 }}
                        className="flex items-center gap-3 pl-2"
                      >
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : current ? (
                            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            done
                              ? "text-emerald-400/90"
                              : current
                                ? "text-violet-300"
                                : "text-muted-foreground"
                          }`}
                        >
                          {s}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20"
          >
            {error}
          </motion.p>
        )}

        {/* Results header */}
        <AnimatePresence>
          {opportunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end justify-between gap-4 pb-2"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {opportunities.length}{" "}
                  <span className="gradient-text">Opportunities</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {loadedFromCache && !hunting
                    ? "Loaded from cache · sorted by match score"
                    : "Sorted by match score · reasoning-powered"}
                </p>
              </div>
              {loadedFromCache && !hunting && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadStored}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opportunity grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-16">
          {opportunities.map((op, i) => {
            const opId = (op as StoredOpportunity).id || `temp-${i}`;
            const hasId = "id" in op;
            return (
              <div key={opId} className="space-y-3">
                <OpportunityCard opportunity={op} index={i} />
                {hasId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  >
                    <Button
                      onClick={() => handleApply(opId, op.title)}
                      className="w-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/40 text-violet-200 hover:from-violet-600/30 hover:to-indigo-600/30 transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Apply with Co-Pilot
                    </Button>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
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
