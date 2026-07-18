"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Code,
  Sparkles,
  ArrowRight,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  onboardWithFile,
  onboardWithText,
  type UserProfile,
} from "@/lib/api";
import { ScrollReveal } from "@/lib/animations";

interface OnboardingFormProps {
  onComplete: (profileId: string, profile: UserProfile) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"file" | "text">("file");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.name.endsWith(".pdf")) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let result;
      if (mode === "file" && file) {
        result = await onboardWithFile(file, githubUrl);
      } else if (mode === "text" && rawText.trim()) {
        result = await onboardWithText(rawText, githubUrl);
      } else {
        setError("Please provide a resume (file or text)");
        setLoading(false);
        return;
      }
      onComplete(result.profile_id, result.profile);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Target, title: "AI Match Score", desc: "Reasoning-based eligibility" },
    { icon: Zap, title: "Live Web Hunting", desc: "20+ sources scraped daily" },
    { icon: Sparkles, title: "Cover Letter Co-Pilot", desc: "Drafts tailored applications" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Multi-Model AI Agent · Powered by OpenRouter
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            Never miss a
            <br />
            <span className="gradient-text">life-changing opportunity</span>
          </h1>
          <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Upload your resume once. Let the AI hunt scholarships, hackathons, and
            internships tailored to you — and draft your applications.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={0.1 * i} y={20}>
                <div className="glass rounded-xl p-4 text-left flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 flex-shrink-0">
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="max-w-2xl mx-auto">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 glow-primary">
            <div className="flex gap-2 mb-6 p-1 bg-black/30 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "file"
                    ? "bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1.5" /> Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "text"
                    ? "bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" /> Paste Text
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "file" ? (
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-sm font-medium">
                    Resume PDF
                  </Label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                      dragOver
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-border hover:border-violet-500/50 hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFile(f);
                          setFileName(f.name);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {fileName ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-violet-400" />
                        </div>
                        <p className="text-sm font-medium text-violet-300">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                          Drop your resume here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF · Max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="rawText" className="text-sm font-medium">
                    Resume Text
                  </Label>
                  <textarea
                    id="rawText"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl bg-black/30 border border-border px-4 py-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition resize-none"
                    placeholder="Paste your resume text here..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-medium flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> GitHub Profile
                  <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="bg-black/30 border-border focus:border-violet-500"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all glow-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is analyzing your resume...
                  </>
                ) : (
                  <>
                    Build My Profile
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
