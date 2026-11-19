"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { formatPreferredCurrency } from "@/lib/engine/calculator";
import { DietaryType } from "@/types/route";
import {
  MapPin,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Trash2,
  EyeOff,
} from "lucide-react";

export function ProfileClient() {
  const {
    profile,
    settings,
    savedRouteIds,
    rsvpedRouteIds,
    updateProfile,
    toggleSavedRoute,
  } = useDesiRoute();

  const [travelerName, setTravelerName] = useState(profile.travelerName);
  const [homeCityId, setHomeCityId] = useState(profile.homeCityId);
  const [travelerVibe, setTravelerVibe] = useState(profile.travelerVibe);
  const [dietaryType, setDietaryType] = useState<DietaryType>(profile.dietaryType);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setTravelerName(profile.travelerName);
    setHomeCityId(profile.homeCityId);
    setTravelerVibe(profile.travelerVibe);
    setDietaryType(profile.dietaryType);
  }, [profile]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const homeCityObj = useMemo(
    () => ORIGIN_CITIES.find((c) => c.id === homeCityId) || ORIGIN_CITIES[0],
    [homeCityId]
  );

  const savedRoutes = useMemo(
    () => SUBCONTINENT_ROUTES.filter((r) => savedRouteIds.includes(r.id)),
    [savedRouteIds]
  );

  const totalDetourSavingsInr = useMemo(
    () =>
      savedRoutes.reduce(
        (acc, r) => acc + Math.round(r.baseCostInr.comfort * (r.detour.savingsPercentage / 100) * 0.45),
        0
      ),
    [savedRoutes]
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = travelerName.trim() || "Explorer";
    updateProfile({
      travelerName: cleanedName,
      homeCityId,
      travelerVibe,
      dietaryType,
    });
    setSavedSuccess(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setSavedSuccess(false), 2600);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header
        pureVegFilter={dietaryType === "pure-veg" || dietaryType === "jain"}
        onTogglePureVeg={() => {
          const nextDiet: DietaryType = dietaryType === "all" ? "pure-veg" : "all";
          setDietaryType(nextDiet);
          updateProfile({ dietaryType: nextDiet });
        }}
      />

      <main
        id="main-content"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 flex-1"
      >
        {settings.ghostMode && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 font-semibold"
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                Incognito Travel Mode is active: changes apply to this session only and will not be saved to browser storage.
              </span>
            </div>
            <Link href="/settings" className="underline font-extrabold shrink-0">
              Settings
            </Link>
          </div>
        )}

        {/* Profile Header */}
        <section className="visionos-glass-elevated p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 spatial-card-3d">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border border-white/20">
              {(travelerName.trim() || "E").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-slate-50">
                  {travelerName || "Explorer"}
                </h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/20">
                  Local-First Vault
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
                Starting Hub: {homeCityObj.name} ({homeCityObj.state})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-center p-3 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800">
              <span className="text-lg font-mono font-black text-slate-950 dark:text-slate-50">
                {savedRoutes.length}
              </span>
              <span className="text-[10px] text-slate-500 block font-semibold">Saved Routes</span>
            </div>
            <div className="text-center p-3 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800">
              <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                {formatPreferredCurrency(totalDetourSavingsInr, settings.currencyPref)}
              </span>
              <span className="text-[10px] text-slate-500 block font-semibold">Detour Savings</span>
            </div>
            <div className="text-center p-3 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800">
              <span className="text-lg font-mono font-black text-cyan-600 dark:text-cyan-400">
                {rsvpedRouteIds.length}
              </span>
              <span className="text-[10px] text-slate-500 block font-semibold">9 PM RSVPs</span>
            </div>
          </div>
        </section>

        {/* Traveler DNA & Preferences Form */}
        <form
          onSubmit={handleSaveProfile}
          className="visionos-glass p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-6"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-slate-50">
                Traveler DNA & Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Syncs your default departure city and dietary filter across the Multi-Modal Budget OS.
              </p>
            </div>
            {savedSuccess && (
              <span
                role="status"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                {settings.ghostMode ? "Applied for Session" : "Saved to Device"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label
                htmlFor="traveler-name-input"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Display Name
              </label>
              <input
                id="traveler-name-input"
                type="text"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                maxLength={50}
                className="w-full p-3 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="home-city-select"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Primary Starting City
              </label>
              <select
                id="home-city-select"
                value={homeCityId}
                onChange={(e) => setHomeCityId(e.target.value)}
                className="w-full p-3 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              >
                {ORIGIN_CITIES.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="travel-vibe-select"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Default Travel Style
              </label>
              <select
                id="travel-vibe-select"
                value={travelerVibe}
                onChange={(e) =>
                  setTravelerVibe(e.target.value as "solo" | "couple" | "friends" | "family")
                }
                className="w-full p-3 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="solo">Solo Backpacker / Detourist</option>
                <option value="couple">Couple & Boutique Homestays</option>
                <option value="friends">College / Friends Group (Split Trips)</option>
                <option value="family">Family & Multi-Gen Leisure</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="diet-filter-select"
                className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5"
              >
                Dietary Assurance
              </label>
              <select
                id="diet-filter-select"
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                className="w-full p-3 rounded-xl visionos-glass border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="pure-veg">Pure Vegetarian Verified</option>
                <option value="jain">Strict Jain Food (No Onion/Garlic/Root)</option>
                <option value="all">Standard All Cuisines</option>
                <option value="halal">Halal Verified Preference</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 transition-all tactile-button-3d"
          >
            Save Preferences
          </button>
        </form>

        {/* Saved Itineraries */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-500" aria-hidden="true" />
              Saved Mountain Itineraries ({savedRoutes.length})
            </h2>
            <Link href="/" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Browse All Corridors →
            </Link>
          </div>

          {savedRoutes.length === 0 ? (
            <div className="p-8 rounded-[1.75rem] visionos-glass border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No bookmarked routes yet.
              </p>
              <p className="text-xs text-slate-500">
                Tap the bookmark icon on any corridor card in the Budget OS to pin it here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold"
              >
                Explore Corridors
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {savedRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-5 rounded-[1.75rem] visionos-glass border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between spatial-card-3d"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                      <span>
                        {route.country === "BT"
                          ? "🇧🇹 Bhutan"
                          : route.country === "NP"
                          ? "🇳🇵 Nepal"
                          : "🇮🇳 India"}
                      </span>
                      <span className="font-bold">{route.durationDays} Days</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-950 dark:text-slate-50 leading-snug">
                      {route.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{route.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-xs text-slate-900 dark:text-slate-100">
                      {formatPreferredCurrency(route.baseCostInr.comfort, settings.currencyPref)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleSavedRoute(route.id)}
                        aria-label={`Remove ${route.title} from saved routes`}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <Link
                        href={`/?route=${encodeURIComponent(route.id)}`}
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                        aria-label={`Open ${route.title} in Planner`}
                      >
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
