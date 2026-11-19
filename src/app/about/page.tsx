import type { Metadata } from "next";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { Mountain, Compass, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About DesiRoute OS",
  description:
    "Why DesiRoute OS was built for India, Nepal, and Bhutan: 100% Rupee transparency, anti-overtourism Bheed Se Door detours, Pure Veg & Jain verification, and DPDP 2023 privacy.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header />

      <main
        id="main-content"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 flex-1"
      >
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Mountain className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
            <span>The Subcontinent Travel Manifesto</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-50 leading-tight">
            Travel Should Restore Your Mind, <br className="hidden sm:inline" />
            Not Drain Your Nervous System.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            DesiRoute was built by independent travelers who were exhausted by bloated travel apps, sponsored fake reviews, 8-hour mountain traffic jams, and hidden agency markups.
          </p>
        </section>

        <section aria-label="Core Manifesto Pillars" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-blue-500/30 space-y-2.5 spatial-card-3d">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg border border-blue-500/20 shadow-xs" aria-hidden="true">
              ₹
            </div>
            <h2 className="font-extrabold text-base text-slate-950 dark:text-slate-50">
              100% Rupee Transparency
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never hide costs behind &quot;taxes extra at checkout.&quot; We calculate real petrol mileage, FASTag tolls, station cabs, and permit fees upfront.
            </p>
          </div>

          <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-emerald-500/30 space-y-2.5 spatial-card-3d">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs" aria-hidden="true">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-950 dark:text-slate-50">
              Bheed Se Door (Anti-Overtourism)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We refuse to recommend overtouristed selfie-stick queues. For every crowded trap, we find a pristine counterpart that supports local mountain homestays.
            </p>
          </div>

          <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-amber-500/30 space-y-2.5 spatial-card-3d">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/20 shadow-xs" aria-hidden="true">
              🌿
            </div>
            <h2 className="font-extrabold text-base text-slate-950 dark:text-slate-50">
              Pure Veg & Jain Certainty
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every corridor highlights verified pure vegetarian dhabas and Jain kitchens alongside clear warning badges for remote valleys where dry rations are wise.
            </p>
          </div>

          <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-purple-500/30 space-y-2.5 spatial-card-3d">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-xs" aria-hidden="true">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-950 dark:text-slate-50">
              Zero Tracking & Privacy First
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We do not track your real-time GPS or sell your phone number to resort agents. You have 1-click control to permanently erase all stored device metadata.
            </p>
          </div>
        </section>

        <section className="visionos-glass-elevated p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-5">
          <h2 className="text-lg font-black text-slate-950 dark:text-slate-50">
            How DesiRoute Differs from Traditional Travel Portals
          </h2>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="text-rose-500 font-black shrink-0 mt-0.5" aria-hidden="true">
                ✕
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-slate-100">Traditional Travel Agencies:</strong> Push expensive ₹1.5L package tours, flood your phone with sales calls, and route you through commission-heavy shopping traps.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-rose-500 font-black shrink-0 mt-0.5" aria-hidden="true">
                ✕
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-slate-100">Western Travel Apps:</strong> Price everything in USD, ignore Indian passport/Voter ID entry laws, and miss IRCTC trains or Bhutan ₹1,200 SDF rules.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 font-black shrink-0 mt-0.5" aria-hidden="true">
                ✓
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-slate-100">DesiRoute OS:</strong> 100% free web utility built for Indian Rupee reality, native UPI splitting, and peaceful uncrowded corridors.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
