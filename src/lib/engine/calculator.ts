import {
  SubcontinentRoute,
  TravelStyle,
  CostBreakdown,
  CurrencyCode,
  TravelMonth,
} from "@/types/route";

function sanitizePositiveInt(value: number, fallback: number, max = 50): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(1, Math.round(value)));
}

function sanitizeNonNegativeInt(value: number, max = 50): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, Math.round(value)));
}

function sanitizeMultiplier(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(2.5, Math.max(0.5, value));
}

export interface BudgetOptions {
  intercityTransitPerPersonInr?: number;
  detourApplied?: boolean;
}

export function calculateItemizedBudget(
  route: SubcontinentRoute,
  style: TravelStyle,
  travelersCount = 1,
  childCount = 0,
  customAdjustmentMultiplier = 1,
  options: BudgetOptions = {}
): CostBreakdown {
  const safeTravelers = sanitizePositiveInt(travelersCount, 1);
  const safeChildren = sanitizeNonNegativeInt(childCount);
  const safeMultiplier = sanitizeMultiplier(customAdjustmentMultiplier);
  const basePerPerson = route.baseCostInr[style] * safeMultiplier;

  // Calculate Permits & Taxes explicitly
  let totalPermitsAndFees = 0;
  if (route.permitRule.required) {
    if (route.country === "BT" && route.permitRule.isDailyFee) {
      // Bhutan Sustainable Development Fee (SDF): ₹1,200 per adult per night, 50% for children (6-12)
      const nights = Math.max(1, route.durationDays - 1);
      const adultSdf = safeTravelers * route.permitRule.costInrPerPerson * nights;
      const childSdf = safeChildren * (route.permitRule.costInrPerPerson / 2) * nights;
      totalPermitsAndFees = adultSdf + childSdf;
    } else {
      // Fixed permit fee per traveler (e.g. Sikkim/Ladakh ILP, Nepal entry)
      totalPermitsAndFees = (safeTravelers + safeChildren) * route.permitRule.costInrPerPerson;
    }
  }

  // Explicit intercity transit from selected Origin + Mode (defaults to 0 if not passed so pure land tests stay exact)
  const rawIntercityPerPerson =
    Number.isFinite(options.intercityTransitPerPersonInr) && (options.intercityTransitPerPersonInr ?? 0) > 0
      ? Math.round(options.intercityTransitPerPersonInr!)
      : 0;
  const intercityTransit = rawIntercityPerPerson * safeTravelers;

  // Distribution weights based on travel style; avoid double-counting intercity fares when explicitly injected
  const staysRatio = style === "luxury" ? 0.42 : style === "comfort" ? 0.38 : 0.32;
  const localTransitRatio =
    rawIntercityPerPerson > 0
      ? style === "luxury"
        ? 0.14
        : 0.12
      : style === "luxury"
      ? 0.28
      : style === "comfort"
      ? 0.25
      : 0.28;
  const foodRatio = style === "luxury" ? 0.16 : style === "comfort" ? 0.18 : 0.22;
  const activitiesRatio = 0.10;
  const bufferRatio = 0.08;

  const totalBaseCostAllTravelers = basePerPerson * safeTravelers;

  const staysRaw = Math.round(totalBaseCostAllTravelers * staysRatio);
  const localTransit = Math.round(totalBaseCostAllTravelers * localTransitRatio);
  const food = Math.round(totalBaseCostAllTravelers * foodRatio);
  const activitiesRaw = Math.round(totalBaseCostAllTravelers * activitiesRatio);
  const buffer = Math.round(totalBaseCostAllTravelers * bufferRatio);

  // Apply Bheed Se Door detour savings (fraction applied against inflated tourist-trap stay & activity markups)
  const detourRate = options.detourApplied ? (route.detour.savingsPercentage / 100) * 0.45 : 0;
  const detourSavings = Math.round((staysRaw + activitiesRaw) * detourRate);
  const stays = Math.max(0, staysRaw - Math.round(detourSavings * 0.65));
  const activities = Math.max(0, activitiesRaw - Math.round(detourSavings * 0.35));

  const transit = localTransit + intercityTransit;
  const total = stays + transit + food + Math.round(totalPermitsAndFees) + activities + buffer;

  return {
    stays,
    transit,
    intercityTransit,
    food,
    permitsAndFees: Math.round(totalPermitsAndFees),
    activities,
    buffer,
    detourSavings,
    total,
  };
}

export function formatInr(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safe);
}

/**
 * Formats an INR base amount in the user's preferred subcontinent currency (`INR`, `NPR`, or `BTN`).
 */
