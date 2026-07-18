"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Copy,
  Check,
  Sparkles,
  ListChecks,
  Clock,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateCopilot, type CopilotResponse } from "@/lib/api";

interface CopilotModalProps {
  profileId: string;
  opportunityId: string;
  opportunityTitle: string;
  open: boolean;
  onClose: () => void;
}

export function CopilotModal({
  profileId,
  opportunityId,
  opportunityTitle,
  open,
  onClose,
}: CopilotModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CopilotResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setData(null);
      setError("");
      setCopied(false);
    }
  }, [open]);

  // Focus trap: focus the close button on open (WCAG 2.4.3)
  useEffect(() => {
    if (open && closeRef.current) {
      closeRef.current.focus();
    }
    // Return focus on close
    if (!open) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement;
    return () => {
      previouslyFocused?.focus();
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const result = await generateCopilot(profileId, opportunityId);
      setData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (data?.cover_letter) {
      await navigator.clipboard.writeText(data.cover_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    const content = `COVER LETTER\n\n${data.cover_letter}\n\n\nAPPLICATION CHECKLIST\n${data.application_checklist
      .map((c, i) => `${i + 1}. ${c}`)
      .join("\n")}\n\nEstimated time: ${data.estimated_completion_time}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "application-assets.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Application Co-Pilot"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-white rounded-2xl border border-violet-200 shadow-xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-violet-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 ai-glow" aria-hidden="true">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">Application Co-Pilot</h3>
                    <p className="text-xs text-muted-foreground truncate">{opportunityTitle}</p>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-6">
                {!data && !loading && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                      <Sparkles className="w-8 h-8 text-violet-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                      The Co-Pilot will draft a tailored cover letter and a step-by-step
                      application checklist based on your profile.
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={!opportunityId}
                      className="bg-violet-600 hover:bg-violet-700 px-6 cursor-pointer text-white"
                    >
                      <Sparkles className="w-4 h-4" aria-hidden="true" /> Generate My Assets
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-2 mb-3" aria-hidden="true">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">
                      The Co-Pilot agent is drafting your assets...
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      This can take 20-40 seconds
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive bg-destructive/5 rounded-lg p-3 border border-destructive/20" role="alert">
                    {error}
                  </p>
                )}

                {data && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Cover Letter */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-700">
                          Cover Letter
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="text-muted-foreground hover:text-foreground h-8 cursor-pointer"
                            aria-label="Copy cover letter to clipboard"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="text-muted-foreground hover:text-foreground h-8 cursor-pointer"
                            aria-label="Download as text file"
                          >
                            <Download className="w-3.5 h-3.5" aria-hidden="true" /> Save
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap rounded-xl border border-violet-100 bg-violet-50/30 p-5 text-sm leading-relaxed max-h-[400px] overflow-y-auto text-foreground">
                        {data.cover_letter}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-700">
                          <ListChecks className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />
                          Application Checklist
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
                          <Clock className="w-3 h-3" aria-hidden="true" /> {data.estimated_completion_time}
                        </span>
                      </div>
                      <ol className="space-y-2" aria-label="Application checklist">
                        {data.application_checklist.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex gap-3 items-start p-3 rounded-lg bg-muted/50 hover:bg-muted transition cursor-default"
                          >
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-violet-100 text-violet-700 rounded-full text-xs font-bold" aria-hidden="true">
                              {i + 1}
                            </span>
                            <span className="text-sm leading-relaxed pt-0.5 text-foreground">{item}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleGenerate}
                        variant="outline"
                        className="flex-1 border-violet-200 bg-white hover:bg-violet-50 text-violet-700 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 mr-1" aria-hidden="true" /> Regenerate
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}