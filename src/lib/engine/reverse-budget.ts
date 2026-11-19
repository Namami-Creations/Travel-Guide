import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { ReverseBudgetMatch, TransitMode } from "@/types/transit";
import { TravelStyle } from "@/types/route";
import { calculateItemizedBudget, formatInr } from "./calculator";
import { resolveMultiModalTransit, getRoundTripIntercityPerPersonInr } from "./transit-resolver";

export function findDestinationsByBudget(params: {
  originId: string;
  maxBudgetInr: number;
  durationDays: number;
  style: TravelStyle;
  pureVegRequired: boolean;
  jainRequired?: boolean;
}): ReverseBudgetMatch[] {
  const { originId, maxBudgetInr, durationDays, style, pureVegRequired, jainRequired = false } = params;
  const safeBudget = Number.isFinite(maxBudgetInr) ? Math.max(1000, maxBudgetInr) : 15000;

  const matches: ReverseBudgetMatch[] = [];

  for (const route of SUBCONTINENT_ROUTES) {
    // Check if days roughly align (within +/- 2 days of desired trip)
    if (Math.abs(route.durationDays - durationDays) > 2) {
      continue;
    }

    // Honor dietary filtering genuinely
    const allActivities = route.itinerary.flatMap((d) => d.activities);
    if (jainRequired) {
      const jainRatio = allActivities.filter((a) => a.jainAvailable).length / Math.max(1, allActivities.length);
      if (jainRatio < 0.75) continue;
    } else if (pureVegRequired) {
      const vegAvailable = allActivities.every((a) => a.pureVegAvailable);
      if (!vegAvailable) continue;
    }

    const transitPlan = resolveMultiModalTransit(originId, route.id);

    // Choose optimal transit mode balancing comfort and pocket ceiling
    let chosenMode: TransitMode = "train";
    if (transitPlan) {
      if (safeBudget < 14000) {
        chosenMode = "train";
      } else if (safeBudget < 24000) {
        chosenMode = "bus";
      } else {
        chosenMode = "car";
      }
    }

    const intercityPerPerson = getRoundTripIntercityPerPersonInr(
      transitPlan,
      chosenMode,
      style,
      1,
      route.durationDays
    );

    const breakdown = calculateItemizedBudget(route, style, 1, 0, 1.0, {
      intercityTransitPerPersonInr: intercityPerPerson,
    });

    // If default mode pushes over budget, auto-downgrade mode to train/bus before failing
    let finalMode = chosenMode;
    let totalEstimate = breakdown.total;
    if (totalEstimate > safeBudget && transitPlan && chosenMode !== "train") {
      const trainIntercity = getRoundTripIntercityPerPersonInr(
        transitPlan,
        "train",
        style,
        1,
        route.durationDays
      );
      const trainBreakdown = calculateItemizedBudget(route, style, 1, 0, 1.0, {
        intercityTransitPerPersonInr: trainIntercity,
      });
      if (trainBreakdown.total < totalEstimate) {
        finalMode = "train";
        totalEstimate = trainBreakdown.total;
      }
    }

    // Include strict matches AND slight stretch candidates (up to +12% flagged transparently)
    if (totalEstimate <= safeBudget * 1.12) {
      const fitsWithinBudget = totalEstimate <= safeBudget;
      const savings = fitsWithinBudget ? safeBudget - totalEstimate : 0;
      const overBy = fitsWithinBudget ? 0 : totalEstimate - safeBudget;

      let whyFits = fitsWithinBudget
        ? `All-in ${route.durationDays}-day trip (including round-trip ${finalMode} from gateway) fits comfortably inside ${formatInr(safeBudget)}.`
        : `Near-match: just ${formatInr(overBy)} above ${formatInr(safeBudget)} — switch to Hostel style or Bheed Se Door swap to pull inside budget.`;

      if (fitsWithinBudget && savings >= 2000) {
        whyFits += ` Leaves ${formatInr(savings)} buffer for cafes & gear.`;
      }

      matches.push({
        routeId: route.id,
        destinationName: route.destination,
        country: route.country,
        durationDays: route.durationDays,
        bestTransitMode: finalMode,
        totalCostInr: totalEstimate,
        budgetCapInr: safeBudget,
        savingsInr: savings,
        overBudgetByInr: overBy,
        fitsWithinBudget,
        tagline: route.tagline,
        whyFitsBudget: whyFits,
      });
    }
  }

  // Sort strictly within-budget options first (closest fit to budget ceiling), then stretch options
  return matches.sort((a, b) => {
    if (a.fitsWithinBudget !== b.fitsWithinBudget) {
      return a.fitsWithinBudget ? -1 : 1;
    }
    return a.fitsWithinBudget ? b.totalCostInr - a.totalCostInr : a.overBudgetByInr - b.overBudgetByInr;
  });
}
