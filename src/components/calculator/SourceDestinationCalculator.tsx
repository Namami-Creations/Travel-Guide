"use client";

import { useState } from "react";
import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { ORIGIN_GEO, resolveMultiModalTransit } from "@/lib/engine/transit-resolver";
import { findDestinationsByBudget } from "@/lib/engine/reverse-budget";
import { formatPreferredCurrency, getSeasonalStatus } from "@/lib/engine/calculator";
import { TransitMode } from "@/types/transit";
import { CurrencyCode, TravelMonth, TravelStyle } from "@/types/route";
import {
  Train,
  Bus,
  Car,
  Compass,
  ArrowRight,
  Sparkles,
  Coffee,
  ShieldCheck,
  Mountain,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const TRAVEL_MONTHS: TravelMonth[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface SourceDestinationCalculatorProps {
  selectedOrigin: string;
  onChangeOrigin: (originId: string) => void;
  selectedDestination: string;
  onSelectRoute: (routeId: string) => void;
  activeTransitMode: TransitMode;
  onChangeTransitMode: (mode: TransitMode) => void;
  selectedMonth: TravelMonth;
  onChangeMonth: (month: TravelMonth) => void;
  pureVegFilter: boolean;
  jainFilter: boolean;
  currencyPref: CurrencyCode;
}

export function SourceDestinationCalculator({
  selectedOrigin,
  onChangeOrigin,
  selectedDestination,
  onSelectRoute,
  activeTransitMode,
  onChangeTransitMode,
  selectedMonth,
  onChangeMonth,
  pureVegFilter,
  jainFilter,
  currencyPref,
}: SourceDestinationCalculatorProps) {
  const [calculatorMode, setCalculatorMode] = useState<"route" | "reverse">("route");

  // Reverse Budget States
  const [pocketBudget, setPocketBudget] = useState<number>(20000);
  const [tripDays, setTripDays] = useState<number>(5);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("comfort");

  const currentTransitPlan = resolveMultiModalTransit(selectedOrigin, selectedDestination);
  const matchedRoute = SUBCONTINENT_ROUTES.find((r) => r.id === selectedDestination) || SUBCONTINENT_ROUTES[0];
  const originAlt = ORIGIN_GEO[selectedOrigin]?.altitudeMeters ?? 250;
  const destAlt = matchedRoute.altitudeMeters ?? 2050;
  const elevationClimb = Math.max(0, destAlt - originAlt);

  const seasonal = getSeasonalStatus(matchedRoute, selectedMonth);

  const reverseMatches = findDestinationsByBudget({
    originId: selectedOrigin,
    maxBudgetInr: pocketBudget,
    durationDays: tripDays,
    style: travelStyle,
    pureVegRequired: pureVegFilter,
    jainRequired: jainFilter,
  });

  // Dynamic SVG control point matching altitude profile cleanly
  const destY = Math.max(5, Math.min(34, Math.round(35 - (Math.min(destAlt, 4400) / 4400) * 30)));
  const originY = Math.max(12, Math.min(36, Math.round(35 - (Math.min(originAlt, 2500) / 4400) * 30)));

  return (
    <section
      aria-label="Subcontinent Multi-Modal Route and Budget Engine"
      className="visionos-glass-elevated p-6 sm:p-8 rounded-[2rem] transition-all duration-300 relative overflow-hidden space-y-6"
    >
      {/* Mode Switcher: Forward Route Matrix vs Reverse Budget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400 font-bold">
              Spatial Transit & Rupee Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-1">
            {calculatorMode === "route"
              ? "Multi-Modal Route & Transit Matrix"
              : "Mera Budget, Meri Trip (Reverse Engine)"}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {calculatorMode === "route"
              ? "Selected transit mode and travel month automatically feed into your all-in Rupee breakdown below."
              : "Set your exact pocket budget; our engine reverse-matches uncrowded Himalayan sanctuaries including intercity transit."}
          </p>
        </div>

        {/* VisionOS Tactile Mode Selector Pill */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 shadow-inner self-start sm:self-center print:hidden">
          <button
            type="button"
            onClick={() => setCalculatorMode("route")}
            aria-pressed={calculatorMode === "route"}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              calculatorMode === "route"
                ? "bg-white text-slate-950 shadow-md dark:bg-slate-900 dark:text-blue-400 shadow-slate-300/40 dark:shadow-black/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Route & Transit
          </button>
          <button
            type="button"
            onClick={() => setCalculatorMode("reverse")}
            aria-pressed={calculatorMode === "reverse"}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              calculatorMode === "reverse"
                ? "bg-white text-slate-950 shadow-md dark:bg-slate-900 dark:text-amber-400 shadow-slate-300/40 dark:shadow-black/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Mera Budget</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODE 1: FORWARD MULTI-MODAL ROUTE CALCULATOR */}
      {/* ------------------------------------------------------------- */}
      {calculatorMode === "route" && (
        <div className="space-y-6">
          {/* Origin, Destination & Travel Month Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label
                htmlFor="origin-city-select"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between"
              >
                <span>Starting City (Origin)</span>
                <span className="font-mono text-[10px] text-blue-500 font-semibold">{originAlt}m Alt</span>
              </label>
              <select
                id="origin-city-select"
                value={selectedOrigin}
                onChange={(e) => onChangeOrigin(e.target.value)}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {ORIGIN_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor="destination-route-select"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between"
              >
                <span>Destination Corridor</span>
                <span className="font-mono text-[10px] text-cyan-500 font-semibold">{destAlt}m Alt</span>
              </label>
              <select
                id="destination-route-select"
                value={selectedDestination}
                onChange={(e) => onSelectRoute(e.target.value)}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {SUBCONTINENT_ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.country === "IN" ? "🇮🇳" : r.country === "NP" ? "🇳🇵" : "🇧🇹"} {r.destination} ({r.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="travel-month-select"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>Month</span>
              </label>
              <select
                id="travel-month-select"
                value={selectedMonth}
                onChange={(e) => onChangeMonth(e.target.value as TravelMonth)}
                className="w-full text-xs font-semibold p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {TRAVEL_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seasonality & Terrain Pass Status Banner */}
          <div
            role="status"
            aria-live="polite"
            className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
              seasonal.status === "closed"
                ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-950 dark:text-rose-200"
                : seasonal.status === "caution"
                ? "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-950 dark:text-amber-200"
                : seasonal.status === "peak"
                ? "bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/30 text-blue-950 dark:text-blue-200"
                : "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
            }`}
          >
            {seasonal.status === "closed" || seasonal.status === "caution" ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold">
                  {selectedMonth} Weather & Pass Status: {seasonal.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/70 font-bold">
                  Ideal: {matchedRoute.idealSeasons.join(" / ")}
                </span>
              </div>
              <p className="text-[11px] mt-0.5 opacity-90">{seasonal.advisory}</p>
            </div>
          </div>

          {/* Dynamic Topographic Elevation Profile & Ascent Cross-Section */}
          <div className="p-4 rounded-2xl visionos-glass border border-sky-400/20 dark:border-sky-500/20 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-cyan-500 shrink-0" aria-hidden="true" />
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Topographical Relief & Elevation Ascent
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
                  +{elevationClimb}m Net Climb
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <span>Origin: {originAlt}m</span>
                <span aria-hidden="true">→</span>
                <span className="font-bold text-cyan-500">Destination: {destAlt}m</span>
              </div>
            </div>

            <div className="h-10 w-full relative overflow-hidden rounded-xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 px-2 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="topoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${originY} Q 160 ${Math.round((originY + destY) / 2) + 4}, 320 ${Math.round(
                    (originY + destY) / 2
                  )} T 600 ${destY} L 600 40 L 0 40 Z`}
                  fill="url(#topoGradient)"
                />
                <path
                  d={`M 0 ${originY} Q 160 ${Math.round((originY + destY) / 2) + 4}, 320 ${Math.round(
                    (originY + destY) / 2
                  )} T 600 ${destY}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="elevation-path-glow"
                />
                <circle cx="15" cy={originY} r="3" fill="#3b82f6" />
                <circle cx="320" cy={Math.round((originY + destY) / 2)} r="3" fill="#0ea5e9" />
                <circle cx="585" cy={destY} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{selectedOrigin.toUpperCase()} Base</span>
              <span>Gateway Transition</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {destAlt >= 2500 ? "AMS Pacing Zone (>2500m)" : "Low-Altitude Zone"}
              </span>
            </div>
          </div>

          {/* Transit Mode Tabs & Detailed Cards */}
          {currentTransitPlan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 font-semibold">
                  CHOOSE INTERCITY TRANSIT MODE (~{currentTransitPlan.distanceKm} km one-way)
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    currentTransitPlan.provenance === "estimated"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  }`}
                >
                  {currentTransitPlan.provenance === "estimated" ? "⚡ Hub-Estimated" : "✓ Verified Corridor"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => onChangeTransitMode("train")}
                  aria-pressed={activeTransitMode === "train"}
                  className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all tactile-button-3d ${
                    activeTransitMode === "train"
                      ? "visionos-glass-elevated border-blue-500/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30"
                      : "visionos-glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Train className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="font-extrabold">Train (IRCTC)</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ~{currentTransitPlan.train.durationHours}h Rail Line
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeTransitMode("bus")}
                  aria-pressed={activeTransitMode === "bus"}
                  className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all tactile-button-3d ${
                    activeTransitMode === "bus"
                      ? "visionos-glass-elevated border-blue-500/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30"
                      : "visionos-glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Bus className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="font-extrabold">Volvo Bus</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatPreferredCurrency(currentTransitPlan.bus.fareInr, currencyPref)} Seat
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeTransitMode("car")}
                  aria-pressed={activeTransitMode === "car"}
                  className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all tactile-button-3d ${
                    activeTransitMode === "car"
                      ? "visionos-glass-elevated border-blue-500/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30"
                      : "visionos-glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Car className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="font-extrabold">Car / Road Trip</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentTransitPlan.car.distanceKm} km Direct
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeTransitMode("bike")}
                  aria-pressed={activeTransitMode === "bike"}
                  className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all tactile-button-3d ${
                    activeTransitMode === "bike"
                      ? "visionos-glass-elevated border-blue-500/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30"
                      : "visionos-glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Compass className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="font-extrabold">Bike Rental</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatPreferredCurrency(currentTransitPlan.bike.dailyRentalInr, currencyPref)} / day
                  </span>
                </button>
              </div>

              {currentTransitPlan.hubNote && (
                <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
                  <strong>Corridor Advisory:</strong> {currentTransitPlan.hubNote}
                </p>
              )}

              {/* Transit Details Glass Card */}
              <div className="p-5 rounded-2xl visionos-glass border border-slate-200/80 dark:border-slate-800">
                {activeTransitMode === "train" && (
                  <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-blue-600 dark:text-blue-400">
                          Recommended IRCTC Rail Line ({currentTransitPlan.train.fromStationCode} →{" "}
                          {currentTransitPlan.train.toStationCode})
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {currentTransitPlan.train.trainNumberName}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right text-xs font-mono text-slate-600 dark:text-slate-300">
                        <span>Duration: ~{currentTransitPlan.train.durationHours} hrs</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {currentTransitPlan.train.classes.map((c) => (
                        <div
                          key={c.className}
                          className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 text-xs spatial-card-3d"
                        >
                          <span className="text-slate-500 font-mono text-[10px] block">{c.className}</span>
                          <p className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-base mt-0.5">
                            {formatPreferredCurrency(c.fareInr, currencyPref)}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Tatkal Buffer: +{formatPreferredCurrency(c.tatkalBufferInr, currencyPref)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200/40 dark:border-blue-900/40">
                      💡 Pro Rail Tip: {currentTransitPlan.train.proTip}
                    </p>
                  </div>
                )}

                {activeTransitMode === "bus" && (
                  <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {currentTransitPlan.bus.serviceType}
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {currentTransitPlan.bus.operator}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-slate-100">
                          {formatPreferredCurrency(currentTransitPlan.bus.fareInr, currencyPref)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">per seat (1-way)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Boarding Hub</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {currentTransitPlan.bus.boardingPoint}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Dropping Terminal</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {currentTransitPlan.bus.droppingPoint}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-cyan-50/50 dark:bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-200/40 dark:border-cyan-900/40">
                      💡 Bus Advisory: {currentTransitPlan.bus.proTip}
                    </p>
                  </div>
                )}

                {activeTransitMode === "car" && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 spatial-card-3d">
                        <span className="text-slate-500 text-[10px] block">Road Distance</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {currentTransitPlan.car.distanceKm} km
                        </span>
                      </div>
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 spatial-card-3d">
                        <span className="text-slate-500 text-[10px] block">Driving Time</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          ~{currentTransitPlan.car.durationHours} hrs
                        </span>
                      </div>
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 spatial-card-3d">
                        <span className="text-slate-500 text-[10px] block">Est. Fuel (1-way)</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {formatPreferredCurrency(currentTransitPlan.car.estimatedFuelCostInr, currencyPref)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 spatial-card-3d">
                        <span className="text-slate-500 text-[10px] block">FASTag Tolls</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {formatPreferredCurrency(currentTransitPlan.car.fastagTollCostInr, currencyPref)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-slate-100">Highway Route: </span>
                      {currentTransitPlan.car.routeHighlights}
                    </p>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                        Verified Highway Pitstops (Pure Veg & Clean Restrooms)
                      </span>
                      <div className="space-y-2">
                        {currentTransitPlan.car.pitstops.map((p) => (
                          <div
                            key={p.name}
                            className="p-2.5 rounded-xl visionos-glass border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <Coffee className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{p.name}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                  ({p.distanceKm} km mark)
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">{p.tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentTransitPlan.crossBorderPermit && (
                      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200">
                        <span className="font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                          Vehicle Cross-Border Requirement: {currentTransitPlan.crossBorderPermit.permitName}
                        </span>
                        <p className="text-[11px] mt-1">{currentTransitPlan.crossBorderPermit.requirementNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTransitMode === "bike" && (
                  <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400">
                          Recommended Himalayan Motorcycle
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {currentTransitPlan.bike.recommendedModel}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-slate-100">
                          {formatPreferredCurrency(currentTransitPlan.bike.dailyRentalInr, currencyPref)} / day
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Hub: {currentTransitPlan.bike.rentalBaseCity}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Est. Mountain Fuel</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {formatPreferredCurrency(currentTransitPlan.bike.estimatedFuelInr, currencyPref)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Refundable Gear Deposit</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {formatPreferredCurrency(currentTransitPlan.bike.ridingGearDepositInr, currencyPref)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-900/40">
                      🏍️ Mountain Pass Advisory: {currentTransitPlan.bike.mountainPassNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODE 2: REVERSE BUDGET FINDER ("Mera Budget, Meri Trip") */}
      {/* ------------------------------------------------------------- */}
      {calculatorMode === "reverse" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl visionos-glass border border-amber-500/20">
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Max Pocket Budget (Per Person)
                </span>
                <span className="font-mono font-black text-xl text-slate-950 dark:text-slate-50">
                  {formatPreferredCurrency(pocketBudget, currencyPref)}
                </span>
              </div>
              <input
                type="range"
                min="6000"
                max="60000"
                step="1000"
                value={pocketBudget}
                onChange={(e) => setPocketBudget(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                aria-label="Pocket Budget Slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>₹6,000 (Student)</span>
                <span>₹25,000 (Comfort)</span>
                <span>₹60,000 (Luxury)</span>
              </div>
            </div>

            <div>
              <label htmlFor="reverse-origin-select" className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">
                Origin City
              </label>
              <select
                id="reverse-origin-select"
                value={selectedOrigin}
                onChange={(e) => onChangeOrigin(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                {ORIGIN_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="duration-days-select" className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">
                  Days
                </label>
                <select
                  id="duration-days-select"
                  value={tripDays}
                  onChange={(e) => setTripDays(parseInt(e.target.value, 10))}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value={3}>3–4 Days</option>
                  <option value={5}>5–6 Days</option>
                  <option value={7}>7–8 Days</option>
                </select>
              </div>

              <div>
                <label htmlFor="travel-style-reverse" className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">
                  Style
                </label>
                <select
                  id="travel-style-reverse"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="backpacker">Hostel</option>
                  <option value="comfort">Comfort</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reverse Matching Results */}
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <span>
                MATCHED DESTINATIONS FROM {selectedOrigin.toUpperCase()} ({reverseMatches.length})
              </span>
              <span>Includes Round-Trip Intercity + Local Stays</span>
            </div>

            {reverseMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reverseMatches.map((m) => (
                  <div
                    key={m.routeId}
                    className={`p-5 rounded-2xl visionos-glass border flex flex-col justify-between spatial-card-3d transition-all ${
                      m.fitsWithinBudget
                        ? "border-slate-200/80 dark:border-slate-800 hover:border-emerald-400/60"
                        : "border-amber-500/40 hover:border-amber-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {m.country === "IN" ? "🇮🇳 India" : m.country === "NP" ? "🇳🇵 Nepal" : "🇧🇹 Bhutan"} •{" "}
                          {m.bestTransitMode.toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold border ${
                            m.fitsWithinBudget
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {m.fitsWithinBudget
                            ? m.savingsInr > 0
                              ? `Saves ${formatPreferredCurrency(m.savingsInr, currencyPref)}`
                              : "Exact Fit"
                            : `+${formatPreferredCurrency(m.overBudgetByInr, currencyPref)} Stretch`}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
                        {m.destinationName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.tagline}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                        {m.whyFitsBudget}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Est. All-Inclusive ({m.durationDays} Days)
                        </span>
                        <span className="font-mono font-black text-base text-slate-900 dark:text-slate-100">
                          {formatPreferredCurrency(m.totalCostInr, currencyPref)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectRoute(m.routeId);
                          onChangeTransitMode(m.bestTransitMode);
                          setCalculatorMode("route");
                        }}
                        className="py-2 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 tactile-button-3d"
                      >
                        <span>Load Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl visionos-glass text-center text-xs text-slate-500">
                No routes match under {formatPreferredCurrency(pocketBudget, currencyPref)} with your current dietary & duration filters. Try relaxing to Hostel style or increasing your pocket cap slightly.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
