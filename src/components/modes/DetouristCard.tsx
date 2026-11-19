"use client";

import { DetourAlternative } from "@/types/route";
import { Compass, CheckCircle2, ArrowRight } from "lucide-react";

interface DetouristCardProps {
  detour: DetourAlternative;
  isApplied: boolean;
  onToggleApply: () => void;
}

export function DetouristCard({ detour, isApplied, onToggleApply }: DetouristCardProps) {
  return (
    <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-emerald-500/30 relative overflow-hidden spatial-card-3d">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 shadow-xs">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold">
              Mode 4 • Bheed Se Door (Anti-Overtourism Engine)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
              Skip the Tourist Trap: Serene Counterpart
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleApply}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all self-start sm:self-auto tactile-button-3d print:hidden ${
            isApplied
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/20"
              : "visionos-glass text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/10"
          }`}
          aria-pressed={isApplied}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Counterpart Applied to Plan</span>
            </>
          ) : (
            <>
              <span>Swap in Itinerary</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-400/30 dark:border-rose-900/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-extrabold text-rose-600 dark:text-rose-400">
              ⚠️ The Overcrowded Trap
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/20">
              Crowd: {detour.crowdLevel}
            </span>
          </div>
          <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{detour.popularCrowdedSpot}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Aggressive touts, bumper-to-bumper traffic jams, inflated tourist rates, and 2-hour photo queues.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-400/40 dark:border-emerald-700/50 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              🌿 Verified Serene Counterpart
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/30">
              Save ~{detour.savingsPercentage}%
            </span>
          </div>
          <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{detour.counterpartSpot}</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{detour.whyBetter}</p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-2 font-mono font-bold">
            📍 Just {detour.distanceKm}km away from crowded center
          </p>
        </div>
      </div>
    </div>
  );
}
