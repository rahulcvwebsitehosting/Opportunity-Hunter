"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBadge } from "./score-badge";
import { Opportunity, StoredOpportunity } from "@/lib/api";

interface OpportunityCardProps {
  opportunity: Opportunity | StoredOpportunity;
}

function isStored(opp: Opportunity | StoredOpportunity): opp is StoredOpportunity {
  return (opp as StoredOpportunity).id !== undefined;
}

export function OpportunityCard({ opportunity: op }: OpportunityCardProps) {
  const score = op.score ?? 0;
  const reasoning = op.reasoning ?? [];
  const title = op.title;
  const url = op.url;
  const summary = isStored(op) ? op.raw_text?.slice(0, 300) : (op as Opportunity).summary;

  const effort = isStored(op)
    ? reasoning.find((r) => r.startsWith("Effort:"))?.replace("Effort: ", "")
    : (op as Opportunity).effort_estimate;
  const roi = isStored(op)
    ? reasoning.find((r) => r.startsWith("ROI:"))?.replace("ROI: ", "")
    : (op as Opportunity).roi_estimate;

  const cleanReasoning = reasoning.filter(
    (r) => !r.startsWith("Effort:") && !r.startsWith("ROI:")
  );

  return (
    <Card className="w-full hover:shadow-lg transition-shadow border-2">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <ScoreBadge score={score} />
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg leading-tight line-clamp-2">
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {title}
            </a>
          </CardTitle>
          {effort && roi && (
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="font-medium">Effort: {effort}</span>
              <span className="font-medium">ROI: {roi}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>
        )}
        {cleanReasoning.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              AI Reasoning
            </p>
            <ul className="space-y-1 text-sm">
              {cleanReasoning.slice(0, 6).map((reason, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex-shrink-0">{reason.startsWith("✘") ? "✘" : "✔"}</span>
                  <span className={reason.startsWith("✘") ? "text-red-500" : "text-green-600"}>
                    {reason.replace(/^[✔✘]\s*/, "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View Opportunity →
        </a>
      </CardContent>
    </Card>
  );
}
