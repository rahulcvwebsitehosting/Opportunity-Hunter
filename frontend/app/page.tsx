"use client";

import { useState } from "react";
import { OnboardingForm } from "@/components/onboarding-form";
import { Dashboard } from "@/components/dashboard";
import type { UserProfile } from "@/lib/api";

export default function Home() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  if (profileId && profile) {
    return <Dashboard profileId={profileId} profile={profile} />;
  }

  return (
    <OnboardingForm
      onComplete={(id, p) => {
        setProfileId(id);
        setProfile(p);
      }}
    />
  );
}
