"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!open) {
      setData(null);
      setError("");
      setCopied(false);
    }
  }, [open]);

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

  const handleCopy = () => {
    if (data?.cover_letter) {
      navigator.clipboard.writeText(data.cover_letter);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="glass-strong rounded-2xl border-white/10">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/5 bg-[hsl(240_10%_5%)]/95 backdrop-blur-md rounded-t-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 glow-primary">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">Application Co-Pilot</h3>
                    <p className="text-xs text-muted-foreground truncate">{opportunityTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-6">
                {!data && !loading && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                      The Co-Pilot will draft a tailored cover letter and a step-by-step
                      application checklist based on your profile.
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={!opportunityId}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6"
                    >
                      <Sparkles className="w-4 h-4" /> Generate My Assets
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 mb-3">
                      <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
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
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
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
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                          Cover Letter
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="text-muted-foreground hover:text-foreground h-8"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="text-muted-foreground hover:text-foreground h-8"
                          >
                            <Download className="w-3.5 h-3.5" /> Save
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-5 text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                        {data.cover_letter}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                          <ListChecks className="w-3.5 h-3.5 inline mr-1.5" />
                          Application Checklist
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-md bg-white/5">
                          <Clock className="w-3 h-3" /> {data.estimated_completion_time}
                        </span>
                      </div>
                      <ol className="space-y-2">
                        {data.application_checklist.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex gap-3 items-start p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition group"
                          >
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-violet-500/20 text-violet-300 rounded-full text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-sm leading-relaxed pt-0.5">{item}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleGenerate}
                        variant="outline"
                        className="flex-1 border-border bg-white/[0.02]"
                      >
                        Regenerate
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
