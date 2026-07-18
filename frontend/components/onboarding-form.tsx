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
        {/* AI-native badge + hero */}
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              AI-Native · Multi-Model Reasoning
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

          {/* Feature badges with typing dots accent */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={0.1 * i} y={20}>
                <div className="glass-card rounded-xl p-4 text-left flex gap-3 items-start hover:shadow-md transition-shadow">
                  <div className="p-2.5 rounded-lg bg-violet-100 text-violet-600 flex-shrink-0" aria-hidden="true">
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Form card */}
        <ScrollReveal delay={0.2} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-200 ai-glow">
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl" role="tablist">
              <button
                type="button"
                onClick={() => setMode("file")}
                role="tab"
                aria-selected={mode === "file"}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === "file"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1.5" aria-hidden="true" /> Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                role="tab"
                aria-selected={mode === "text"}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === "text"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" aria-hidden="true" /> Paste Text
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Onboarding form">
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
                    aria-label="Drag and drop PDF resume or click to browse"
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                      dragOver
                        ? "border-violet-600 bg-violet-50"
                        : "border-violet-200 hover:border-violet-400 hover:bg-violet-50/40"
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
                      aria-describedby="resume-help"
                    />
                    {fileName ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center" aria-hidden="true">
                          <FileText className="w-6 h-6 text-violet-600" />
                        </div>
                        <p className="text-sm font-medium text-violet-700">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center" aria-hidden="true">
                          <Upload className="w-6 h-6 text-violet-500" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          Drop your resume here
                        </p>
                        <p className="text-xs text-muted-foreground" id="resume-help">
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
                    className="w-full rounded-xl bg-white border border-violet-200 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition resize-none"
                    placeholder="Paste your resume text here..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-medium flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" aria-hidden="true" /> GitHub Profile
                  <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="bg-white border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 border border-destructive/20"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold bg-violet-600 hover:bg-violet-700 transition-all ai-glow cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    AI is analyzing your resume
                    <span className="flex gap-1 ml-1" aria-hidden="true">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </span>
                  </>
                ) : (
                  <>
                    Build My Profile
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
