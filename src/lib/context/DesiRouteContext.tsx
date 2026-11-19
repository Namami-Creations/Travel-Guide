"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CurrencyCode, DietaryType } from "@/types/route";
import { GroupExpenseItem } from "@/lib/engine/trip-utils";

export interface TravelerProfile {
  travelerName: string;
  homeCityId: string;
  travelerVibe: "solo" | "couple" | "friends" | "family";
  dietaryType: DietaryType;
}

export interface AppSettings {
  currencyPref: CurrencyCode;
  ghostMode: boolean;
}

interface StoredPayload {
  profile: TravelerProfile;
  settings: AppSettings;
  savedRouteIds: string[];
  rsvpedRouteIds: string[];
  expensesByRoute: Record<string, GroupExpenseItem[]>;
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
  ghostMode: false,
};

const DEFAULT_SAVED_ROUTES = ["bt-paro-thimphu", "np-ktm-pokhara", "in-himachal-tirthan"];

const SERVER_SNAPSHOT: StoredPayload = {
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  savedRouteIds: DEFAULT_SAVED_ROUTES,
  rsvpedRouteIds: [],
  expensesByRoute: {},
};

let clientState: StoredPayload | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function readInitialClientState(): StoredPayload {
  if (clientState) return clientState;
  if (typeof window === "undefined") return SERVER_SNAPSHOT;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPayload>;
      clientState = {
        profile: parsed.profile ? { ...DEFAULT_PROFILE, ...parsed.profile } : DEFAULT_PROFILE,
        settings: parsed.settings
          ? {
              currencyPref: parsed.settings.currencyPref ?? DEFAULT_SETTINGS.currencyPref,
              ghostMode: Boolean(parsed.settings.ghostMode),
            }
          : DEFAULT_SETTINGS,
        savedRouteIds: Array.isArray(parsed.savedRouteIds)
          ? parsed.savedRouteIds
          : DEFAULT_SAVED_ROUTES,
        rsvpedRouteIds: Array.isArray(parsed.rsvpedRouteIds) ? parsed.rsvpedRouteIds : [],
        expensesByRoute:
          parsed.expensesByRoute && typeof parsed.expensesByRoute === "object"
            ? parsed.expensesByRoute
            : {},
      };
      return clientState;
    }
  } catch (err) {
    console.warn("Could not read saved DesiRoute preferences:", err);
  }

  clientState = SERVER_SNAPSHOT;
  return clientState;
}

function persistClientState(next: StoredPayload) {
  clientState = next;
  if (typeof window !== "undefined") {
    try {
      if (next.settings.ghostMode) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch (err) {
      console.warn("Could not persist DesiRoute preferences:", err);
    }
  }
  emitChange();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      clientState = null;
      readInitialClientState();
      emitChange();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getClientSnapshot(): StoredPayload {
  return readInitialClientState();
}

function getServerSnapshot(): StoredPayload {
  return SERVER_SNAPSHOT;
}

const subscribeHydrated = () => () => {};

interface DesiRouteContextValue {
  hydrated: boolean;
  profile: TravelerProfile;
  settings: AppSettings;
  savedRouteIds: string[];
  rsvpedRouteIds: string[];
  expensesByRoute: Record<string, GroupExpenseItem[]>;
  storageUsageKb: number;
  updateProfile: (partial: Partial<TravelerProfile>) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleSavedRoute: (routeId: string) => void;
  toggleRsvpRoute: (routeId: string) => void;
  addRouteExpense: (routeId: string, item: GroupExpenseItem) => void;
  removeRouteExpense: (routeId: string, expenseId: string) => void;
  wipeAllMetadata: () => void;
}

const DesiRouteContext = createContext<DesiRouteContextValue | null>(null);

export function DesiRouteProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeHydrated,
    () => true,
    () => false
  );

  const storageUsageKb = useMemo(() => {
    if (!hydrated || state.settings.ghostMode) return 0;
    const serialized = JSON.stringify(state);
    const bytes = (STORAGE_KEY.length + serialized.length) * 2;
    return Number((bytes / 1024).toFixed(2));
  }, [hydrated, state]);

  const updateProfile = useCallback((partial: Partial<TravelerProfile>) => {
    const current = readInitialClientState();
    persistClientState({
      ...current,
      profile: { ...current.profile, ...partial },
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    const current = readInitialClientState();
    persistClientState({
      ...current,
      settings: { ...current.settings, ...partial },
    });
  }, []);

  const toggleSavedRoute = useCallback((routeId: string) => {
    const current = readInitialClientState();
    const exists = current.savedRouteIds.includes(routeId);
    persistClientState({
      ...current,
      savedRouteIds: exists
        ? current.savedRouteIds.filter((id) => id !== routeId)
        : [...current.savedRouteIds, routeId],
    });
  }, []);

  const toggleRsvpRoute = useCallback((routeId: string) => {
    const current = readInitialClientState();
    const exists = current.rsvpedRouteIds.includes(routeId);
    persistClientState({
      ...current,
      rsvpedRouteIds: exists
        ? current.rsvpedRouteIds.filter((id) => id !== routeId)
        : [...current.rsvpedRouteIds, routeId],
    });
  }, []);

  const addRouteExpense = useCallback((routeId: string, item: GroupExpenseItem) => {
    const current = readInitialClientState();
    const existing = current.expensesByRoute[routeId] ?? [];
    persistClientState({
      ...current,
      expensesByRoute: {
        ...current.expensesByRoute,
        [routeId]: [...existing, item],
      },
    });
  }, []);

  const removeRouteExpense = useCallback((routeId: string, expenseId: string) => {
    const current = readInitialClientState();
    const existing = current.expensesByRoute[routeId] ?? [];
    persistClientState({
      ...current,
      expensesByRoute: {
        ...current.expensesByRoute,
        [routeId]: existing.filter((e) => e.id !== expenseId),
      },
    });
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
    persistClientState({
      profile: DEFAULT_PROFILE,
      settings: { ...DEFAULT_SETTINGS, ghostMode: true },
      savedRouteIds: [],
      rsvpedRouteIds: [],
      expensesByRoute: {},
    });
  }, []);

  const value = useMemo<DesiRouteContextValue>(
    () => ({
      hydrated,
      profile: state.profile,
      settings: state.settings,
      savedRouteIds: state.savedRouteIds,
      rsvpedRouteIds: state.rsvpedRouteIds,
      expensesByRoute: state.expensesByRoute,
      storageUsageKb,
      updateProfile,
      updateSettings,
      toggleSavedRoute,
      toggleRsvpRoute,
      addRouteExpense,
      removeRouteExpense,
      wipeAllMetadata,
    }),
    [
      hydrated,
      state.profile,
      state.settings,
      state.savedRouteIds,
      state.rsvpedRouteIds,
      state.expensesByRoute,
      storageUsageKb,
      updateProfile,
      updateSettings,
      toggleSavedRoute,
      toggleRsvpRoute,
      addRouteExpense,
      removeRouteExpense,
      wipeAllMetadata,
    ]
  );

  return <DesiRouteContext.Provider value={value}>{children}</DesiRouteContext.Provider>;
}

export function useDesiRoute(): DesiRouteContextValue {
  const ctx = useContext(DesiRouteContext);
  if (!ctx) {
    throw new Error("useDesiRoute must be used inside <DesiRouteProvider>");
  }
  return ctx;
}
