"use client";

import { CurrencyCode, SubcontinentRoute, TravelMonth, TravelStyle } from "@/types/route";
import { TransitMode } from "@/types/transit";
import {
  calculateItemizedBudget,
  formatPreferredCurrency,
  convertInrToLocalCurrency,
  getSeasonalStatus,
} from "@/lib/engine/calculator";
import {
  Users,
  Info,
  Sparkles,
  Building,
  Bus,
  Utensils,
  Shield,
  Compass,
  Mountain,
  Volume2,
  Printer,
} from "lucide-react";

interface BudgetMatrixProps {
  route: SubcontinentRoute;
  style: TravelStyle;
  onChangeStyle: (style: TravelStyle) => void;
  travelersCount: number;
  onChangeTravelers: (count: number) => void;
  childCount: number;
  onChangeChildren: (count: number) => void;
  budgetMultiplier: number;
  onChangeMultiplier: (multiplier: number) => void;
  intercityTransitPerPersonInr: number;
  activeTransitMode: TransitMode;
  detourApplied: boolean;
  selectedMonth: TravelMonth;
  currencyPref: CurrencyCode;
}

export function BudgetMatrix({
  route,
  style,
  onChangeStyle,
  travelersCount,
  onChangeTravelers,
  childCount,
  onChangeChildren,
  budgetMultiplier,
  onChangeMultiplier,
  intercityTransitPerPersonInr,
  activeTransitMode,
  detourApplied,
  selectedMonth,
  currencyPref,
}: BudgetMatrixProps) {
  const breakdown = calculateItemizedBudget(
    route,
    style,
    travelersCount,
    childCount,
    budgetMultiplier,
    {
      intercityTransitPerPersonInr,
      detourApplied,
    }
  );

  const safeTravelers = Math.max(1, travelersCount);
  const perPersonCost = Math.round(breakdown.total / safeTravelers);
  const perDayCost = Math.round(perPersonCost / Math.max(1, route.durationDays));
  const localCurrency = convertInrToLocalCurrency(breakdown.total, route.country);
  const seasonal = getSeasonalStatus(route, selectedMonth);

  // Zero-division safe percentage shares for visual bar
  const safeTotal = Math.max(1, breakdown.total);
  const pStays = Math.round((breakdown.stays / safeTotal) * 100);
  const pTransit = Math.round((breakdown.transit / safeTotal) * 100);
  const pFood = Math.round((breakdown.food / safeTotal) * 100);
  const pPermits = Math.round((breakdown.permitsAndFees / safeTotal) * 100);
  const pActivities = Math.round((breakdown.activities / safeTotal) * 100);
  const pBuffer = Math.max(0, 100 - (pStays + pTransit + pFood + pPermits + pActivities));

  return (
    <section
      aria-label="VisionOS Spatial Travel Cost Deck"
      className="visionos-glass-elevated p-6 sm:p-8 rounded-[2rem] transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Header & Tactile Travel Style Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              VisionOS Spatial Budget Deck
            </span>
            {detourApplied && breakdown.detourSavings > 0 && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-extrabold">
                🌿 Bheed Se Door Saved {formatPreferredCurrency(breakdown.detourSavings, currencyPref)}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-1">
            Real-Time All-In Budget Matrix
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Includes round-trip <strong>{activeTransitMode.toUpperCase()}</strong> intercity corridor + stays, food, permits & emergency buffer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center print:hidden">
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 shadow-inner">
            {(["backpacker", "comfort", "luxury"] as TravelStyle[]).map((s) => {
              const isActive = style === s;
              const labels = {
                backpacker: "Backpacker",
                comfort: "Comfort",
                luxury: "Luxury",
              };
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeStyle(s)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 capitalize ${
                    isActive
                      ? "bg-white text-slate-950 shadow-md dark:bg-slate-900 dark:text-cyan-400 shadow-slate-300/40 dark:shadow-black/50"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            title="Print or Save Offline PDF Brief for Zero-Network Mountain Zones"
            className="py-2 px-3.5 rounded-xl visionos-glass border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 tactile-button-3d"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
            <span className="hidden sm:inline">Offline Brief</span>
          </button>
        </div>
      </div>

      {/* Main Metric & 3 Spatial Telemetry Dials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-slate-50 font-mono">
              {formatPreferredCurrency(perPersonCost, currencyPref)}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ person</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <span>
              Total for {safeTravelers} traveler{safeTravelers > 1 ? "s" : ""}:
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {formatPreferredCurrency(breakdown.total, currencyPref)}
            </span>
          </div>

          {route.country !== "IN" && (
            <div className="mt-3 p-3 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200/70 dark:border-cyan-800/50 text-[11px] text-cyan-950 dark:text-cyan-200 flex items-start gap-2.5 shadow-2xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              <div>
                <span className="font-bold">Local Currency Peg: </span>
                <span className="font-mono font-semibold">{localCurrency.formatted}</span>
                <p className="text-[10px] text-cyan-800 dark:text-cyan-300 mt-0.5">{localCurrency.note}</p>
              </div>
            </div>
          )}
        </div>

        {/* 3 Spatial 3D Telemetry Dials */}
        <div className="lg:col-span-7 grid grid-cols-3 gap-3">
          <div className="spatial-dial p-3.5 rounded-2xl border border-white/80 dark:border-white/10 text-center flex flex-col items-center justify-center">
            <Mountain className="w-4 h-4 text-cyan-500 mb-1" aria-hidden="true" />
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">Max Elevation</span>
            <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-slate-100">
              {route.altitudeMeters ?? 1400}m
            </span>
            <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5 font-bold">
              {route.amsRisk ? "AMS Protocol" : "Normal Altitude"}
            </span>
          </div>

          <div className="spatial-dial p-3.5 rounded-2xl border border-white/80 dark:border-white/10 text-center flex flex-col items-center justify-center">
            <span
              className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-600 font-black text-xs flex items-center justify-center mb-1"
              aria-hidden="true"
            >
              ₹
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">Paced Burn</span>
            <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-slate-100">
              {formatPreferredCurrency(perDayCost, currencyPref)}
            </span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5 font-semibold">per day / pax</span>
          </div>

          <div className="spatial-dial p-3.5 rounded-2xl border border-white/80 dark:border-white/10 text-center flex flex-col items-center justify-center">
            <Volume2 className="w-4 h-4 text-emerald-500 mb-1" aria-hidden="true" />
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">Sukoon Rating</span>
            <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              {detourApplied ? "32 dB" : "38 dB"}
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 font-bold">
              {detourApplied ? "Deep Quiet Swap" : "Tranquil Sanctuary"}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Travelers & Season Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 print:hidden">
        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-600" aria-hidden="true" /> Adults
            </span>
            <span className="font-mono font-extrabold">{safeTravelers}</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 4, 6].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChangeTravelers(count)}
                aria-pressed={safeTravelers === count}
                className={`flex-1 py-1 text-xs rounded-lg font-bold transition-all ${
                  safeTravelers === count
                    ? "bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs"
                    : "bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <span>Children (6–12)</span>
            <span className="font-mono font-extrabold">{childCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChangeChildren(c)}
                aria-pressed={childCount === c}
                className={`flex-1 py-1 text-xs rounded-lg font-bold transition-all ${
                  childCount === c
                    ? "bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs"
                    : "bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Season Pacing
            </span>
            <div className="flex items-center gap-2">
              {Math.abs(budgetMultiplier - seasonal.recommendedMultiplier) > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeMultiplier(seasonal.recommendedMultiplier)}
                  className="text-[10px] font-mono text-blue-600 dark:text-blue-400 underline"
                >
                  Sync {selectedMonth}
                </button>
              )}
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {Math.round(budgetMultiplier * 100)}%
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0.85"
            max="1.35"
            step="0.05"
            value={budgetMultiplier}
            onChange={(e) => onChangeMultiplier(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg cursor-pointer"
            aria-label="Pacing and Season Flexibility Slider"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
            <span>Off-Season (-15%)</span>
            <span>Peak (+35%)</span>
          </div>
        </div>
      </div>

      {/* 3D Segmented Colored Proportional Expenditure Bar */}
      <div className="pt-6">
        <div
          className="h-3 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden flex shadow-inner border border-white/50 dark:border-white/10"
          role="img"
          aria-label={`Cost split: Stays ${pStays}%, Transit ${pTransit}%, Food ${pFood}%, Permits ${pPermits}%, Activities ${pActivities}%, Buffer ${pBuffer}%`}
        >
          <div style={{ width: `${pStays}%` }} className="bg-cyan-500 shadow-sm" title={`Stays: ${pStays}%`} />
          <div style={{ width: `${pTransit}%` }} className="bg-indigo-500 shadow-sm" title={`Transit: ${pTransit}%`} />
          <div style={{ width: `${pFood}%` }} className="bg-emerald-500 shadow-sm" title={`Food: ${pFood}%`} />
          <div style={{ width: `${pPermits}%` }} className="bg-amber-500 shadow-sm" title={`Permits: ${pPermits}%`} />
          <div style={{ width: `${pActivities}%` }} className="bg-purple-500 shadow-sm" title={`Activities: ${pActivities}%`} />
          <div style={{ width: `${pBuffer}%` }} className="bg-slate-400 shadow-sm" title={`Buffer: ${pBuffer}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-slate-500 text-[10px]">Stays</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.stays, currencyPref)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Bus className="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-slate-500 text-[10px]">Transit (All-In)</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.transit, currencyPref)}
              </p>
              {breakdown.intercityTransit > 0 && (
                <p className="text-[9px] text-indigo-500 font-mono">
                  incl. {formatPreferredCurrency(breakdown.intercityTransit, currencyPref)} intercity
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-slate-500 text-[10px]">Pure Veg Food</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.food, currencyPref)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-slate-500 text-[10px]">Permits & SDF</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.permitsAndFees, currencyPref)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-purple-500 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-slate-500 text-[10px]">Activities</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.activities, currencyPref)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0 flex items-center justify-center text-[9px] text-white font-bold"
              aria-hidden="true"
            >
              +
            </span>
            <div>
              <p className="text-slate-500 text-[10px]">Safety Buffer</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatPreferredCurrency(breakdown.buffer, currencyPref)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
