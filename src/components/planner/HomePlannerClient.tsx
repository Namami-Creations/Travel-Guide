"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CountryCode, TravelMonth, TravelStyle } from "@/types/route";
import { TransitMode } from "@/types/transit";
import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { BudgetMatrix } from "@/components/calculator/BudgetMatrix";
import { SourceDestinationCalculator } from "@/components/calculator/SourceDestinationCalculator";
import { CorridorMapExplorer } from "@/components/map/CorridorMapExplorer";
import { EditorialStoriesSection } from "@/components/editorial/EditorialStoriesSection";
import { ItineraryTimeline } from "@/components/itinerary/ItineraryTimeline";
import { PermitInfoCard } from "@/components/permits/PermitInfoCard";
import { DetouristCard } from "@/components/modes/DetouristCard";
import { SukoonModePanel } from "@/components/modes/SukoonModePanel";
import { FairShareModal } from "@/components/modes/FairShareModal";
import { NinePmClubModal } from "@/components/modes/NinePmClubModal";
import { EditorialAffiliateCard } from "@/components/monetization/EditorialAffiliateCard";
import {
  calculateItemizedBudget,
  formatPreferredCurrency,
} from "@/lib/engine/calculator";
import {
  getRoundTripIntercityPerPersonInr,
  resolveMultiModalTransit,
} from "@/lib/engine/transit-resolver";
import {
  buildShareableTripUrl,
  parseTripQueryParams,
} from "@/lib/engine/trip-utils";
import {
  Users,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  BookOpen,
  Calculator,
  Bookmark,
  Leaf,
  ArrowUpRight,
} from "lucide-react";

const VALID_ROUTE_IDS = new Set(SUBCONTINENT_ROUTES.map((r) => r.id));
const VALID_ORIGIN_IDS = new Set(ORIGIN_CITIES.map((c) => c.id));

