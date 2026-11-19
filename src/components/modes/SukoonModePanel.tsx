"use client";

import React from "react";
import { SubcontinentRoute } from "@/types/route";
import { Sparkles, Heart, AlertTriangle, VolumeX, Eye } from "lucide-react";

interface SukoonModePanelProps {
  route: SubcontinentRoute;
  isSukoonActive: boolean;
  onToggleSukoon: () => void;
}

export function SukoonModePanel({
  route,
  isSukoonActive,
  onToggleSukoon,
}: SukoonModePanelProps) {
  const isHighAltitude = (route.altitudeMeters || 0) >= 2400;

  return (
    <section
      aria-label="Sukoon Mode Sensory and Transit Guidance"
      className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-teal-500/30 transition-all duration-300 spatial-card-3d"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-extrabold">
              Mode 3 • Sensory & Transit Zen
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
              Sukoon Transit & Nervous System Guide
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSukoon}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all tactile-button-3d print:hidden ${
            isSukoonActive
              ? "bg-teal-600 text-white border-teal-700 shadow-md shadow-teal-500/20"
              : "visionos-glass text-teal-700 dark:text-teal-300 border-teal-500/40 hover:bg-teal-500/10"
          }`}
          aria-pressed={isSukoonActive}
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isSukoonActive ? "Sukoon Mode: ACTIVE" : "Activate Sukoon Mode"}</span>
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3.5 mb-5 leading-relaxed">
        {isSukoonActive
          ? "Sukoon Mode is active: Itinerary steps are simplified into calm, single-step prompts to reduce cognitive load."
          : "Designed for neurodivergent, introverted, and anxious travelers. Replaces noisy schedules with single micro-steps and quiet terminal zones."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800/70">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            Quiet Transit Sanctuaries in {route.destination}
          </h3>
          <div className="space-y-2">
            {(route.quietTransitSpots || [
              {
                location: "Station / Airport Executive Lounge",
                tip: "Use railway 1st Class or airport quiet lounge for low-fluorescent lighting and clean washrooms.",
              },
            ]).map((spot) => (
              <div
                key={spot.location}
                className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs"
              >
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{spot.location}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {spot.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isHighAltitude
              ? "bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/30 dark:border-amber-700/40"
              : "visionos-glass border-slate-200/70 dark:border-slate-800/70"
          }`}
        >
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-1.5">
            {isHighAltitude ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
            ) : (
              <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" aria-hidden="true" />
            )}
            {isHighAltitude ? "Acute Mountain Sickness (AMS) Protocol" : "Pacing & Motion Wellness"}
          </h3>

          {isHighAltitude ? (
            <div className="space-y-1.5 text-[11px] text-amber-950 dark:text-amber-200">
              <p className="font-semibold">Elevation: ~{route.altitudeMeters}m above sea level</p>
              <ul className="list-disc pl-4 space-y-1 text-amber-900 dark:text-amber-300">
                <li>Drink min 3.5L water daily (avoid caffeine & alcohol on Day 1).</li>
                <li>Climb high, sleep low. Take rest breaks every 45 mins of uphill walking.</li>
                <li>Carry doctor-prescribed Diamox and camphor/clove sachet for dry mountain air.</li>
              </ul>
            </div>
          ) : (
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Sensory Fatigue Prevention:</p>
              <p>
                Schedule a mandatory 90-minute &quot;Do Nothing&quot; window between 3:00 PM and 4:30 PM to decompress before evening exploration.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
