"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CurrencyCode, DietaryType } from "@/types/route";

export interface TravelerProfile {
  travelerName: string;
  homeCityId: string;
  travelerVibe: "solo" | "couple" | "friends" | "family";
  dietaryType: DietaryType;
}

export interface AppSettings {
  currencyPref: CurrencyCode;
  offlineCache: boolean;
  ghostMode: boolean;
}

interface StoredPayload {
  profile: TravelerProfile;
  settings: AppSettings;
  savedRouteIds: string[];
  rsvpedRouteIds: string[];
}

const STORAGE_KEY = "desiroute:v1:state";

const DEFAULT_PROFILE: TravelerProfile = {
  travelerName: "Aman Sharma",
  homeCityId: "delhi",
  travelerVibe: "solo",
  dietaryType: "pure-veg",
};

const DEFAULT_SETTINGS: AppSettings = {
  currencyPref: "INR",
  offlineCache: true,
  ghostMode: false,
};

const DEFAULT_SAVED_ROUTES = ["bt-paro-thimphu", "np-ktm-pokhara", "in-himachal-tirthan"];

interface DesiRouteContextValue {
  hydrated: boolean;
  profile: TravelerProfile;
  settings: AppSettings;
  savedRouteIds: string[];
  rsvpedRouteIds: string[];
  storageUsageKb: number;
  updateProfile: (partial: Partial<TravelerProfile>) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleSavedRoute: (routeId: string) => void;
  toggleRsvpRoute: (routeId: string) => void;
  wipeAllMetadata: () => void;
}

const DesiRouteContext = createContext<DesiRouteContextValue | null>(null);

function measureBrowserStorageKb(): number {
  if (typeof window === "undefined") return 0;
  try {
    let totalBytes = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      const v = window.localStorage.getItem(k) || "";
      totalBytes += (k.length + v.length) * 2;
    }
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i);
      if (!k) continue;
      const v = window.sessionStorage.getItem(k) || "";
      totalBytes += (k.length + v.length) * 2;
    }
    return Number((totalBytes / 1024).toFixed(2));
  } catch {
    return 0;
  }
}

export function DesiRouteProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<TravelerProfile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(DEFAULT_SAVED_ROUTES);
  const [rsvpedRouteIds, setRsvpedRouteIds] = useState<string[]>([]);
  const [storageUsageKb, setStorageUsageKb] = useState<number>(0);

  // Hydrate once on client mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredPayload>;
        if (parsed.profile) setProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        if (Array.isArray(parsed.savedRouteIds)) setSavedRouteIds(parsed.savedRouteIds);
        if (Array.isArray(parsed.rsvpedRouteIds)) setRsvpedRouteIds(parsed.rsvpedRouteIds);
      }
    } catch (err) {
      console.warn("Could not read saved DesiRoute preferences:", err);
    } finally {
      setStorageUsageKb(measureBrowserStorageKb());
      setHydrated(true);
    }
  }, []);

  // Persist changes when hydrated and ghostMode is OFF
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (settings.ghostMode) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        const payload: StoredPayload = {
          profile,
          settings,
          savedRouteIds,
          rsvpedRouteIds,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (err) {
      console.warn("Could not persist DesiRoute preferences:", err);
    }
    setStorageUsageKb(measureBrowserStorageKb());
  }, [hydrated, profile, settings, savedRouteIds, rsvpedRouteIds]);

  const updateProfile = useCallback((partial: Partial<TravelerProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleSavedRoute = useCallback((routeId: string) => {
    setSavedRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  }, []);

  const toggleRsvpRoute = useCallback((routeId: string) => {
    setRsvpedRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  }, []);

  const wipeAllMetadata = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch (err) {
        console.error("Storage wipe failed:", err);
      }
    }
    setProfile(DEFAULT_PROFILE);
    setSettings({ ...DEFAULT_SETTINGS, ghostMode: true });
    setSavedRouteIds([]);
    setRsvpedRouteIds([]);
    setStorageUsageKb(0);
  }, []);

  return (
    <DesiRouteContext.Provider
      value={{
        hydrated,
        profile,
        settings,
        savedRouteIds,
        rsvpedRouteIds,
        storageUsageKb,
        updateProfile,
        updateSettings,
        toggleSavedRoute,
        toggleRsvpRoute,
        wipeAllMetadata,
      }}
    >
      {children}
    </DesiRouteContext.Provider>
  );
}

export function useDesiRoute(): DesiRouteContextValue {
  const ctx = useContext(DesiRouteContext);
  if (!ctx) {
    throw new Error("useDesiRoute must be used inside <DesiRouteProvider>");
  }
  return ctx;
}
