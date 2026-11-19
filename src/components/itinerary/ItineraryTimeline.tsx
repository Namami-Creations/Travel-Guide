"use client";

import React from "react";
import { CurrencyCode, DetourAlternative, DietaryType, ItineraryDay } from "@/types/route";
import { formatPreferredCurrency } from "@/lib/engine/calculator";
import { Clock, Utensils, Bus, Compass } from "lucide-react";

interface ItineraryTimelineProps {
  itinerary: ItineraryDay[];
  pureVegFilter: boolean;
  dietaryPreference?: DietaryType;
  isSukoonActive: boolean;
  appliedDetour?: DetourAlternative | null;
  currencyPref?: CurrencyCode;
}

export function ItineraryTimeline({
  itinerary,
  pureVegFilter,
  dietaryPreference = "pure-veg",
  isSukoonActive,
  appliedDetour,
  currencyPref = "INR",
}: ItineraryTimelineProps) {
  const isJainMode = dietaryPreference === "jain";

  return (
    <section aria-label="Curated Day by Day Itinerary" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Tested & Unhurried Field Schedule
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-1">
            Day-by-Day Experience Schedule
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Carefully paced daily steps with verified pure veg eateries and localized transit micro-notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {(pureVegFilter || isJainMode) && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5 shadow-xs">
              <span aria-hidden="true">🌿</span>
              {isJainMode ? "Jain Friendly Highlighted" : "Pure Veg Verified"}
            </span>
          )}
          {appliedDetour && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Counterpart Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Injected Serene Counterpart Swap Card when Bheed Se Door is toggled ON */}
      {appliedDetour && (
        <div className="p-5 rounded-[1.75rem] bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-[10px] font-mono uppercase font-extrabold text-emerald-700 dark:text-emerald-300">
                Injected Into Schedule • Replaces {appliedDetour.popularCrowdedSpot}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-slate-50">
                Serene Detour Stop: {appliedDetour.counterpartSpot}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{appliedDetour.whyBetter}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white shrink-0 self-start sm:self-center">
            -{appliedDetour.savingsPercentage}% Crowd Markup
          </span>
        </div>
      )}

      <div className="space-y-6">
        {itinerary.map((day) => (
          <article
            key={day.dayNumber}
            className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 transition-all duration-300 spatial-card-3d"
          >
            {/* Day Header */}
            <div className="flex items-center gap-3.5 pb-4 mb-5 border-b border-slate-200/60 dark:border-slate-800/60">
              <span className="w-10 h-10 rounded-2xl spatial-dial text-slate-950 dark:text-slate-100 flex items-center justify-center font-mono font-black text-sm shrink-0 border border-white/60 dark:border-white/10 shadow-sm">
                {String(day.dayNumber).padStart(2, "0")}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">
                  Day {String(day.dayNumber).padStart(2, "0")} Focus
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50 leading-tight">
                  {day.theme}
                </h3>
              </div>
            </div>

            {/* Activities Vertical Steps */}
            <div className="space-y-4">
              {day.activities.map((act, actIdx) => (
                <div
                  key={`${day.dayNumber}-${act.timeOfDay}-${actIdx}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isSukoonActive
                      ? "bg-teal-500/10 dark:bg-teal-950/30 border-teal-500/30 dark:border-teal-700/40"
                      : "visionos-glass border-slate-200/70 dark:border-slate-800/70 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-extrabold shadow-2xs">
                        {act.timeOfDay}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{act.title}</h4>
                      {isJainMode && !act.jainAvailable && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Pack Dry Jain Snacks
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-blue-500" aria-hidden="true" /> {act.durationHours} hrs
                      </span>
                      <span aria-hidden="true">•</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatPreferredCurrency(act.estimatedCostInr, currencyPref)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {act.description}
                  </p>

                  {act.recommendedEatery && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-800/40 text-xs text-emerald-950 dark:text-emerald-200 mb-2.5 flex items-start gap-2.5">
                      <Utensils className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold">{act.recommendedEatery.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                            {act.recommendedEatery.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                          Specialty: {act.recommendedEatery.specialty}
                        </p>
                      </div>
                    </div>
                  )}

                  {act.transitNote && (
                    <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/20 dark:border-blue-800/30 text-[11px] text-blue-950 dark:text-blue-200 flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                      <span>{act.transitNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
