import type { Metadata } from "next";
import { ArticlesClient } from "@/components/editorial/ArticlesClient";

export const metadata: Metadata = {
  title: "Detourist Editorial Magazine",
  description:
    "Anti-overtourism Himalayan essays and overland border guides for Manali-Lahaul, Spiti Valley, Kathmandu, and Bhutan.",
};

export default function ArticlesPage() {
  return <ArticlesClient />;
}
