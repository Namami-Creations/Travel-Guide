import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Traveler Profile & Saved Vault",
  description:
    "Customize your departure hub, Pure Veg or Jain dietary assurance, and inspect bookmarked Subcontinent itineraries stored locally on your device.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
