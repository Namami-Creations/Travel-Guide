"use client";

import { useState } from "react";
import { PermitRule, CountryCode, CurrencyCode, SubcontinentRoute } from "@/types/route";
import { formatPreferredCurrency } from "@/lib/engine/calculator";
import {
  BorderEntryMode,
  IndianIdDocument,
  evaluateBorderReadiness,
} from "@/lib/engine/trip-utils";
import {
  ShieldCheck,
  ExternalLink,
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  Car,
} from "lucide-react";

interface PermitInfoCardProps {
  permit: PermitRule;
  route: SubcontinentRoute;
  country: CountryCode;
  durationDays: number;
  travelersCount: number;
  childCount?: number;
  currencyPref?: CurrencyCode;
}

export function PermitInfoCard({
  permit,
  route,
  country,
  durationDays,
  travelersCount,
  childCount = 0,
  currencyPref = "INR",
}: PermitInfoCardProps) {
  const [idDocument, setIdDocument] = useState<IndianIdDocument>("passport");
  const [entryMode, setEntryMode] = useState<BorderEntryMode>("overland");
  const [bringingOwnVehicle, setBringingOwnVehicle] = useState<boolean>(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const isBhutan = country === "BT";
  const nights = Math.max(1, durationDays - 1);
  const safeAdults = Math.max(1, travelersCount);
  const safeChildren = Math.max(0, childCount);

  const totalSdfInr = isBhutan
    ? safeAdults * permit.costInrPerPerson * nights +
      safeChildren * (permit.costInrPerPerson / 2) * nights
    : permit.costInrPerPerson * (safeAdults + safeChildren);

  const readiness = evaluateBorderReadiness({
    country,
    route,
    idDocument,
    entryMode,
    bringingOwnVehicle,
    durationDays,
  });

  const checkedCount = readiness.checklist.filter((doc) => checkedDocs[`${route.id}:${doc}`]).length;

  const toggleDoc = (doc: string) => {
    const key = `${route.id}:${doc}`;
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section
      aria-label="Border Readiness and Permit Engine"
      className="visionos-glass p-6 sm:p-7 rounded-[2rem] border border-amber-500/30 transition-all duration-300 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold">
              Interactive Border & Permit Readiness Engine
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
              {permit.name}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 font-mono font-semibold">Total Permit / SDF:</span>
          <p className="text-base sm:text-lg font-black font-mono tabular-nums text-slate-950 dark:text-slate-50">
            {permit.costInrPerPerson === 0
              ? `${formatPreferredCurrency(0, currencyPref)} (Free / No Fee)`
              : formatPreferredCurrency(totalSdfInr, currencyPref)}
          </p>
          {isBhutan && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold tabular-nums">
              ₹1,200 × {nights} nights × {safeAdults} adult{safeAdults > 1 ? "s" : ""}
              {safeChildren > 0 ? ` + ${safeChildren} child (50% off)` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Border Readiness Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            1. Indian ID Held
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                { value: "passport", label: "Passport" },
                { value: "voter-id", label: "Voter ID" },
                { value: "aadhaar-only", label: "Aadhaar" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIdDocument(opt.value)}
                aria-pressed={idDocument === opt.value}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  idDocument === opt.value
                    ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs"
                    : "bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            2. Crossing / Entry Mode
          </span>
          <div className="grid grid-cols-2 gap-1">
            {(
              [
                { value: "overland", label: "Overland / Road" },
                { value: "air", label: "Flight / Air" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEntryMode(opt.value)}
                aria-pressed={entryMode === opt.value}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  entryMode === opt.value
                    ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs"
                    : "bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
            <Car className="w-3 h-3" aria-hidden="true" />
            <span>3. Private Indian Vehicle?</span>
          </span>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setBringingOwnVehicle(false)}
              aria-pressed={!bringingOwnVehicle}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                !bringingOwnVehicle
                  ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs"
                  : "bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
              }`}
            >
              No (Public / Cab)
            </button>
            <button
              type="button"
              onClick={() => setBringingOwnVehicle(true)}
              aria-pressed={bringingOwnVehicle}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                bringingOwnVehicle
                  ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs"
                  : "bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
              }`}
            >
              Yes (Own Car/Bike)
            </button>
          </div>
        </div>
      </div>

      {/* Deterministic Readiness Verdict Banner (Color + Icon + Explicit Status Text) */}
      <div
        role="status"
        aria-live="polite"
        className={`p-4 rounded-2xl border text-xs space-y-2 ${
          readiness.status === "blocked"
            ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/40 text-rose-950 dark:text-rose-200"
            : readiness.status === "caution"
            ? "bg-amber-500/10 dark:bg-amber-950/35 border-amber-500/35 text-amber-950 dark:text-amber-200"
            : "bg-emerald-500/10 dark:bg-emerald-950/35 border-emerald-500/35 text-emerald-950 dark:text-emerald-200"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-extrabold">
            {readiness.status === "blocked" ? (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
            ) : readiness.status === "caution" ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            )}
            <span>{readiness.headline}</span>
          </div>

          {readiness.extraVehicleFeeInr > 0 && (
            <span className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-950/10 dark:bg-white/10 tabular-nums">
              Vehicle Border Fee: +{formatPreferredCurrency(readiness.extraVehicleFeeInr, currencyPref)}
            </span>
          )}
        </div>

        <p className="leading-relaxed opacity-90">{permit.notes}</p>

        {readiness.alerts.length > 0 && (
          <ul className="space-y-1.5 pt-1 border-t border-current/15">
            {readiness.alerts.map((alert) => (
              <li key={alert} className="text-[11px] leading-relaxed font-medium">
                • {alert}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Interactive Document Readiness Checklist */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Pre-Departure Document Pack (Tap to Verify)</span>
          </h4>
          <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 tabular-nums">
            {checkedCount} / {readiness.checklist.length} Checked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {readiness.checklist.map((doc) => {
            const isChecked = Boolean(checkedDocs[`${route.id}:${doc}`]);
            return (
              <button
                key={doc}
                type="button"
                onClick={() => toggleDoc(doc)}
                aria-pressed={isChecked}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  isChecked
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200"
                    : "visionos-glass border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400/60"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span className={`font-medium ${isChecked ? "line-through opacity-80" : ""}`}>
                  {doc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Apply directly on official government portals to avoid agency commissions.
        </span>
        <a
          href={permit.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          <span>Official Government Portal</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
