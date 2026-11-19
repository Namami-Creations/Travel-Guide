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
  getIrctcWaitlistPlanB,
  getRoundTripIntercityPerPersonInr,
  resolveMultiModalTransit,
} from "../lib/engine/transit-resolver";
import {
  buildShareableTripUrl,
  evaluateBorderReadiness,
  parseTripQueryParams,
  simplifyGroupDebts,
} from "../lib/engine/trip-utils";
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

// 2. Test full 81-pair (9 origins x 9 destinations) multi-modal transit matrix including Flight + Cab
console.log("2. Testing full 81-pair Origin × Destination transit resolver (5 modes incl. Flight)...");
let pairCount = 0;
for (const origin of ORIGIN_CITIES) {
  for (const route of SUBCONTINENT_ROUTES) {
    const plan = resolveMultiModalTransit(origin.id, route.id);
    if (!plan) throw new Error(`Missing transit resolution for ${origin.id} -> ${route.id}`);
    assert(plan.distanceKm > 0, `Non-positive distance for ${origin.id} -> ${route.id}`);
    assert(
      Boolean(plan.flight && plan.flight.oneWayFareInr > 0 && plan.flight.fromAirportCode && plan.flight.toAirportCode),
      `Missing valid flight option for ${origin.id} -> ${route.id}`
    );
    const rtTrain = getRoundTripIntercityPerPersonInr(
      plan,
      "train",
      "comfort",
      2,
      route.durationDays
    );
    const rtFlight = getRoundTripIntercityPerPersonInr(
      plan,
      "flight",
      "comfort",
      2,
      route.durationDays
    );
    assert(Number.isFinite(rtTrain) && rtTrain >= 0, `Invalid round-trip train cost for ${origin.id} -> ${route.id}`);
    assert(Number.isFinite(rtFlight) && rtFlight > 0, `Invalid round-trip flight cost for ${origin.id} -> ${route.id}`);
    pairCount++;
  }
}
assert(pairCount === 81, `Expected 81 origin-destination pairs, got ${pairCount}`);
console.log(`✓ Resolved all ${pairCount} origin-destination pairs cleanly (including Flight + Cab).\n`);

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

// 6. End-to-End Corridor Check: Delhi -> Tirthan Comfort + Volvo Bus + Bheed Se Door <= ₹20,000
const tirthanRoute = SUBCONTINENT_ROUTES.find((r) => r.id === "in-himachal-tirthan")!;
const manaliTransit = resolveMultiModalTransit("delhi", "in-himachal-tirthan");
assert(Boolean(manaliTransit), "Failed to resolve Delhi -> Tirthan transit plan");
const roundTripBus = getRoundTripIntercityPerPersonInr(
  manaliTransit,
  "bus",
  "comfort",
  1,
  tirthanRoute.durationDays
);
const tirthanUnified = calculateItemizedBudget(tirthanRoute, "comfort", 1, 0, 1.0, {
  intercityTransitPerPersonInr: roundTripBus,
  detourApplied: true,
});
assert(
  tirthanUnified.total <= 20000,
  `Expected Delhi -> Tirthan Comfort+Bus+Detour total <= ₹20,000, got ${tirthanUnified.total}`
);

// 7. IRCTC Waitlist Plan B (short-haul -> Bus, long-haul -> Flight)
console.log("7. Testing IRCTC Waitlist Plan B fallback routing...");
if (!manaliTransit) throw new Error("Missing Delhi -> Tirthan transit plan");
const shortPlanB = getIrctcWaitlistPlanB(manaliTransit);
assert(
  shortPlanB.fallbackMode === "bus",
  `Expected Delhi -> Tirthan fallbackMode=bus, got ${shortPlanB.fallbackMode}`
);
const longHaulTransit = resolveMultiModalTransit("mumbai", "bt-paro-thimphu");
if (!longHaulTransit) throw new Error("Missing Mumbai -> Bhutan transit plan");
const longPlanB = getIrctcWaitlistPlanB(longHaulTransit);
assert(
  longPlanB.fallbackMode === "flight",
  `Expected Mumbai -> Bhutan fallbackMode=flight, got ${longPlanB.fallbackMode}`
);
console.log("✓ IRCTC Waitlist Plan B routing verified.\n");

