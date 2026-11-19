import type { Metadata } from "next";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Settings & Privacy Vault",
  description:
    "Switch between INR, NPR, and BTN displays, enable Incognito Zero-Persistence Travel Mode, export your trip vault, or permanently wipe browser metadata under DPDP Act 2023.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
