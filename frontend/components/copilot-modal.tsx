"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (!open) return null;

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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Application Co-Pilot</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generating application assets for: <span className="font-semibold">{opportunityTitle}</span>
          </p>

          {!data && !loading && (
            <Button onClick={handleGenerate} disabled={!opportunityId}>
              Generate Cover Letter & Checklist
            </Button>
          )}

          {loading && (
            <div className="flex items-center gap-2 py-8">
              <div className="h-4 w-4 rounded-full bg-blue-500 animate-ping" />
              <p className="text-sm">The Co-Pilot agent is drafting your assets...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {data && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
                <div className="whitespace-pre-wrap rounded-md border bg-white p-4 text-sm leading-relaxed">
                  {data.cover_letter}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Application Checklist</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Estimated time: <span className="font-medium">{data.estimated_completion_time}</span>
                </p>
                <ol className="space-y-2">
                  {data.application_checklist.map((item, i) => (
                    <li key={i} className="flex gap-3 p-2 rounded-md bg-muted">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
