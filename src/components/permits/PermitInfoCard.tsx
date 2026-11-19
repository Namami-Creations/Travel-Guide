"use client";

import React from "react";
import { PermitRule, CountryCode, CurrencyCode } from "@/types/route";
import { formatPreferredCurrency } from "@/lib/engine/calculator";
import { ShieldCheck, ExternalLink, FileText, AlertCircle } from "lucide-react";

interface PermitInfoCardProps {
  permit: PermitRule;
  country: CountryCode;
  durationDays: number;
  travelersCount: number;
  childCount?: number;
  currencyPref?: CurrencyCode;
}

export function PermitInfoCard({
  permit,
  country,
  durationDays,
  travelersCount,
  childCount = 0,
  currencyPref = "INR",
}: PermitInfoCardProps) {
  const isBhutan = country === "BT";
  const isNepal = country === "NP";
  const nights = Math.max(1, durationDays - 1);
  const safeAdults = Math.max(1, travelersCount);
  const safeChildren = Math.max(0, childCount);

  const totalSdfInr = isBhutan
    ? safeAdults * permit.costInrPerPerson * nights +
      safeChildren * (permit.costInrPerPerson / 2) * nights
    : permit.costInrPerPerson * (safeAdults + safeChildren);

  return (
    <div className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-amber-500/30 transition-all duration-300 spatial-card-3d">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 shadow-xs">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold">
              Regulatory & Border Checklist
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
              {permit.name}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 font-mono font-semibold">Total Permit / SDF:</span>
          <p className="text-base sm:text-lg font-black font-mono text-slate-950 dark:text-slate-50">
            {permit.costInrPerPerson === 0
              ? `${formatPreferredCurrency(0, currencyPref)} (Free / No Fee)`
              : formatPreferredCurrency(totalSdfInr, currencyPref)}
          </p>
          {isBhutan && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
              ₹1,200 × {nights} nights × {safeAdults} adult{safeAdults > 1 ? "s" : ""}
              {safeChildren > 0 ? ` + ${safeChildren} child (50% off)` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300">
        <p className="leading-relaxed">{permit.notes}</p>
        {isNepal && (
          <p className="text-amber-800 dark:text-amber-300 font-bold mt-1.5">
            ⚠️ Nepal Immigration Alert: Carry physical Election Voter ID or Indian Passport. Aadhaar is strictly invalid for air entry at Kathmandu.
          </p>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          Mandatory Travel Documents for Indian Passport / Voter ID Holders:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {permit.documentsRequired.map((doc) => (
            <div
              key={doc}
              className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
            >
              <span className="text-emerald-500 font-black shrink-0" aria-hidden="true">✓</span>
              <span className="font-medium">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Avoid middleman agents and commission markups.
        </span>
        <a
          href={permit.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