export function formatPreferredCurrency(inrAmount: number, currency: CurrencyCode = "INR"): string {
  const safe = Number.isFinite(inrAmount) ? inrAmount : 0;
  if (currency === "NPR") {
    const npr = Math.round(safe * 1.6);
    return `NPR ${npr.toLocaleString("en-IN")}`;
  }
  if (currency === "BTN") {
    return `BTN ${Math.round(safe).toLocaleString("en-IN")}`;
  }
  return formatInr(safe);
}

export function convertInrToLocalCurrency(
  inrAmount: number,
  country: "IN" | "NP" | "BT"
): { formatted: string; note: string } {
  const safe = Number.isFinite(inrAmount) ? Math.max(0, inrAmount) : 0;
  if (country === "NP") {
    const npr = Math.round(safe * 1.6);
    return {
      formatted: `NPR ${npr.toLocaleString("en-IN")}`,
      note: "1 INR = 1.60 NPR (Fixed Exchange Rate). Note: Indian ₹100 notes are accepted everywhere; ₹500 notes are often restricted.",
    };
  }

  if (country === "BT") {
    return {
      formatted: `BTN ${Math.round(safe).toLocaleString("en-IN")}`,
      note: "1 INR = 1 BTN (Ngultrum Pegged 1:1). Indian Rupee cash is officially accepted throughout Bhutan.",
    };
  }

  return {
    formatted: `₹${Math.round(safe).toLocaleString("en-IN")}`,
    note: "Official Domestic Currency (INR). UPI accepted nationwide.",
  };
}

const UPI_VPA_REGEX = /^[a-zA-Z0-9._-]{2,64}@[a-zA-Z0-9.-]{2,32}$/;

export function isValidUpiVpa(vpa: string): boolean {
  return UPI_VPA_REGEX.test(vpa.trim());
}

export function generateUpiDeepLink(params: {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
}): string {
  const { payeeVpa, payeeName, amount, transactionNote } = params;
  const trimmedVpa = payeeVpa.trim();
  const safeVpa = isValidUpiVpa(trimmedVpa) ? trimmedVpa : "travellead@upi";
  const cleanVpa = encodeURIComponent(safeVpa);
  const cleanName = encodeURIComponent((payeeName || "Group Organizer").trim());
  const cleanNote = encodeURIComponent((transactionNote || "Trip Split").trim().slice(0, 60));
  const safeAmount = Number.isFinite(amount) ? Math.max(1, Math.round(amount)) : 1;

  return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${safeAmount}&cu=INR&tn=${cleanNote}`;
}

export function generateWhatsAppGroupShareText(params: {
  routeTitle: string;
  durationDays: number;
  totalPerPersonInr: number;
  routeUrl: string;
  pureVegGuaranteed: boolean;
}): string {
  const { routeTitle, durationDays, totalPerPersonInr, routeUrl, pureVegGuaranteed } = params;
  const formattedAmount = formatInr(totalPerPersonInr);
  const vegText = pureVegGuaranteed ? "🌿 Pure Veg / Jain Food: Verified" : "";

  return encodeURIComponent(
    `Namaste! Check out our trip plan:\n\n` +
      `📍 *${routeTitle}* (${durationDays} Days)\n` +
      `💰 *Estimated Budget:* ${formattedAmount} / person\n` +
      `${vegText ? vegText + "\n" : ""}` +
      `⚡ *Includes:* Stays, local transit, food, permits & emergency buffer\n\n` +
      `👉 View day-by-day plan & vote on schedule:\n${routeUrl}`
  );
}

export interface SeasonalStatus {
  status: "optimal" | "peak" | "caution" | "closed";
  label: string;
  recommendedMultiplier: number;
  advisory: string;
}

export function getSeasonalStatus(route: SubcontinentRoute, month: TravelMonth): SeasonalStatus {
  const alert = route.seasonalAlert;
  if (!alert) {
    return {
      status: "optimal",
      label: "Pleasant Season",
      recommendedMultiplier: 1.0,
      advisory: `Ideal traveling conditions in ${route.destination}.`,
    };
  }

  if (alert.closedMonths?.includes(month)) {
    return {
      status: "closed",
      label: "Pass Closure / Extreme Snow",
      recommendedMultiplier: 0.9,
      advisory: alert.advisory,
    };
  }

  if (alert.cautionMonths.includes(month)) {
    return {
      status: "caution",
      label: "Monsoon / Shoulder Risk",
      recommendedMultiplier: 0.85,
      advisory: alert.advisory,
    };
  }

  if (alert.peakMonths.includes(month)) {
    return {
      status: "peak",
      label: "Peak Demand Window",
      recommendedMultiplier: 1.2,
      advisory: `High occupancy expected in ${month}; book rail/homestays 3+ weeks ahead.`,
    };
  }

  return {
    status: "optimal",
    label: "Optimal Sweet Spot",
    recommendedMultiplier: 1.0,
    advisory: `Balanced crowds and crisp mountain skies expected in ${month}.`,
  };
}
