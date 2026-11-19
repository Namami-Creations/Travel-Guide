import { Suspense } from "react";
import type { Metadata } from "next";
import { HomePlannerClient } from "@/components/planner/HomePlannerClient";

export const metadata: Metadata = {
  title: "DesiRoute OS • India, Nepal & Bhutan Multi-Modal Budget Planner",
  description:
    "Plan Himalayan and coastal corridors across India, Nepal, and Bhutan down to the exact Rupee. Compare Train, Bus, Bike, and Car transit, Bhutan SDF exemptions, Pure Veg/Jain dining, and anti-overtourism detours.",
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <HomePlannerClient />
    </Suspense>
  );
}
