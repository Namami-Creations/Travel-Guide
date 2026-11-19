import {
  calculateItemizedBudget,
  convertInrToLocalCurrency,
  formatPreferredCurrency,
  generateUpiDeepLink,
  getSeasonalStatus,
  isValidUpiVpa,
} from "../lib/engine/calculator";
import { findDestinationsByBudget } from "../lib/engine/reverse-budget";
import {
  getRoundTripIntercityPerPersonInr,
  resolveMultiModalTransit,
} from "../lib/engine/transit-resolver";
import { SUBCONTINENT_ROUTES } from "../lib/data/subcontinent-routes";
import { ORIGIN_CITIES } from "../lib/data/origin-cities";
import { MULTIMODAL_TRANSIT_PLANS } from "../lib/data/multimodal-transit-data";
import { EDITORIAL_ARTICLES } from "../lib/data/editorial-articles";
import {
  EditorialArticleSchema,
  MultiModalTransitPlanSchema,
  OriginCitySchema,
  SubcontinentRouteSchema,
} from "../lib/schemas/route-schema";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("🧪 Running DesiRoute OS Comprehensive Audit Test Suite...\n");

// 1. Validate all core datasets against strict Zod schemas
console.log("1. Validating Subcontinent Routes, Origin Cities, Transit Plans & Editorial Articles...");
assert(SUBCONTINENT_ROUTES.length >= 7, "Expected at least 7 Subcontinent routes");
SUBCONTINENT_ROUTES.forEach((route) => {
  const res = SubcontinentRouteSchema.safeParse(route);
  if (!res.success) {
    console.error(`Route schema error on ${route.id}:`, res.error.format());
    throw new Error(`Route schema invalid: ${route.id}`);
  }
  assert(
    route.itinerary.length === route.durationDays,
    `Route ${route.id} itinerary days (${route.itinerary.length}) must equal durationDays (${route.durationDays})`
  );
});

assert(ORIGIN_CITIES.length === 9, "Expected 9 Origin Cities");
ORIGIN_CITIES.forEach((city) => {
  const res = OriginCitySchema.safeParse(city);
  if (!res.success) throw new Error(`OriginCity invalid: ${city.id}`);
});

const curatedPlans = Object.values(MULTIMODAL_TRANSIT_PLANS);
assert(curatedPlans.length >= 9, "Expected at least 9 curated multi-modal transit corridors");
curatedPlans.forEach((plan) => {
  const res = MultiModalTransitPlanSchema.safeParse(plan);
  if (!res.success) {
    console.error(`Transit plan schema error on ${plan.id}:`, res.error.format());
    throw new Error(`Transit plan invalid: ${plan.id}`);
  }
});

EDITORIAL_ARTICLES.forEach((article) => {
  const res = EditorialArticleSchema.safeParse(article);
  if (!res.success) {
    console.error(`Article schema error on ${article.id}:`, res.error.format());
    throw new Error(`Article invalid: ${article.id}`);
  }
  const linked = SUBCONTINENT_ROUTES.some((r) => r.id === article.relatedRouteId);
  assert(linked, `Article ${article.id} references missing route ${article.relatedRouteId}`);
});
console.log(
  `✓ Schema & relational integrity verified (${SUBCONTINENT_ROUTES.length} routes, ${ORIGIN_CITIES.length} origins, ${curatedPlans.length} curated corridors, ${EDITORIAL_ARTICLES.length} articles).\n`
);

// 2. Test full 63-pair (9 origins x 7 destinations) multi-modal transit matrix
console.log("2. Testing full 63-pair Origin × Destination transit resolver...");
let pairCount = 0;
for (const origin of ORIGIN_CITIES) {
  for (const route of SUBCONTINENT_ROUTES) {
    const plan = resolveMultiModalTransit(origin.id, route.id);
    assert(Boolean(plan), `Missing transit resolution for ${origin.id} -> ${route.id}`);
    assert(plan!.distanceKm > 0, `Non-positive distance for ${origin.id} -> ${route.id}`);
    const rtTrain = getRoundTripIntercityPerPersonInr(
      plan,
      "train",
      "comfort",
      2,
      route.durationDays
    );
    assert(Number.isFinite(rtTrain) && rtTrain >= 0, `Invalid round-trip train cost for ${origin.id} -> ${route.id}`);
    pairCount++;
  }
}
console.log(`✓ Resolved all ${pairCount} origin-destination pairs cleanly.\n`);

