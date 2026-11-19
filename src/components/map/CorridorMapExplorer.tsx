"use client";

import { useMemo, useState } from "react";
import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import {
  DESTINATION_GEO,
  ORIGIN_GEO,
} from "@/lib/engine/transit-resolver";
import { ResolvedTransitPlan, TransitMode } from "@/types/transit";
import { SubcontinentRoute } from "@/types/route";
import {
  Compass,
  MapPin,
  Mountain,
  ShieldCheck,
  Navigation,
  WifiOff,
  Coffee,
} from "lucide-react";

interface CorridorMapExplorerProps {
  selectedOriginId: string;
  activeRoute: SubcontinentRoute;
  transitPlan: ResolvedTransitPlan;
  activeTransitMode: TransitMode;
  onSelectRoute: (routeId: string) => void;
  onSelectOrigin: (originId: string) => void;
}

// Geographic bounding box covering India, Nepal & Bhutan
// lon: 68.0 -> 96.5 | lat: 7.5 -> 36.5
const MAP_WIDTH = 640;
const MAP_HEIGHT = 440;
const LON_MIN = 68.0;
const LON_MAX = 96.5;
const LAT_MIN = 7.5;
const LAT_MAX = 36.8;

function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (MAP_WIDTH - 64) + 32;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (MAP_HEIGHT - 56) + 28;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

type WaypointKind = "origin" | "checkpoint" | "pitstop" | "destination";

interface WaypointInspect {
  kind: WaypointKind;
  title: string;
  subtitle: string;
  altitudeText: string;
  note: string;
}

