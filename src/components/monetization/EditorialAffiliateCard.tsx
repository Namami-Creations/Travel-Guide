"use client";

import { CurrencyCode, SubcontinentRoute } from "@/types/route";
import { ResolvedTransitPlan, TransitMode } from "@/types/transit";
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Building,
  Train,
  Bus,
  Plane,
} from "lucide-react";
import { formatPreferredCurrency } from "@/lib/engine/calculator";

interface EditorialAffiliateCardProps {
  route: SubcontinentRoute;
  transitPlan: ResolvedTransitPlan;
  activeTransitMode: TransitMode;
  currencyPref?: CurrencyCode;
}

export function EditorialAffiliateCard({
  route,
  transitPlan,
  activeTransitMode,
  currencyPref = "INR",
}: EditorialAffiliateCardProps) {
  const cardTip = route.creditCardRewardTip || {
    cardName: "Axis Atlas / HDFC Regalia Gold",
    potentialSavingsInr: 3500,
    tip: "Transfer card reward points to partner airlines/hotels for up to 40% discount on flight and boutique stays.",
  };

  const transitAction =
    activeTransitMode === "flight"
      ? {
          badge: "Leg 1 · Air Ticket",
          title: `Search ${transitPlan.flight.fromAirportCode} → ${transitPlan.flight.toAirportCode} Flights`,
          detail: `${transitPlan.flight.carriers} · Est. ${formatPreferredCurrency(transitPlan.flight.oneWayFareInr, currencyPref)} one-way.`,
          cta: "Check Live Fares (Google Flights)",
          href: `https://www.google.com/travel/flights?q=${encodeURIComponent(
            `Flights from ${transitPlan.flight.fromAirportCode} to ${transitPlan.flight.toAirportCode}`
          )}`,
          Icon: Plane,
        }
      : activeTransitMode === "bus"
      ? {
          badge: "Leg 1 · Volvo / Coach",
          title: `Book ${transitPlan.bus.operator}`,
          detail: `Board at ${transitPlan.bus.boardingPoint} → Drop at ${transitPlan.bus.droppingPoint}.`,
          cta: "Search Seats (redBus)",
          href: `https://www.redbus.in/`,
          Icon: Bus,
        }
      : {
          badge: "Leg 1 · IRCTC Rail",
          title: `Book ${transitPlan.train.fromStationCode} → ${transitPlan.train.toStationCode}`,
          detail: `${transitPlan.train.trainNumberName} · ARP opens 60 days prior at 8:00 AM IST.`,
          cta: "Open Official IRCTC Portal",
          href: "https://www.irctc.co.in/nget/train-search",
          Icon: Train,
        };

  const TransitIcon = transitAction.Icon;

  return (
    <section aria-label="Execute This Plan Action Rail" className="space-y-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 font-bold">
            Execute This Plan · Leg-by-Leg Action Rail
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-0.5">
            Direct Booking & Official Permit Rails
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 font-bold">
          Zero Agent Markup
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leg 1: Contextual Intercity Transit */}
        <div className="visionos-glass p-5 rounded-[1.75rem] border border-indigo-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                {transitAction.badge}
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <TransitIcon className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              {transitAction.title}
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {transitAction.detail}
            </p>
          </div>

          <a
            href={transitAction.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>{transitAction.cta}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {/* Leg 2: Official Permit Portal */}
        <div className="visionos-glass p-5 rounded-[1.75rem] border border-emerald-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                Leg 2 · Official Permit
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              {route.permitRule.name}
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {route.country === "BT"
                ? "Apply directly via Bhutan Department of Immigration for SDF ₹1,200/night clearance without tour markups."
                : route.permitRule.required
                ? "Secure official digital passes directly from government portals before mountain checkposts."
                : "No prior entry permit required for Indian nationals — review official tourism advisories."}
            </p>
          </div>

          <a
            href={route.permitRule.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {/* Leg 3: Verified Stays */}
        <div className="visionos-glass p-5 rounded-[1.75rem] border border-amber-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-amber-600 dark:text-amber-400">
                Leg 3 · Local Stays
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Building className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Homestays in {route.destination}
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Compare vetted mountain homestays, heritage cottages, and Zostels with free cancellation.
            </p>
          </div>

          <a
            href={`https://www.agoda.com/search?city=${encodeURIComponent(route.destination)}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Compare Stays</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {/* Leg 4: Credit Card Points Optimization */}
        <div className="visionos-glass p-5 rounded-[1.75rem] border border-blue-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-blue-600 dark:text-blue-400">
                Leg 4 · Reward Hack
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CreditCard className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Save {formatPreferredCurrency(cardTip.potentialSavingsInr, currencyPref)}
            </h3>
            <p className="text-[11px] text-blue-600 dark:text-blue-300 mt-1 font-bold">
              {cardTip.cardName}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {cardTip.tip}
            </p>
          </div>

          <a
            href="https://www.bankkaro.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Compare Cards</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