export function HomePlannerClient() {
  const searchParams = useSearchParams();
  const {
    profile,
    settings,
    savedRouteIds,
    toggleSavedRoute,
    updateProfile,
  } = useDesiRoute();

  // Hydrate full stateful shared trip parameters cleanly on initial render
  const parsedQuery = useMemo(
    () => parseTripQueryParams(searchParams, VALID_ROUTE_IDS, VALID_ORIGIN_IDS),
    [searchParams]
  );

  const [selectedCountry, setSelectedCountry] = useState<CountryCode | "ALL">("ALL");
  const [originOverride, setOriginOverride] = useState<string | null>(null);
  const [routeOverride, setRouteOverride] = useState<string | null>(null);
  const [modeOverride, setModeOverride] = useState<TransitMode | null>(null);
  const [monthOverride, setMonthOverride] = useState<TravelMonth | null>(null);
  const [styleOverride, setStyleOverride] = useState<TravelStyle | null>(null);
  const [adultsOverride, setAdultsOverride] = useState<number | null>(null);
  const [childrenOverride, setChildrenOverride] = useState<number | null>(null);
  const [budgetMultiplier, setBudgetMultiplier] = useState<number>(1.0);
  const [appliedDetourIds, setAppliedDetourIds] = useState<Record<string, boolean>>({});
  const [tabOverride, setTabOverride] = useState<"planner" | "magazine" | null>(null);

  // Dynamic Mode States
  const [isFairShareOpen, setIsFairShareOpen] = useState<boolean>(false);
  const [isNinePmOpen, setIsNinePmOpen] = useState<boolean>(false);
  const [isSukoonActive, setIsSukoonActive] = useState<boolean>(false);

  const selectedOrigin = originOverride ?? parsedQuery.originId ?? profile.homeCityId ?? "delhi";
  const selectedRouteId = routeOverride ?? parsedQuery.routeId ?? "bt-paro-thimphu";
  const activeTransitMode = modeOverride ?? parsedQuery.mode ?? "train";
  const selectedMonth = monthOverride ?? parsedQuery.month ?? "May";
  const travelStyle = styleOverride ?? parsedQuery.style ?? "comfort";
  const travelersCount = adultsOverride ?? parsedQuery.adults ?? 2;
  const childCount = childrenOverride ?? parsedQuery.children ?? 0;
  const activeTab = tabOverride ?? parsedQuery.tab ?? "planner";

  const pureVegFilter = profile.dietaryType === "pure-veg" || profile.dietaryType === "jain";
  const jainFilter = profile.dietaryType === "jain";

  const originCity =
    ORIGIN_CITIES.find((c) => c.id === selectedOrigin) ?? ORIGIN_CITIES[0];

  // Filter routes by country
  const filteredRoutes = useMemo(
    () =>
      SUBCONTINENT_ROUTES.filter(
        (r) => selectedCountry === "ALL" || r.country === selectedCountry
      ),
    [selectedCountry]
  );

  // Currently active route
  const activeRoute = useMemo(
    () =>
      SUBCONTINENT_ROUTES.find((r) => r.id === selectedRouteId) ||
      filteredRoutes[0] ||
      SUBCONTINENT_ROUTES[0],
    [selectedRouteId, filteredRoutes]
  );

  const isDetourApplied =
    appliedDetourIds[activeRoute.id] !== undefined
      ? appliedDetourIds[activeRoute.id]
      : Boolean(parsedQuery.detourApplied && activeRoute.id === (parsedQuery.routeId ?? "bt-paro-thimphu"));

  // Unified Origin -> Destination Transit Resolution & Cost Injection
  const activeTransitPlan = useMemo(
    () => resolveMultiModalTransit(selectedOrigin, activeRoute.id),
    [selectedOrigin, activeRoute.id]
  );

  const intercityTransitPerPersonInr = useMemo(
    () =>
      getRoundTripIntercityPerPersonInr(
        activeTransitPlan,
        activeTransitMode,
        travelStyle,
        travelersCount,
        activeRoute.durationDays
      ),
    [activeTransitPlan, activeTransitMode, travelStyle, travelersCount, activeRoute.durationDays]
  );

  const currentBreakdown = useMemo(
    () =>
      calculateItemizedBudget(
        activeRoute,
        travelStyle,
        travelersCount,
        childCount,
        budgetMultiplier,
        {
          intercityTransitPerPersonInr,
          detourApplied: isDetourApplied,
        }
      ),
    [
      activeRoute,
      travelStyle,
      travelersCount,
      childCount,
      budgetMultiplier,
      intercityTransitPerPersonInr,
      isDetourApplied,
    ]
  );

  const perPersonCost =
    travelersCount > 0 ? Math.round(currentBreakdown.total / travelersCount) : currentBreakdown.total;

  // Stateful canonical shareable URL (works in WhatsApp, clipboard, and direct visits)
  const shareableUrl = useMemo(() => {
    const base =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://desiroute.in";
    return buildShareableTripUrl(
      {
        routeId: activeRoute.id,
        originId: selectedOrigin,
        mode: activeTransitMode,
        month: selectedMonth,
        style: travelStyle,
        adults: travelersCount,
        children: childCount,
        detourApplied: isDetourApplied,
      },
      base
    );
  }, [
    activeRoute.id,
    selectedOrigin,
    activeTransitMode,
    selectedMonth,
    travelStyle,
    travelersCount,
    childCount,
    isDetourApplied,
  ]);

  const handleTogglePureVegHeader = () => {
    const nextPureVeg = !pureVegFilter;
    if (!nextPureVeg) {
      updateProfile({ dietaryType: "all" });
    } else {
      updateProfile({ dietaryType: jainFilter ? "jain" : "pure-veg" });
    }
  };

  const handleToggleJain = () => {
    const nextJain = !jainFilter;
    if (nextJain) {
      updateProfile({ dietaryType: "jain" });
    } else {
      updateProfile({ dietaryType: pureVegFilter ? "pure-veg" : "all" });
    }
  };

  const handleToggleDetour = (routeId: string) => {
    setAppliedDetourIds((prev) => {
      const current =
        prev[routeId] !== undefined
          ? prev[routeId]
          : Boolean(parsedQuery.detourApplied && routeId === (parsedQuery.routeId ?? "bt-paro-thimphu"));
      return {
        ...prev,
        [routeId]: !current,
      };
    });
  };

  const handleRouteSelectFromArticle = (routeId: string) => {
    setRouteOverride(routeId);
    setSelectedCountry("ALL");
    setTabOverride("planner");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/20 flex flex-col">
      {/* 1. Floating VisionOS Header */}
      <Header
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          const firstInCountry = SUBCONTINENT_ROUTES.find((r) => c === "ALL" || r.country === c);
          if (firstInCountry) {
            setRouteOverride(firstInCountry.id);
          }
        }}
        pureVegFilter={pureVegFilter}
        onTogglePureVeg={handleTogglePureVegHeader}
      />

      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 flex-1"
      >
        {/* 2. Hero Section */}
        <section
          aria-label="Overview & Subcontinent Corridors"
          className="text-center sm:text-left space-y-4 pt-4 sm:pt-6 print:hidden"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Zero Visa Chaos • Pure Veg & Jain Verified • 5-Mode Rupee Transit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1]">
            Himalayan Solitude, <br className="hidden sm:inline" />
            Calculated Down to the Rupee.
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mx-auto sm:mx-0">
            The intelligent travel operating system for <strong>India, Nepal, and Bhutan</strong>. Compare Train, Volvo Bus, Flight + Cab, Car, and Bike costs, check border readiness, and split group expenses via UPI.
          </p>

          {/* Master View Switcher Pill + Jain Filter */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => setTabOverride("planner")}
                aria-pressed={activeTab === "planner"}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all tactile-button-3d whitespace-nowrap ${
                  activeTab === "planner"
                    ? "bg-white text-slate-950 dark:bg-slate-900 dark:text-cyan-400 shadow-md shadow-slate-300/40 dark:shadow-black/50"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                }`}
              >
                <Calculator className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                <span>Multi-Modal Budget OS</span>
              </button>
              <button
                type="button"
                onClick={() => setTabOverride("magazine")}
                aria-pressed={activeTab === "magazine"}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all tactile-button-3d whitespace-nowrap ${
                  activeTab === "magazine"
                    ? "bg-white text-slate-950 dark:bg-slate-900 dark:text-purple-400 shadow-md shadow-slate-300/40 dark:shadow-black/50"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-500" aria-hidden="true" />
                <span>Detourist Magazine</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleJain}
              aria-pressed={jainFilter}
              className={`py-2.5 px-3.5 rounded-2xl text-xs font-extrabold border flex items-center gap-1.5 transition-all tactile-button-3d whitespace-nowrap ${
                jainFilter
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 shadow-xs"
                  : "visionos-glass text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-400"
              }`}
              title="Strict Jain dietary filter (No onion/garlic routes only)"
            >
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Jain Kitchen {jainFilter ? "ON" : "Filter"}</span>
            </button>
          </div>
        </section>

        {/* VIEW 1: MULTI-MODAL BUDGET OS & INTERACTIVE PLANNER */}
        {activeTab === "planner" && (
          <div className="space-y-8 sm:space-y-12">
            {/* Source to Destination Multi-Modal Calculator & Reverse Budget */}
            <SourceDestinationCalculator
              selectedOrigin={selectedOrigin}
              onChangeOrigin={setOriginOverride}
              selectedDestination={activeRoute.id}
              onSelectRoute={(routeId) => {
                setRouteOverride(routeId);
                setSelectedCountry("ALL");
              }}
              activeTransitMode={activeTransitMode}
              onChangeTransitMode={setModeOverride}
              selectedMonth={selectedMonth}
              onChangeMonth={setMonthOverride}
              pureVegFilter={pureVegFilter}
              jainFilter={jainFilter}
              currencyPref={settings.currencyPref}
            />

            {/* Interactive Offline Subcontinent Corridor Map */}
            {activeTransitPlan && (
              <CorridorMapExplorer
                selectedOriginId={selectedOrigin}
                activeRoute={activeRoute}
                transitPlan={activeTransitPlan}
                activeTransitMode={activeTransitMode}
                onSelectRoute={(routeId) => {
                  setRouteOverride(routeId);
                  setSelectedCountry("ALL");
                }}
                onSelectOrigin={setOriginOverride}
              />
            )}

            {/* Corridor Selection Grid */}
            <section aria-label="Featured Travel Routes" className="space-y-3 print:hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
                <span>SELECT DESTINATION CORRIDOR ({filteredRoutes.length})</span>
                <span>BOOKMARK OR OPEN FULL GUIDE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredRoutes.map((route) => {
                  const isSelected = activeRoute.id === route.id;
                  const isSaved = savedRouteIds.includes(route.id);
                  const countryFlag =
                    route.country === "IN" ? "🇮🇳" : route.country === "NP" ? "🇳🇵" : "🇧🇹";

                  return (
                    <div
                      key={route.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full spatial-card-3d ${
                        isSelected
                          ? "visionos-glass-elevated border-cyan-500/80 text-slate-950 dark:text-slate-50 ring-2 ring-cyan-500/30"
                          : "visionos-glass border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs mb-2">
                        <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1.5 font-bold truncate">
                          <span aria-hidden="true">{countryFlag}</span>
                          <span className="truncate">{route.region}</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-extrabold border border-slate-200 dark:border-slate-700">
                            {route.durationDays}D
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSavedRoute(route.id)}
                            aria-pressed={isSaved}
                            aria-label={isSaved ? `Remove ${route.title} bookmark` : `Bookmark ${route.title}`}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved
                                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-400"
                                : "bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-cyan-600"
                            }`}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setRouteOverride(route.id)}
                        aria-pressed={isSelected}
                        className="text-left flex-1 flex flex-col justify-between focus:outline-none"
                      >
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-950 dark:text-slate-50 leading-snug">
                            {route.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {route.tagline}
                          </p>
                        </div>
                      </button>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono w-full">
                        <Link
                          href={`/routes/${route.slug}`}
                          className="text-cyan-700 dark:text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-0.5"
                        >
                          <span>Full Guide</span>
                          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                        <span className="font-black tabular-nums text-slate-900 dark:text-slate-100 text-sm">
                          {formatPreferredCurrency(route.baseCostInr.comfort, settings.currencyPref)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* The 4 Dynamic Intelligence Mode Launcher Dock */}
            <section aria-label="Dynamic Travel Modes" className="space-y-3 print:hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
                <span>CONTEXTUAL INTELLIGENCE DOCK</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">4 ACTIVE MODES</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Mode 1: FairShare */}
                <button
                  type="button"
                  onClick={() => setIsFairShareOpen(true)}
                  className="p-4 rounded-2xl visionos-glass border border-blue-500/30 text-left hover:border-blue-400 transition-all shadow-xs group spatial-card-3d tactile-button-3d"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                      <Users className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      LAUNCH →
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-50">
                    FairShare Mode
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Expense Ledger & UPI Split
                  </p>
                </button>

                {/* Mode 2: The 9 PM Club */}
                <button
                  type="button"
                  onClick={() => setIsNinePmOpen(true)}
                  className="p-4 rounded-2xl visionos-glass border border-purple-500/30 text-left hover:border-purple-400 transition-all shadow-xs group spatial-card-3d tactile-button-3d"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/20">
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono font-black text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                      LAUNCH →
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-50">
                    The 9 PM Club
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Audio Lore & Dinner Pods
                  </p>
                </button>

                {/* Mode 3: Sukoon Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setIsSukoonActive(!isSukoonActive)}
                  aria-pressed={isSukoonActive}
                  className={`p-4 rounded-2xl border text-left transition-all shadow-xs group spatial-card-3d tactile-button-3d ${
                    isSukoonActive
                      ? "visionos-glass-elevated border-teal-500 text-teal-950 dark:text-teal-50 ring-2 ring-teal-500/30"
                      : "visionos-glass border-teal-500/30 hover:border-teal-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/20">
                      <VolumeX className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono font-black text-teal-600 dark:text-teal-400">
                      {isSukoonActive ? "ACTIVE ✓" : "TOGGLE"}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-50">
                    Sukoon Mode
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Low-Stimulus & AMS Guide
                  </p>
                </button>

                {/* Mode 4: Bheed Se Door */}
                <a
                  href="#bheed-se-door-section"
                  className="p-4 rounded-2xl visionos-glass border border-emerald-500/30 text-left hover:border-emerald-400 transition-all shadow-xs group spatial-card-3d tactile-button-3d"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                      <Compass className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      VIEW ↓
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-50">
                    Bheed Se Door
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Anti-Overtourism Counterpart
                  </p>
                </a>
              </div>
            </section>

            {/* Interactive Rupee Budget Calculator */}
            <BudgetMatrix
              route={activeRoute}
              originName={originCity.name}
              style={travelStyle}
              onChangeStyle={setStyleOverride}
              travelersCount={travelersCount}
              onChangeTravelers={setAdultsOverride}
              childCount={childCount}
              onChangeChildren={setChildrenOverride}
              budgetMultiplier={budgetMultiplier}
              onChangeMultiplier={setBudgetMultiplier}
              intercityTransitPerPersonInr={intercityTransitPerPersonInr}
              activeTransitMode={activeTransitMode}
              detourApplied={isDetourApplied}
              pureVegFilter={pureVegFilter}
              selectedMonth={selectedMonth}
              shareableUrl={shareableUrl}
              currencyPref={settings.currencyPref}
            />

            {/* Anti-Overtourism Counterpart Swap */}
            <div id="bheed-se-door-section">
              <DetouristCard
                detour={activeRoute.detour}
                isApplied={isDetourApplied}
                onToggleApply={() => handleToggleDetour(activeRoute.id)}
              />
            </div>

            {/* Sukoon Mode Transit & AMS Panel */}
            <SukoonModePanel
              route={activeRoute}
              isSukoonActive={isSukoonActive}
              onToggleSukoon={() => setIsSukoonActive(!isSukoonActive)}
            />

            {/* Interactive Border Readiness & Permit Rules Engine */}
            <PermitInfoCard
              permit={activeRoute.permitRule}
              route={activeRoute}
              country={activeRoute.country}
              durationDays={activeRoute.durationDays}
              travelersCount={travelersCount}
              childCount={childCount}
              currencyPref={settings.currencyPref}
            />

            {/* Day-by-Day Experience Itinerary */}
            <ItineraryTimeline
              itinerary={activeRoute.itinerary}
              pureVegFilter={pureVegFilter}
              dietaryPreference={jainFilter ? "jain" : pureVegFilter ? "pure-veg" : "all"}
              isSukoonActive={isSukoonActive}
              appliedDetour={isDetourApplied ? activeRoute.detour : null}
              currencyPref={settings.currencyPref}
            />

            {/* Leg-by-Leg Execute This Plan Action Rail */}
            {activeTransitPlan && (
              <EditorialAffiliateCard
                route={activeRoute}
                transitPlan={activeTransitPlan}
                activeTransitMode={activeTransitMode}
                currencyPref={settings.currencyPref}
              />
            )}
          </div>
        )}

        {/* VIEW 2: DETOURIST EDITORIAL MAGAZINE */}
        {activeTab === "magazine" && (
          <EditorialStoriesSection onSelectRouteFromArticle={handleRouteSelectFromArticle} />
        )}
      </main>

      {/* Accessible Modals */}
      <FairShareModal
        isOpen={isFairShareOpen}
        onClose={() => setIsFairShareOpen(false)}
        route={activeRoute}
        originName={originCity.name}
        activeTransitMode={activeTransitMode}
        selectedMonth={selectedMonth}
        travelStyle={travelStyle}
        perPersonBudgetInr={perPersonCost}
        travelersCount={travelersCount}
        childCount={childCount}
        breakdown={currentBreakdown}
        detourApplied={isDetourApplied}
        pureVegFilter={pureVegFilter}
        shareableUrl={shareableUrl}
        currencyPref={settings.currencyPref}
      />

      <NinePmClubModal
        isOpen={isNinePmOpen}
        onClose={() => setIsNinePmOpen(false)}
        route={activeRoute}
      />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