export function CorridorMapExplorer({
  selectedOriginId,
  activeRoute,
  transitPlan,
  activeTransitMode,
  onSelectRoute,
  onSelectOrigin,
}: CorridorMapExplorerProps) {
  const [selectedWaypoint, setSelectedWaypoint] = useState<WaypointKind>("destination");

  const originCity =
    ORIGIN_CITIES.find((c) => c.id === selectedOriginId) ?? ORIGIN_CITIES[0];
  const originGeo = ORIGIN_GEO[selectedOriginId] ?? ORIGIN_GEO.delhi;
  const destGeo = DESTINATION_GEO[activeRoute.id] ?? DESTINATION_GEO["bt-paro-thimphu"];

  const originPt = project(originGeo.lat, originGeo.lon);
  const destPt = project(destGeo.lat, destGeo.lon);

  // Curved arc midpoint slightly elevated northward to evoke Himalayan ascent
  const midX = (originPt.x + destPt.x) / 2;
  const midY = (originPt.y + destPt.y) / 2;
  const dx = destPt.x - originPt.x;
  const dy = destPt.y - originPt.y;
  const distPx = Math.hypot(dx, dy);
  const curveLift = Math.min(58, Math.max(18, distPx * 0.18));
  const ctrlX = Math.round((midX - (dy / Math.max(1, distPx)) * curveLift * 0.35) * 10) / 10;
  const ctrlY = Math.round((midY - curveLift * 0.65) * 10) / 10;

  // Quadratic Bezier point helper for intermediate pitstop & checkpoint pins
  const pointOnArc = (t: number) => {
    const inv = 1 - t;
    return {
      x: Math.round((inv * inv * originPt.x + 2 * inv * t * ctrlX + t * t * destPt.x) * 10) / 10,
      y: Math.round((inv * inv * originPt.y + 2 * inv * t * ctrlY + t * t * destPt.y) * 10) / 10,
    };
  };

  const pitstopPt = pointOnArc(0.45);
  const checkpointPt = pointOnArc(0.78);
  const primaryPitstop = transitPlan.car.pitstops[0];

  const waypointDetails = useMemo<Record<WaypointKind, WaypointInspect>>(() => {
    const modeSummary =
      activeTransitMode === "flight"
        ? `Flight ${transitPlan.flight.fromAirportCode} → ${transitPlan.flight.toAirportCode} (~${transitPlan.flight.flightDurationHours}h air + ${transitPlan.flight.transferDriveHours}h cab)`
        : activeTransitMode === "train"
        ? `Rail ${transitPlan.train.fromStationCode} → ${transitPlan.train.toStationCode} (~${transitPlan.train.durationHours}h)`
        : activeTransitMode === "bus"
        ? `${transitPlan.bus.operator} (~${transitPlan.bus.durationHours}h)`
        : activeTransitMode === "bike"
        ? `${transitPlan.bike.recommendedModel} out of ${transitPlan.bike.rentalBaseCity}`
        : `Highway Drive (~${transitPlan.car.distanceKm} km · ~${transitPlan.car.durationHours}h)`;

    return {
      origin: {
        kind: "origin",
        title: `${originCity.name} Departure Hub`,
        subtitle: `${originGeo.stationCode} · Airport ${originGeo.airportCode}`,
        altitudeText: `${originGeo.altitudeMeters}m Base Elevation`,
        note: `Primary Highway Gate: ${originGeo.highwayGate}. Active Mode: ${modeSummary}.`,
      },
      pitstop: {
        kind: "pitstop",
        title: primaryPitstop ? primaryPitstop.name : "Verified Highway Pure-Veg Halt",
        subtitle: primaryPitstop
          ? `${primaryPitstop.distanceKm} km along corridor · ${primaryPitstop.type}`
          : "Midway Refreshment & Fuel Point",
        altitudeText: `${Math.round((originGeo.altitudeMeters + (activeRoute.altitudeMeters ?? 1400)) * 0.35)}m Transition`,
        note: primaryPitstop
          ? primaryPitstop.tip
          : "Refuel before mountain climbs and verify offline maps before cellular reception drops.",
      },
      checkpoint: {
        kind: "checkpoint",
        title: destGeo.checkpointName || destGeo.gatewayStation,
        subtitle: `Gateway Transfer · ${destGeo.gatewayAirportCode} / ${destGeo.busDrop}`,
        altitudeText: `${Math.round((activeRoute.altitudeMeters ?? 1500) * 0.72)}m Foothill Gate`,
        note:
          activeRoute.country === "BT"
            ? "Carry physical Passport or Original Voter ID for Bhutan DoI permit verification and SDF check."
            : activeRoute.country === "NP"
            ? "Keep Indian ₹100 notes or NPR cash handy; avoid ₹500 notes at border crossings."
            : activeRoute.permitRule.required
            ? `Checkpost enforces ${activeRoute.permitRule.name}. Carry 2 printed ID photocopies.`
            : "No restricted permit needed; switch to local hill taxis if mountain cab union rules apply.",
      },
      destination: {
        kind: "destination",
        title: `${activeRoute.destination} (${activeRoute.region})`,
        subtitle: `${activeRoute.durationDays}D Corridor · ~${transitPlan.distanceKm} km one-way`,
        altitudeText: `${activeRoute.altitudeMeters ?? 1400}m Peak Elevation${activeRoute.amsRisk ? " · AMS Pacing Zone" : ""}`,
        note: activeRoute.permitRule.notes,
      },
    };
  }, [originCity, originGeo, destGeo, activeRoute, transitPlan, activeTransitMode, primaryPitstop]);

  const activeInspect = waypointDetails[selectedWaypoint];

  return (
    <section
      aria-label="Interactive Offline Subcontinent Corridor Map"
      className="visionos-glass-elevated p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-cyan-700 dark:text-cyan-400 font-bold">
              Offline Topographic Corridor Explorer
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-1">
            {originCity.name} → {activeRoute.destination}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Click any destination pin on the Subcontinent map to switch corridors, or inspect route checkpoints below.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 whitespace-nowrap">
            <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Zero-Network Vector Map</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Interactive SVG Topographic Vector Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950/[0.03] dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 p-3 sm:p-4 relative overflow-hidden">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-auto max-h-[380px] select-none"
            role="img"
            aria-label={`Interactive map showing route from ${originCity.name} to ${activeRoute.destination}`}
          >
            <defs>
              <linearGradient id="corridorArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <radialGradient id="himalayaGlow" cx="65%" cy="22%" r="48%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Subtle lat/lon graticule grid */}
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#himalayaGlow)" rx="14" />
            {[100, 200, 300, 400, 500].map((gx) => (
              <line
                key={`gx-${gx}`}
                x1={gx}
                y1={16}
                x2={gx}
                y2={MAP_HEIGHT - 16}
                stroke="currentColor"
                className="text-slate-300/40 dark:text-slate-800/70"
                strokeWidth="0.75"
                strokeDasharray="3 5"
              />
            ))}
            {[80, 160, 240, 320, 390].map((gy) => (
              <line
                key={`gy-${gy}`}
                x1={16}
                y1={gy}
                x2={MAP_WIDTH - 16}
                y2={gy}
                stroke="currentColor"
                className="text-slate-300/40 dark:text-slate-800/70"
                strokeWidth="0.75"
                strokeDasharray="3 5"
              />
            ))}

            {/* Simplified Geographically Projected India Landmass */}
            <path
              d="M 150 38 L 198 44 L 238 82 L 266 116 L 315 148 L 418 164 L 468 158 L 516 144 L 560 128 L 598 154 L 584 202 L 542 224 L 520 198 L 478 214 L 444 248 L 384 286 L 326 346 L 262 414 L 228 408 L 194 342 L 154 274 L 114 236 L 64 218 L 76 178 L 122 146 L 138 96 Z"
              className="fill-slate-200/70 dark:fill-slate-800/65 stroke-slate-400/70 dark:stroke-slate-600/80"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* Nepal Footprint */}
            <path
              d="M 294 128 L 352 144 L 424 156 L 440 172 L 384 166 L 314 148 Z"
              className="fill-cyan-500/15 dark:fill-cyan-500/20 stroke-cyan-500/60"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Bhutan Footprint */}
            <path
              d="M 464 152 L 516 150 L 524 168 L 468 170 Z"
              className="fill-amber-500/20 dark:fill-amber-500/25 stroke-amber-500/70"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Himalayan Ridge Topographic Arc */}
            <path
              d="M 164 56 Q 290 124, 412 146 T 572 138"
              fill="none"
              stroke="currentColor"
              className="text-cyan-600/35 dark:text-cyan-400/35"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Country Labels */}
            <text x="236" y="255" className="fill-slate-500/60 dark:fill-slate-400/45 text-[11px] font-mono font-bold tracking-[0.25em]">
              INDIA
            </text>
            <text x="352" y="138" className="fill-cyan-700/80 dark:fill-cyan-300/80 text-[9px] font-mono font-bold tracking-widest">
              NEPAL
            </text>
            <text x="470" y="144" className="fill-amber-700/90 dark:fill-amber-300/90 text-[9px] font-mono font-bold tracking-widest">
              BHUTAN
            </text>

            {/* Active Corridor Curved Path */}
            <path
              d={`M ${originPt.x} ${originPt.y} Q ${ctrlX} ${ctrlY} ${destPt.x} ${destPt.y}`}
              fill="none"
              stroke="url(#corridorArcGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={activeTransitMode === "flight" ? "7 5" : undefined}
            />

            {/* Secondary Origin Cities (clickable to switch origin) */}
            {ORIGIN_CITIES.map((city) => {
              const geo = ORIGIN_GEO[city.id];
              if (!geo) return null;
              const pt = project(geo.lat, geo.lon);
              const isSelected = city.id === selectedOriginId;
              return (
                <g
                  key={city.id}
                  onClick={() => {
                    onSelectOrigin(city.id);
                    setSelectedWaypoint("origin");
                  }}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Set origin city to ${city.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectOrigin(city.id);
                      setSelectedWaypoint("origin");
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="11"
                      className="fill-blue-500/20 stroke-blue-500/70"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "5.5" : "3.5"}
                    className={
                      isSelected
                        ? "fill-blue-600 stroke-white"
                        : "fill-slate-400 dark:fill-slate-500 hover:fill-blue-500"
                    }
                    strokeWidth={isSelected ? "2" : "0"}
                  />
                  {isSelected && (
                    <text
                      x={pt.x}
                      y={pt.y + 18}
                      textAnchor="middle"
                      className="fill-blue-700 dark:fill-blue-300 text-[10px] font-mono font-extrabold"
                    >
                      {city.name.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Intermediate Pitstop Waypoint */}
            <g
              onClick={() => setSelectedWaypoint("pitstop")}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Inspect highway pitstop waypoint"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedWaypoint("pitstop");
                }
              }}
            >
              <circle
                cx={pitstopPt.x}
                cy={pitstopPt.y}
                r={selectedWaypoint === "pitstop" ? "7" : "5"}
                className="fill-amber-500 stroke-white dark:stroke-slate-950"
                strokeWidth="1.8"
              />
            </g>

            {/* Border / Gateway Checkpoint Waypoint */}
            <g
              onClick={() => setSelectedWaypoint("checkpoint")}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Inspect border or gateway checkpoint"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedWaypoint("checkpoint");
                }
              }}
            >
              <circle
                cx={checkpointPt.x}
                cy={checkpointPt.y}
                r={selectedWaypoint === "checkpoint" ? "7" : "5"}
                className="fill-cyan-500 stroke-white dark:stroke-slate-950"
                strokeWidth="1.8"
              />
            </g>

            {/* All 9 Destination Corridors (clickable to switch route) */}
            {SUBCONTINENT_ROUTES.map((route) => {
              const geo = DESTINATION_GEO[route.id];
              if (!geo) return null;
              const pt = project(geo.lat, geo.lon);
              const isSelected = route.id === activeRoute.id;
              return (
                <g
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route.id);
                    setSelectedWaypoint("destination");
                  }}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select destination corridor ${route.destination}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRoute(route.id);
                      setSelectedWaypoint("destination");
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      className="fill-emerald-500/20 stroke-emerald-500"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "6" : "4.2"}
                    className={
                      isSelected
                        ? "fill-emerald-500 stroke-white"
                        : "fill-emerald-600/60 dark:fill-emerald-400/60 hover:fill-emerald-500 stroke-white/80 dark:stroke-slate-900"
                    }
                    strokeWidth="1.5"
                  />
                  {isSelected && (
                    <text
                      x={pt.x > 460 ? pt.x - 10 : pt.x + 10}
                      y={pt.y - 10}
                      textAnchor={pt.x > 460 ? "end" : "start"}
                      className="fill-emerald-700 dark:fill-emerald-300 text-[10px] font-mono font-extrabold"
                    >
                      {route.destination.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Compact Map Legend */}
          <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" aria-hidden="true" />
                Origin Hub
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" aria-hidden="true" />
                Pure Veg Pitstop
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" aria-hidden="true" />
                Border / Gateway
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
                9 Corridors
              </span>
            </div>
            <span className="tabular-nums font-bold text-slate-700 dark:text-slate-300">
              {transitPlan.distanceKm} km · {activeTransitMode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Interactive Waypoint Telemetry & Corridor Switcher Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* 4-Step Corridor Waypoint Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
              Inspect Corridor Waypoints
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "origin", label: "1. Origin Hub", icon: Navigation },
                  { id: "pitstop", label: "2. Highway Halt", icon: Coffee },
                  { id: "checkpoint", label: "3. Border Gate", icon: ShieldCheck },
                  { id: "destination", label: "4. Sanctuary", icon: MapPin },
                ] as const
              ).map((wp) => {
                const Icon = wp.icon;
                const active = selectedWaypoint === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => setSelectedWaypoint(wp.id)}
                    aria-pressed={active}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      active
                        ? "bg-slate-950 text-white border-slate-950 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-400 shadow-sm"
                        : "bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{wp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Waypoint Inspector */}
          <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase font-extrabold text-cyan-700 dark:text-cyan-400">
                  Waypoint Telemetry
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-cyan-500" aria-hidden="true" />
                  {activeInspect.altitudeText}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-slate-50 leading-snug">
                {activeInspect.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {activeInspect.subtitle}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                {activeInspect.note}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Airport Gateway:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {originGeo.airportCode} → {destGeo.gatewayAirportCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
