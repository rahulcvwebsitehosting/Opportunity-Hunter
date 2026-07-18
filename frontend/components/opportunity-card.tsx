"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  TrendingUp,
  Clock,
  ChevronDown,
  Check,
  X,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "./score-badge";
import { Opportunity, StoredOpportunity } from "@/lib/api";

interface OpportunityCardProps {
  opportunity: Opportunity | StoredOpportunity;
  index?: number;
}

function isStored(opp: Opportunity | StoredOpportunity): opp is StoredOpportunity {
  return (opp as StoredOpportunity).id !== undefined;
}

const effortMeta: Record<string, { color: string; label: string }> = {
  Low: { color: "text-emerald-700 bg-emerald-50 border border-emerald-200", label: "Low" },
  Medium: { color: "text-amber-700 bg-amber-50 border border-amber-200", label: "Medium" },
  High: { color: "text-red-700 bg-red-50 border border-red-200", label: "High" },
};

const roiMeta: Record<string, { color: string; label: string }> = {
  Low: { color: "text-gray-700 bg-gray-50 border border-gray-200", label: "Low" },
  Medium: { color: "text-cyan-700 bg-cyan-50 border border-cyan-200", label: "Medium" },
  High: { color: "text-violet-700 bg-violet-50 border border-violet-200", label: "High" },
  "Very High": { color: "text-violet-800 bg-violet-100 border border-violet-300", label: "Very High" },
};

export function OpportunityCard({ opportunity: op, index = 0 }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const score = op.score ?? 0;
  const reasoning = op.reasoning ?? [];
  const title = op.title;
  const url = op.url;
  const summary = isStored(op) ? op.raw_text?.slice(0, 280) : (op as Opportunity).summary;

  const effort = isStored(op)
    ? reasoning.find((r) => r.startsWith("Effort:"))?.replace("Effort: ", "")
    : (op as Opportunity).effort_estimate;
  const roi = isStored(op)
    ? reasoning.find((r) => r.startsWith("ROI:"))?.replace("ROI: ", "")
    : (op as Opportunity).roi_estimate;

  const cleanReasoning = reasoning.filter(
    (r) => !r.startsWith("Effort:") && !r.startsWith("ROI:")
  );

  const effortStyle = effortMeta[effort || ""] || { color: "text-gray-700 bg-gray-50", label: effort || "N/A" };
  const roiStyle = roiMeta[roi || ""] || { color: "text-gray-700 bg-gray-50", label: roi || "N/A" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-white rounded-2xl overflow-hidden border-violet-100 hover:border-violet-300 hover:shadow-lg transition-all duration-300 group">
        {/* Top score strip */}
        <div className="relative h-1.5 w-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
          />
        </div>

        <div className="p-5 sm:p-6">
          {/* Header: score + title */}
          <div className="flex items-start gap-4 mb-4">
            <ScoreBadge score={score} />
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
                {title}
              </h3>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-violet-600 mt-1 transition-colors truncate max-w-full"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {(() => {
                    try { return new URL(url).hostname; }
                    catch { return url; }
                  })()}
                </span>
              </a>
            </div>
          </div>

          {/* Pills: effort + ROI */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${effortStyle.color}`} role="status">
              <Clock className="w-3 h-3" aria-hidden="true" /> {effortStyle.label} effort
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${roiStyle.color}`} role="status">
              <TrendingUp className="w-3 h-3" aria-hidden="true" /> {roiStyle.label} ROI
            </span>
          </div>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {summary}
            </p>
          )}

          {/* Expandable AI Reasoning */}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`reasoning-${index}`}
            className="w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg bg-violet-50/50 hover:bg-violet-50 transition cursor-pointer border border-violet-100"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-violet-600" aria-hidden="true" />
              AI Reasoning
              <span className="text-xs text-muted-foreground font-normal">
                ({cleanReasoning.length} checks)
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.ul
                id={`reasoning-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden mt-3"
              >
                {cleanReasoning.map((reason, i) => {
                  const passed = !reason.startsWith("✘");
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-2 items-start text-sm p-2.5 rounded-md bg-muted/50"
                    >
                      <span
                        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                          passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                        aria-hidden="true"
                      >
                        {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </span>
                      <span className={passed ? "text-foreground" : "text-red-700"}>
                        {reason.replace(/^[✔✘\[\]]\s*/, "").trim()}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* CTA */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-medium transition-all border border-violet-200 cursor-pointer group/btn"
          >
            View Opportunity
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </a>
        </div>
      </Card>
    </motion.div>
  );
}
