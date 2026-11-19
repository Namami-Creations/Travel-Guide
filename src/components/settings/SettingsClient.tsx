"use client";

import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { CurrencyCode } from "@/types/route";
import {
  Settings,
  Trash2,
  CheckCircle2,
  Lock,
  EyeOff,
  Download,
  AlertTriangle,
} from "lucide-react";

export function SettingsClient() {
  const {
    profile,
    settings,
    savedRouteIds,
    rsvpedRouteIds,
    storageUsageKb,
    updateSettings,
    wipeAllMetadata,
  } = useDesiRoute();

  const [confirmWipe, setConfirmWipe] = useState(false);
  const [dataWiped, setDataWiped] = useState(false);
  const wipedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (wipedTimerRef.current !== null) {
        window.clearTimeout(wipedTimerRef.current);
      }
    };
  }, []);

  const handleConfirmWipe = () => {
    wipeAllMetadata();
    setConfirmWipe(false);
    setDataWiped(true);
    if (wipedTimerRef.current !== null) {
      window.clearTimeout(wipedTimerRef.current);
    }
    wipedTimerRef.current = window.setTimeout(() => setDataWiped(false), 4500);
  };

  const handleExportVaultJson = () => {
    if (typeof window === "undefined") return;
    const payload = {
      exportedBy: "DesiRoute OS",
      version: "1.0",
      profile,
      settings,
      savedRouteIds,
      rsvpedRouteIds,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "desiroute-trip-vault.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header />

      <main
        id="main-content"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 flex-1"
      >
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Settings className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
            <span>Preferences & Data Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            Settings & Privacy Vault
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Configure currency display across India, Nepal, and Bhutan, manage local storage, and exercise 1-click sovereignty over your stored travel metadata.
          </p>
        </section>

        {/* Regional & Display Preferences */}
        <section className="visionos-glass p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-slate-50 border-b border-slate-200/60 dark:border-slate-800/60 pb-3.5">
            Regional & Display Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label
                htmlFor="currency-display-select"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Primary Currency Display
              </label>
              <select
                id="currency-display-select"
                value={settings.currencyPref}
                onChange={(e) => updateSettings({ currencyPref: e.target.value as CurrencyCode })}
                className="w-full p-3 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="INR">₹ INR (Indian Rupee — Base Standard)</option>
                <option value="NPR">NPR (Nepali Rupee — 1 INR = 1.60 NPR)</option>
                <option value="BTN">BTN (Bhutanese Ngultrum — 1:1 Peg)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="offline-cache-toggle"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Offline Printable Briefs & Local Sync
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Retain route bookmarks in device storage
                </span>
                <input
                  id="offline-cache-toggle"
                  type="checkbox"
                  checked={settings.offlineCache}
                  onChange={(e) => updateSettings({ offlineCache: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <p className="text-[11px] text-slate-500">
              Export your bookmarked corridors and traveler DNA for backup before clearing device storage.
            </p>
            <button
              type="button"
              onClick={handleExportVaultJson}
              className="py-2 px-3.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:border-cyan-500 transition-colors tactile-button-3d"
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
              <span>Export Vault (JSON)</span>
            </button>
          </div>
        </section>

        {/* DPDP Act 2023 Metadata Deletion Vault */}
        <section className="visionos-glass p-6 sm:p-8 rounded-[2rem] border border-rose-500/30 space-y-6 spatial-card-3d">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold border border-rose-500/20 shadow-xs">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-black">
                  DPDP Act 2023 Privacy Compliance
                </span>
                <h2 className="text-lg font-black text-slate-950 dark:text-slate-50">
                  Metadata & Storage Erasure Vault
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-500 font-mono block font-semibold">
                Measured Local Storage:
              </span>
              <span className="text-base font-mono font-black text-slate-950 dark:text-slate-50">
                {storageUsageKb.toFixed(2)} KB
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            In compliance with India&apos;s Digital Personal Data Protection (DPDP) Act 2023, you maintain complete sovereignty over your travel preferences and saved routes. Zero telemetry leaves your browser.
          </p>

          {/* Ghost Mode Toggle */}
          <div className="p-4 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-slate-500 shrink-0" aria-hidden="true" />
              <div>
                <label
                  htmlFor="ghost-mode-toggle"
                  className="text-xs font-bold text-slate-900 dark:text-slate-100 block cursor-pointer"
                >
                  Incognito Travel Mode (Zero-Persistence)
                </label>
                <p className="text-[11px] text-slate-500">
                  When enabled, changes stay in memory only and browser localStorage stays cleared.
                </p>
              </div>
            </div>

            <input
              id="ghost-mode-toggle"
              type="checkbox"
              checked={settings.ghostMode}
              onChange={(e) => updateSettings({ ghostMode: e.target.checked })}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Permanent Wipe Action */}
          <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-rose-400/40 dark:border-rose-800/60 space-y-3.5">
            <div>
              <h3 className="text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" aria-hidden="true" />
                Permanent Metadata Erasure
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instantly purges saved bookmarks, 9 PM RSVPs, traveler DNA, and storage keys from this browser.
              </p>
            </div>

            {dataWiped ? (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Verified: Local browser storage has been permanently wiped (0.00 KB used).</span>
              </div>
            ) : confirmWipe ? (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Confirm resetting {savedRouteIds.length} saved routes and preferences?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmWipe(false)}
                    className="py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmWipe}
                    className="py-1.5 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Yes, Erase All
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmWipe(true)}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all tactile-button-3d"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Permanently Wipe All My Travel Metadata</span>
              </button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
