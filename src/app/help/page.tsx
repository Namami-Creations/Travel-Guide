import type { Metadata } from "next";
import { HelpClient } from "@/components/help/HelpClient";

export const metadata: Metadata = {
  title: "Help Center & Permit Guides",
  description:
    "Official border rules for Bhutan SDF (₹1,200/night), Nepal Voter ID & ₹100 note laws, IRCTC Tatkal hacks, and high-altitude AMS prevention.",
};

export default function HelpPage() {
  return <HelpClient />;
}
