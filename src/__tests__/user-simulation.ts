import { findDestinationsByBudget } from "../lib/engine/reverse-budget";
import { calculateItemizedBudget, formatInr } from "../lib/engine/calculator";
import {
  getRoundTripIntercityPerPersonInr,
  resolveMultiModalTransit,
} from "../lib/engine/transit-resolver";
import { SUBCONTINENT_ROUTES } from "../lib/data/subcontinent-routes";

console.log("=================================================================");
console.log("REAL USER SIMULATION: DELHI -> HIMACHAL & SPITI WITH ₹20,000");
console.log("=================================================================\n");

console.log("🔍 TEST A: Reverse Budget Query (Delhi Origin, ₹20,000, 5 Days, Comfort, Pure Veg)");
const matches = findDestinationsByBudget({
  originId: "delhi",
  maxBudgetInr: 20000,
  durationDays: 5,
  style: "comfort",
  pureVegRequired: true,
});

if (matches.length === 0) {
  throw new Error("Expected at least one destination matching ₹20,000 Delhi query");
}

matches.forEach((m, idx) => {
  console.log(`[Option ${idx + 1}] ${m.destinationName} (${m.country})`);
  console.log(`  - Fits Strictly Inside Budget: ${m.fitsWithinBudget ? "YES" : `NO (+${formatInr(m.overBudgetByInr)})`}`);
  console.log(`  - Total All-In Cost (incl. round-trip ${m.bestTransitMode.toUpperCase()}): ${formatInr(m.totalCostInr)}`);
  console.log(`  - Buffer Remaining: ${formatInr(m.savingsInr)}`);
  console.log(`  - Verdict: ${m.whyFitsBudget}\n`);
});

console.log("🚆 TEST B: Multi-Modal Transit Resolution for Delhi -> Tirthan/Manali & Delhi -> Spiti");
const manaliTransit = resolveMultiModalTransit("delhi", "in-himachal-tirthan");
const spitiTransit = resolveMultiModalTransit("delhi", "in-himachal-spiti");
if (!manaliTransit || !spitiTransit) {
  throw new Error("Failed to resolve Delhi -> Himachal or Spiti transit plan");
}

console.log(`• Tirthan/Manali Plan (${manaliTransit.provenance}): ${manaliTransit.distanceKm} km`);
console.log(`  Bus: ${manaliTransit.bus.operator} | One-Way: ${formatInr(manaliTransit.bus.fareInr)}`);
console.log(`• Spiti Valley Plan (${spitiTransit.provenance}): ${spitiTransit.distanceKm} km`);
console.log(`  Bus: ${spitiTransit.bus.operator} | One-Way: ${formatInr(spitiTransit.bus.fareInr)}`);

const tirthanRoute = SUBCONTINENT_ROUTES.find((r) => r.id === "in-himachal-tirthan")!;
const roundTripBus = getRoundTripIntercityPerPersonInr(
  manaliTransit,
  "bus",
  "comfort",
  1,
  tirthanRoute.durationDays
);
const unifiedBudget = calculateItemizedBudget(tirthanRoute, "comfort", 1, 0, 1.0, {
  intercityTransitPerPersonInr: roundTripBus,
  detourApplied: true,
});

console.log("\n💰 TEST C: Unified All-In Breakdown (Delhi -> Tirthan/Manali, Comfort + Volvo Bus + Bheed Se Door):");
console.log(`• Stays: ${formatInr(unifiedBudget.stays)}`);
console.log(`• Local + Intercity Transit: ${formatInr(unifiedBudget.transit)} (Intercity RT: ${formatInr(unifiedBudget.intercityTransit)})`);
console.log(`• Food: ${formatInr(unifiedBudget.food)}`);
console.log(`• Activities: ${formatInr(unifiedBudget.activities)}`);
console.log(`• Buffer: ${formatInr(unifiedBudget.buffer)}`);
console.log(`• Detour Savings Applied: -${formatInr(unifiedBudget.detourSavings)}`);
console.log(`-----------------------------------------------------------------`);
console.log(`ALL-IN GRAND TOTAL: ${formatInr(unifiedBudget.total)}`);
if (unifiedBudget.total > 20000) {
  throw new Error(`Expected Tirthan Comfort+Bus all-in total <= ₹20,000, got ${unifiedBudget.total}`);
}
console.log("=================================================================");
