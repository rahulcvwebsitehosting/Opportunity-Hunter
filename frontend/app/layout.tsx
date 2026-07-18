import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AnimatedBackground } from "@/components/animated-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opportunity Hunter — AI Agent for Scholarships & Hackathons",
  description:
    "Never miss a life-changing opportunity again. Upload your resume — the AI hunts scholarships, hackathons, and internships tailored to you.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
