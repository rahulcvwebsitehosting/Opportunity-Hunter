"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onboardWithFile, onboardWithText, type UserProfile } from "@/lib/api";

interface OnboardingFormProps {
  onComplete: (profileId: string, profile: UserProfile) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"file" | "text">("file");

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Opportunity Hunter</CardTitle>
          <p className="text-muted-foreground">
            Upload your resume and let the AI find opportunities tailored for you
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  mode === "file" ? "bg-white shadow-sm" : "text-muted-foreground"
                }`}
              >
                Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  mode === "text" ? "bg-white shadow-sm" : "text-muted-foreground"
                }`}
              >
                Paste Text
              </button>
            </div>

            {mode === "file" ? (
              <div className="space-y-2">
                <Label htmlFor="resume">Resume PDF</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && (
                  <p className="text-xs text-green-600">Selected: {file.name}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="rawText">Resume Text</Label>
                <textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={6}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Paste your resume text here..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile (optional)</Label>
              <Input
                id="github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Analyzing with AI..." : "Build My Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