// 8. Stateful Shareable Trip URL Round-Trip Integrity
console.log("8. Testing Stateful Shareable Trip URL encode/decode...");
const validRouteIds = new Set(SUBCONTINENT_ROUTES.map((r) => r.id));
const validOriginIds = new Set(ORIGIN_CITIES.map((c) => c.id));
const encodedUrl = buildShareableTripUrl(
  {
    routeId: "in-himachal-tirthan",
    originId: "mumbai",
    mode: "flight",
    month: "Oct",
    style: "luxury",
    adults: 4,
    children: 1,
    detourApplied: true,
  },
  "https://desiroute.in"
);
const parsedUrl = new URL(encodedUrl);
const decoded = parseTripQueryParams(parsedUrl.searchParams, validRouteIds, validOriginIds);
assert(decoded.routeId === "in-himachal-tirthan", "Decoded routeId mismatch");
assert(decoded.originId === "mumbai", "Decoded originId mismatch");
assert(decoded.mode === "flight", "Decoded mode mismatch");
assert(decoded.month === "Oct", "Decoded month mismatch");
assert(decoded.style === "luxury", "Decoded style mismatch");
assert(decoded.adults === 4 && decoded.children === 1, "Decoded traveler counts mismatch");
assert(decoded.detourApplied === true, "Decoded detourApplied mismatch");
console.log("✓ Stateful trip URL round-trip integrity verified.\n");

// 9. FairShare Live Expense Ledger Minimum-Transfer Debt Simplification
console.log("9. Testing FairShare Expense Ledger Debt Simplification...");
const ledger = simplifyGroupDebts(
  [
    { id: "m-0", name: "Aarav" },
    { id: "m-1", name: "Diya" },
    { id: "m-2", name: "Kabir" },
  ],
  [
    { id: "e1", label: "Homestay", paidById: "m-0", amountInr: 6000, category: "Stay" },
    { id: "e2", label: "Cab", paidById: "m-1", amountInr: 3000, category: "Transit" },
  ]
);
assert(ledger.totalSpendInr === 9000, `Expected totalSpend=9000, got ${ledger.totalSpendInr}`);
assert(ledger.equalShareInr === 3000, `Expected equalShare=3000, got ${ledger.equalShareInr}`);
assert(ledger.transfers.length === 1, `Expected exactly 1 simplified transfer, got ${ledger.transfers.length}`);
assert(
  ledger.transfers[0].fromName === "Kabir" &&
    ledger.transfers[0].toName === "Aarav" &&
    ledger.transfers[0].amountInr === 3000,
  "Simplified transfer should be Kabir -> Aarav ₹3,000"
);
console.log("✓ FairShare minimum-transfer settlement math verified.\n");

// 10. Interactive Border & Permit Readiness Engine
console.log("10. Testing Interactive Border & Permit Readiness Engine...");
const bhutanAadhaar = evaluateBorderReadiness({
  country: "BT",
  route: bhutanRoute,
  idDocument: "aadhaar-only",
  entryMode: "overland",
  bringingOwnVehicle: true,
  durationDays: 5,
});
assert(bhutanAadhaar.status === "blocked", "Bhutan with Aadhaar must be blocked");
assert(
  bhutanAadhaar.extraVehicleFeeInr === 18000,
  `Expected Bhutan 4-day Green Tax ₹18,000, got ${bhutanAadhaar.extraVehicleFeeInr}`
);

const nepalRoute = SUBCONTINENT_ROUTES.find((r) => r.country === "NP")!;
const nepalAirAadhaar = evaluateBorderReadiness({
  country: "NP",
  route: nepalRoute,
  idDocument: "aadhaar-only",
  entryMode: "air",
  bringingOwnVehicle: false,
  durationDays: 6,
});
assert(nepalAirAadhaar.status === "blocked", "Nepal air entry with Aadhaar must be blocked");

const nepalOverlandCar = evaluateBorderReadiness({
  country: "NP",
  route: nepalRoute,
  idDocument: "voter-id",
  entryMode: "overland",
  bringingOwnVehicle: true,
  durationDays: 6,
});
assert(nepalOverlandCar.status === "ready", "Nepal overland with Voter ID must be ready");
assert(
  nepalOverlandCar.extraVehicleFeeInr === 3000,
  `Expected Nepal 6-day Bhansar ₹3,000, got ${nepalOverlandCar.extraVehicleFeeInr}`
);
console.log("✓ Border & Permit Readiness rules verified.\n");

console.log("🎉 All Audit Tests Passed with 100% Integrity!");
