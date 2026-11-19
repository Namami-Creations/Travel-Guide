import { CountryCode, SubcontinentRoute, TravelMonth, TravelStyle } from "@/types/route";
import { TransitMode } from "@/types/transit";

export interface ShareableTripConfig {
  routeId: string;
  originId: string;
  mode: TransitMode;
  month: TravelMonth;
  style: TravelStyle;
  adults: number;
  children: number;
  detourApplied: boolean;
}

const VALID_MODES = new Set<TransitMode>(["train", "bus", "car", "bike", "flight"]);
const VALID_STYLES = new Set<TravelStyle>(["backpacker", "comfort", "luxury"]);
const VALID_MONTHS = new Set<TravelMonth>([
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]);

/**
 * Encodes full trip planner configuration into a shareable canonical URL
 * so friends opening a WhatsApp link see the exact configured budget & mode.
 */
export function buildShareableTripUrl(
  config: ShareableTripConfig,
  baseOrigin = "https://desiroute.in"
): string {
  const params = new URLSearchParams();
  params.set("route", config.routeId);
  params.set("origin", config.originId);
  params.set("mode", config.mode);
  params.set("month", config.month);
  params.set("style", config.style);
  params.set("adults", String(Math.max(1, Math.min(20, Math.round(config.adults)))));
  if (config.children > 0) {
    params.set("children", String(Math.max(0, Math.min(10, Math.round(config.children)))));
  }
  if (config.detourApplied) {
    params.set("detour", "1");
  }
  return `${baseOrigin.replace(/\/$/, "")}/?${params.toString()}`;
}

export interface ParsedTripQuery {
  routeId?: string;
  originId?: string;
  mode?: TransitMode;
  month?: TravelMonth;
  style?: TravelStyle;
  adults?: number;
  children?: number;
  detourApplied?: boolean;
  tab?: "planner" | "magazine";
}

export function parseTripQueryParams(
  params: Pick<URLSearchParams, "get">,
  validRouteIds: Set<string>,
  validOriginIds: Set<string>
): ParsedTripQuery {
  const out: ParsedTripQuery = {};

  const route = params.get("route");
  if (route && validRouteIds.has(route)) out.routeId = route;

  const origin = params.get("origin");
  if (origin && validOriginIds.has(origin)) out.originId = origin;

  const mode = params.get("mode") as TransitMode | null;
  if (mode && VALID_MODES.has(mode)) out.mode = mode;

  const month = params.get("month") as TravelMonth | null;
  if (month && VALID_MONTHS.has(month)) out.month = month;

  const style = params.get("style") as TravelStyle | null;
  if (style && VALID_STYLES.has(style)) out.style = style;

  const adultsRaw = params.get("adults");
  if (adultsRaw) {
    const parsed = parseInt(adultsRaw, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 20) out.adults = parsed;
  }

  const childrenRaw = params.get("children");
  if (childrenRaw) {
    const parsed = parseInt(childrenRaw, 10);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 10) out.children = parsed;
  }

  if (params.get("detour") === "1") out.detourApplied = true;
  if (params.get("tab") === "magazine") out.tab = "magazine";

  return out;
}

// -----------------------------------------------------------------------------
// FairShare Live Expense Ledger & Minimum-Transfer Debt Simplification Engine
// -----------------------------------------------------------------------------

export interface GroupExpenseItem {
  id: string;
  label: string;
  paidById: string;
  amountInr: number;
  category: "Transit" | "Stay" | "Food" | "Permit" | "Activity";
}

export interface GroupSettlementTransfer {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amountInr: number;
}

export interface GroupLedgerSummary {
  totalSpendInr: number;
  equalShareInr: number;
  balances: { memberId: string; name: string; paidInr: number; netInr: number }[];
  transfers: GroupSettlementTransfer[];
}

/**
 * Computes equal-split balances and simplifies group debts into the minimum number
 * of direct UPI transfers between group members.
 */
export function simplifyGroupDebts(
  members: { id: string; name: string }[],
  expenses: GroupExpenseItem[]
): GroupLedgerSummary {
  if (members.length === 0) {
    return { totalSpendInr: 0, equalShareInr: 0, balances: [], transfers: [] };
  }

  const paidByMember = new Map<string, number>();
  members.forEach((m) => paidByMember.set(m.id, 0));

  let totalSpendInr = 0;
  for (const exp of expenses) {
    const amt = Number.isFinite(exp.amountInr) && exp.amountInr > 0 ? Math.round(exp.amountInr) : 0;
    if (amt === 0 || !paidByMember.has(exp.paidById)) continue;
    totalSpendInr += amt;
    paidByMember.set(exp.paidById, (paidByMember.get(exp.paidById) ?? 0) + amt);
  }

  const equalShareExact = totalSpendInr / members.length;
  const equalShareInr = Math.round(equalShareExact);

  const balances = members.map((m) => {
    const paidInr = paidByMember.get(m.id) ?? 0;
    const netInr = Math.round(paidInr - equalShareExact);
    return { memberId: m.id, name: m.name, paidInr, netInr };
  });

  // Greedy min-transfer matching between debtors (net < 0) and creditors (net > 0)
  const debtors = balances
    .filter((b) => b.netInr < -1)
    .map((b) => ({ id: b.memberId, name: b.name, owed: Math.abs(b.netInr) }))
    .sort((a, b) => b.owed - a.owed);

  const creditors = balances
    .filter((b) => b.netInr > 1)
    .map((b) => ({ id: b.memberId, name: b.name, due: b.netInr }))
    .sort((a, b) => b.due - a.due);

  const transfers: GroupSettlementTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const settleAmount = Math.min(debtors[i].owed, creditors[j].due);
    if (settleAmount >= 1) {
      transfers.push({
        fromId: debtors[i].id,
        fromName: debtors[i].name,
        toId: creditors[j].id,
        toName: creditors[j].name,
        amountInr: Math.round(settleAmount),
      });
    }
    debtors[i].owed -= settleAmount;
    creditors[j].due -= settleAmount;
    if (debtors[i].owed <= 1) i++;
    if (creditors[j].due <= 1) j++;
  }

  return { totalSpendInr, equalShareInr, balances, transfers };
}

