"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { EditorialStoriesSection } from "@/components/editorial/EditorialStoriesSection";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { BookOpen } from "lucide-react";

export function ArticlesClient() {
  const router = useRouter();
  const { profile, updateProfile } = useDesiRoute();

  const pureVegFilter = profile.dietaryType === "pure-veg" || profile.dietaryType === "jain";

  const handleTogglePureVeg = () => {
    updateProfile({
      dietaryType: pureVegFilter ? "all" : "pure-veg",
    });
  };

  const handleSelectRoute = (routeId: string) => {
    router.push(`/?route=${encodeURIComponent(routeId)}`);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header pureVegFilter={pureVegFilter} onTogglePureVeg={handleTogglePureVeg} />

      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 flex-1"
      >
        <section className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-950/60 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
            <span>Detourist Editorial Magazine • Authentic Himalayan Lore</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-50 leading-tight">
            Uncrowded Escapes & Road Stories
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mx-auto sm:mx-0">
            Researched essays on skipping commercial tourist traps, discovering serene counterparts, and navigating the overland Himalayan borders of India, Nepal, and Bhutan.
          </p>
        </section>

        <EditorialStoriesSection onSelectRouteFromArticle={handleSelectRoute} />
      </main>

      <Footer />
    </div>
  );
}
