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
  Low: { color: "text-emerald-400 bg-emerald-500/10", label: "Low" },
  Medium: { color: "text-amber-400 bg-amber-500/10", label: "Medium" },
  High: { color: "text-red-400 bg-red-500/10", label: "High" },
};

const roiMeta: Record<string, { color: string; label: string }> = {
  Low: { color: "text-gray-400 bg-gray-500/10", label: "Low" },
  Medium: { color: "text-blue-400 bg-blue-500/10", label: "Medium" },
  High: { color: "text-emerald-400 bg-emerald-500/10", label: "High" },
  "Very High": { color: "text-violet-400 bg-violet-500/10", label: "Very High" },
};

export function OpportunityCard({ opportunity: op, index = 0 }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const score = op.score ?? 0;
  const reasoning = op.reasoning ?? [];
  const title = op.title;
  const url = op.url;
  const summary = isStored(op) ? op.raw_text?.slice(0, 280) : (op as Opportunity).summary;

  let effort = isStored(op)
    ? reasoning.find((r) => r.startsWith("Effort:"))?.replace("Effort: ", "")
    : (op as Opportunity).effort_estimate;
  let roi = isStored(op)
    ? reasoning.find((r) => r.startsWith("ROI:"))?.replace("ROI: ", "")
    : (op as Opportunity).roi_estimate;

  const cleanReasoning = reasoning.filter(
    (r) => !r.startsWith("Effort:") && !r.startsWith("ROI:")
  );

  const effortStyle = effortMeta[effort || ""] || { color: "text-gray-400", label: effort || "N/A" };
  const roiStyle = roiMeta[roi || ""] || { color: "text-gray-400", label: roi || "N/A" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <Card className="glass-strong rounded-2xl overflow-hidden border-white/10 hover:border-violet-500/30 transition-all duration-300 group">
        {/* Score strip */}
        <div className="relative h-1.5 w-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"
          />
        </div>

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <ScoreBadge score={score} />
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                {title}
              </h3>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-violet-300 mt-1 transition-colors truncate max-w-full"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{new URL(url).hostname}</span>
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${effortStyle.color}`}>
              <Clock className="w-3 h-3" /> {effortStyle.label} effort
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${roiStyle.color}`}>
              <TrendingUp className="w-3 h-3" /> {roiStyle.label} ROI
            </span>
          </div>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {summary}
            </p>
          )}

          {/* Reasoning expandable */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition mb-3"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-violet-400" />
              AI Reasoning
              <span className="text-xs text-muted-foreground font-normal">
                ({cleanReasoning.length} checks)
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {cleanReasoning.map((reason, i) => {
                  const passed = !reason.startsWith("✘");
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-2 items-start text-sm p-2 rounded-md bg-white/[0.02]"
                    >
                      <span
                        className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                          passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </span>
                      <span className={passed ? "text-foreground/90" : "text-red-400/90"}>
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
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-sm font-medium transition-all group/btn"
          >
            View Opportunity
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </Card>
    </motion.div>
  );
}