// -----------------------------------------------------------------------------
// Interactive Border & Permit Readiness Evaluator
// -----------------------------------------------------------------------------

export type IndianIdDocument = "passport" | "voter-id" | "aadhaar-only";
export type BorderEntryMode = "overland" | "air";

export interface BorderReadinessInput {
  country: CountryCode;
  route: SubcontinentRoute;
  idDocument: IndianIdDocument;
  entryMode: BorderEntryMode;
  bringingOwnVehicle: boolean;
  durationDays: number;
}

export interface BorderReadinessResult {
  status: "ready" | "caution" | "blocked";
  headline: string;
  alerts: string[];
  extraVehicleFeeInr: number;
  checklist: string[];
}

export function evaluateBorderReadiness(input: BorderReadinessInput): BorderReadinessResult {
  const { country, route, idDocument, entryMode, bringingOwnVehicle, durationDays } = input;
  const alerts: string[] = [];
  let status: "ready" | "caution" | "blocked" = "ready";
  let extraVehicleFeeInr = 0;
  const checklist = [...route.permitRule.documentsRequired];

  if (country === "BT") {
    if (idDocument === "aadhaar-only") {
      status = "blocked";
      alerts.push(
        "Entry Blocked: Bhutan Immigration rejects Aadhaar cards and Driving Licences. You must carry an Indian Passport (6+ months validity) or Original Election Commission Voter ID."
      );
    }
    if (entryMode === "overland") {
      alerts.push(
        "Overland Tip: Staying strictly within Phuentsholing border town (<24 hrs) is exempt from the ₹1,200/night SDF; crossing Rinchending checkpost triggers full SDF."
      );
    } else {
      alerts.push(
        "Air Entry (Paro PBH): Pre-pay SDF and secure DoI permit approval online before boarding Drukair/Bhutan Airlines."
      );
    }
    if (bringingOwnVehicle) {
      const ridingDays = Math.max(1, durationDays - 1);
      extraVehicleFeeInr = 4500 * ridingDays;
      alerts.push(
        `Private Indian Vehicle Green Tax: ₹4,500/day beyond Phuentsholing (~₹${extraVehicleFeeInr.toLocaleString("en-IN")} for ${ridingDays} days) + mandatory RSTA permit & licensed Bhutanese guide.`
      );
      checklist.push("Original Vehicle RC + Valid PUC + Comprehensive Insurance + Indian DL");
    }
  } else if (country === "NP") {
    if (idDocument === "aadhaar-only") {
      status = entryMode === "air" ? "blocked" : "caution";
      alerts.push(
        entryMode === "air"
          ? "Boarding Denied at Airport: Aadhaar is strictly invalid for flights into Kathmandu (KTM). Carry original Indian Passport or Voter ID."
          : "Overland Risk: Sunauli/Kakarbhitta border officials frequently reject Aadhaar for hotel check-in and checkpoints. Carry original Voter ID or Passport."
      );
    }
    alerts.push(
      "Cash Rule: Carry Indian ₹100 notes or convert to NPR (1 INR = 1.60 NPR) at border banks. Indian ₹500 notes are restricted in Nepal."
    );
    if (bringingOwnVehicle) {
      extraVehicleFeeInr = 500 * durationDays;
      alerts.push(
        `Nepal Bhansar Vehicle Customs Permit: ~₹500/day (~₹${extraVehicleFeeInr.toLocaleString("en-IN")} total) issued at Sunauli/Belahiya customs office.`
      );
      checklist.push("Original Vehicle RC + Bhansar Customs Receipt + Nepal 3rd-Party Border Insurance");
    }
  } else {
    if (route.permitRule.required) {
      status = "caution";
      alerts.push(
        `Domestic Permit Required (${route.permitRule.name}): Carry 2 physical photocopies of Government Photo ID for army/police checkposts.`
      );
    }
    if (bringingOwnVehicle && (route.altitudeMeters ?? 0) >= 2400) {
      alerts.push(
        "High-Altitude Vehicle Prep: Verify hill-grade coolant, spare tyre pressure, and local cab union zones (outer-state commercial yellow-board cabs face restrictions inside Spiti/Ladakh/Sikkim)."
      );
      checklist.push("Physical RC, Insurance, PUC & Snow-Chain / Tow Rope Kit");
    }
  }

  const headline =
    status === "blocked"
      ? "Action Required — Entry Document Blocker Detected"
      : status === "caution"
      ? "Conditional Readiness — Review Border Advisories"
      : "Clear for Departure — Documents Verified";

  return {
    status,
    headline,
    alerts,
    extraVehicleFeeInr,
    checklist: Array.from(new Set(checklist)),
  };
}
