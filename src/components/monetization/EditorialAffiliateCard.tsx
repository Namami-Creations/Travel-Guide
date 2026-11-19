"use client";

import React from "react";
import { CurrencyCode, SubcontinentRoute } from "@/types/route";
import { CreditCard, ExternalLink, ShieldCheck, Building } from "lucide-react";
import { formatPreferredCurrency } from "@/lib/engine/calculator";

interface EditorialAffiliateCardProps {
  route: SubcontinentRoute;
  currencyPref?: CurrencyCode;
}

export function EditorialAffiliateCard({
  route,
  currencyPref = "INR",
}: EditorialAffiliateCardProps) {
  const cardTip = route.creditCardRewardTip || {
    cardName: "Axis Atlas / HDFC Regalia Gold",
    potentialSavingsInr: 3500,
    tip: "Transfer card reward points to partner airlines/hotels for up to 40% discount on flight and boutique stays.",
  };

  return (
    <section aria-label="Editorial Partner Recommendations" className="space-y-4 print:hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 font-bold">
            Curated Value Rails
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-0.5">
            Verified Partner Rails & Points Reductions
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          Zero Spam Guarantee
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="visionos-glass p-5 rounded-[1.75rem] border border-blue-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-blue-600 dark:text-blue-400">
                Reward Hack
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CreditCard className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Save {formatPreferredCurrency(cardTip.potentialSavingsInr, currencyPref)} on this Trip
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 font-bold">
              Recommended: {cardTip.cardName}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {cardTip.tip}
            </p>
          </div>

          <a
            href="https://www.bankkaro.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Compare Reward Cards</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="visionos-glass p-5 rounded-[1.75rem] border border-amber-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-amber-600 dark:text-amber-400">
                Stay Engine
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Building className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Certified Stays in {route.destination}
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Book verified boutique heritage stays, mountain cottages, and Zostels with transparent cancellation terms.
            </p>
          </div>

          <a
            href={`https://www.agoda.com/search?city=${encodeURIComponent(route.destination)}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Check Live Stays (Agoda)</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="visionos-glass p-5 rounded-[1.75rem] border border-emerald-500/30 flex flex-col justify-between spatial-card-3d">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                Safety & Passes
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Mandatory Protection & Passes
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {route.country === "BT"
                ? "Bhutan requires certified travel insurance for Indian visitors upon entry."
                : "Skip lines for adventure permits, river rafting passes, and mountain transit with instant confirmation."}
            </p>
          </div>

          <a
            href="https://www.klook.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
          >
            <span>Explore Passes (Klook)</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