// 3. Bhutan SDF + numeric hardening edge cases (NaN, negative inputs, detour savings, intercity injection)
console.log("3. Testing Calculator Hardening, Bhutan SDF, Intercity Injection & Detour Math...");
const bhutanRoute = SUBCONTINENT_ROUTES.find((r) => r.country === "BT")!;
const bhutanBudget = calculateItemizedBudget(bhutanRoute, "comfort", 2, 1, 1.0);
assert(
  bhutanBudget.permitsAndFees === 12000,
  `Bhutan SDF should be ₹12,000 for 2 adults + 1 child over 4 nights, got ${bhutanBudget.permitsAndFees}`
);

const edgeBudget = calculateItemizedBudget(bhutanRoute, "comfort", Number.NaN, -5, 99);
assert(Number.isFinite(edgeBudget.total) && edgeBudget.total > 0, "NaN travelers & negative child must sanitize safely");
assert(edgeBudget.permitsAndFees === 4800, "Sanitized 1 adult + 0 child Bhutan SDF should be ₹4,800");

const baseWithTransit = calculateItemizedBudget(bhutanRoute, "comfort", 1, 0, 1.0, {
  intercityTransitPerPersonInr: 4000,
  detourApplied: false,
});
const withDetour = calculateItemizedBudget(bhutanRoute, "comfort", 1, 0, 1.0, {
  intercityTransitPerPersonInr: 4000,
  detourApplied: true,
});
assert(baseWithTransit.intercityTransit === 4000, "Intercity transit must reflect passed cost");
assert(withDetour.detourSavings > 0 && withDetour.total < baseWithTransit.total, "Applying Bheed Se Door detour must reduce total cost");
console.log(`✓ Bhutan SDF & hardened calculator edge cases verified.\n`);

// 4. Reverse Budget Engine honesty + dietary enforcement
console.log("4. Testing Reverse Budget Honesty & Dietary Enforcement...");
const strictJainMatches = findDestinationsByBudget({
  originId: "delhi",
  maxBudgetInr: 20000,
  durationDays: 5,
  style: "comfort",
  pureVegRequired: true,
  jainRequired: true,
});
assert(strictJainMatches.length > 0, "Expected Jain-compatible corridors around ₹20k from Delhi");
strictJainMatches.forEach((m) => {
  if (m.fitsWithinBudget) {
    assert(m.totalCostInr <= 20000 && m.overBudgetByInr === 0, "Strict match must fit budget");
  } else {
    assert(m.overBudgetByInr === m.totalCostInr - 20000, "Stretch match must accurately report overBudgetByInr");
  }
});
console.log(`✓ Reverse budget matcher verified (${strictJainMatches.length} matches checked).\n`);

// 5. Currency Parity, Seasonal Advisory & UPI Validation
console.log("5. Testing Currency Conversion, Seasonal Advisory & UPI VPA Validation...");
const nepalConversion = convertInrToLocalCurrency(1000, "NP");
assert(nepalConversion.formatted.includes("1,600"), "Nepal conversion must equal NPR 1,600 for ₹1,000");
assert(formatPreferredCurrency(1000, "NPR") === "NPR 1,600", "Preferred currency formatter mismatch for NPR");
assert(formatPreferredCurrency(1000, "BTN") === "BTN 1,000", "Preferred currency formatter mismatch for BTN");

const spitiRoute = SUBCONTINENT_ROUTES.find((r) => r.id === "in-himachal-spiti")!;
const winterStatus = getSeasonalStatus(spitiRoute, "Jan");
assert(winterStatus.status === "closed", `Spiti Jan seasonal status must be closed, got ${winterStatus.status}`);

assert(isValidUpiVpa("traveler@okaxis"), "Valid UPI VPA should pass");
assert(!isValidUpiVpa("not-a-valid-upi"), "Invalid UPI VPA should fail");
const upiLink = generateUpiDeepLink({
  payeeVpa: "traveler@okaxis",
  payeeName: "Rahul Sharma",
  amount: 4500.75,
  transactionNote: "Goa Split",
});
assert(upiLink.startsWith("upi://pay?") && upiLink.includes("am=4501"), "UPI deep link invalid");
console.log("✓ Currency, seasonal alerts, and UPI validation passed.\n");

console.log("🎉 All Audit Tests Passed with 100% Integrity!");
