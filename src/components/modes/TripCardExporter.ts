import { CostBreakdown, CurrencyCode, SubcontinentRoute, TravelMonth, TravelStyle } from "@/types/route";
import { TransitMode } from "@/types/transit";
import { formatPreferredCurrency } from "@/lib/engine/calculator";

export interface TripCardExportInput {
  route: SubcontinentRoute;
  originName: string;
  activeTransitMode: TransitMode;
  selectedMonth: TravelMonth;
  style: TravelStyle;
  travelersCount: number;
  childCount: number;
  breakdown: CostBreakdown;
  perPersonCostInr: number;
  detourApplied: boolean;
  pureVegFilter: boolean;
  currencyPref: CurrencyCode;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generates a high-contrast 1080x1350 visual Trip Cost Card PNG directly via
 * HTML5 Canvas (zero external libraries or network calls) and triggers download.
 */
export function downloadTripSummaryCardPng(input: TripCardExportInput): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const {
    route,
    originName,
    activeTransitMode,
    selectedMonth,
    style,
    travelersCount,
    childCount,
    breakdown,
    perPersonCostInr,
    detourApplied,
    pureVegFilter,
    currencyPref,
  } = input;

  // Deep Himalayan obsidian gradient backdrop
  const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, "#090d16");
  bg.addColorStop(0.55, "#0f172a");
  bg.addColorStop(1, "#0b1929");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);

  // Subtle ambient glow circles
  const glow1 = ctx.createRadialGradient(900, 180, 20, 900, 180, 420);
  glow1.addColorStop(0, "rgba(6, 182, 212, 0.22)");
  glow1.addColorStop(1, "rgba(6, 182, 212, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, 1080, 1350);

  const glow2 = ctx.createRadialGradient(180, 1180, 20, 180, 1180, 420);
  glow2.addColorStop(0, "rgba(16, 185, 129, 0.18)");
  glow2.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, 1080, 1350);

  // Outer card frame
  drawRoundedRect(ctx, 56, 56, 968, 1238, 42);
  ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
  ctx.fill();
  ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Brand top row
  ctx.fillStyle = "#38bdf8";
  ctx.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("DESIROUTE OS  ·  SUBCONTINENT TRIP BRIEF", 104, 126);

  // Corridor title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 54px system-ui, -apple-system, sans-serif";
  ctx.fillText(route.destination, 104, 204);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 26px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `${originName} → ${route.region}  ·  ${route.durationDays} Days  ·  ${selectedMonth}  ·  ${activeTransitMode.toUpperCase()}`,
    104,
    254
  );

  // Status tags row
  const tags: { text: string; bg: string; fg: string }[] = [
    { text: `${style.toUpperCase()} TIER`, bg: "rgba(56,189,248,0.16)", fg: "#7dd3fc" },
    {
      text: `${travelersCount} ADULT${travelersCount > 1 ? "S" : ""}${childCount > 0 ? ` + ${childCount} CHILD` : ""}`,
      bg: "rgba(148,163,184,0.16)",
      fg: "#e2e8f0",
    },
  ];
  if (pureVegFilter) {
    tags.push({ text: "PURE VEG VERIFIED", bg: "rgba(16,185,129,0.18)", fg: "#6ee7b7" });
  }
  if (detourApplied) {
    tags.push({ text: "BHEED SE DOOR SWAP", bg: "rgba(245,158,11,0.18)", fg: "#fcd34d" });
  }

  let tagX = 104;
  ctx.font = "700 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  for (const tag of tags) {
    const textW = ctx.measureText(tag.text).width;
    const pillW = textW + 34;
    if (tagX + pillW > 976) break;
    drawRoundedRect(ctx, tagX, 286, pillW, 44, 12);
    ctx.fillStyle = tag.bg;
    ctx.fill();
    ctx.fillStyle = tag.fg;
    ctx.fillText(tag.text, tagX + 17, 315);
    tagX += pillW + 14;
  }

  // Hero Rupee Total Box
  drawRoundedRect(ctx, 104, 366, 872, 210, 28);
  ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("ALL-IN ESTIMATE PER PERSON", 142, 420);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 84px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(formatPreferredCurrency(perPersonCostInr, currencyPref), 142, 512);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(
    `GROUP TOTAL: ${formatPreferredCurrency(breakdown.total, currencyPref)}  ·  PER DAY: ${formatPreferredCurrency(
      Math.round(perPersonCostInr / Math.max(1, route.durationDays)),
      currencyPref
    )}`,
    142,
    556
  );

  // Itemized Breakdown Bars
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "700 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("ITEMIZED RUPEE SPLIT (GROUP)", 104, 634);

  const safeTotal = Math.max(1, breakdown.total);
  const rows = [
    { label: "Stays & Homestays", amount: breakdown.stays, color: "#06b6d4" },
    { label: `All-In Transit (${activeTransitMode.toUpperCase()} + Local)`, amount: breakdown.transit, color: "#6366f1" },
    { label: "Pure Veg / Mountain Dining", amount: breakdown.food, color: "#10b981" },
    { label: "Permits & Bhutan SDF", amount: breakdown.permitsAndFees, color: "#f59e0b" },
    { label: "Experiences & Activities", amount: breakdown.activities, color: "#a855f7" },
    { label: "Safety & Weather Buffer", amount: breakdown.buffer, color: "#64748b" },
  ];

  let rowY = 672;
  for (const row of rows) {
    const pct = Math.min(100, Math.round((row.amount / safeTotal) * 100));
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "600 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(row.label, 104, rowY + 24);

    const valueText = `${formatPreferredCurrency(row.amount, currencyPref)} (${pct}%)`;
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
    const valW = ctx.measureText(valueText).width;
    ctx.fillText(valueText, 976 - valW, rowY + 24);

    // Track
    drawRoundedRect(ctx, 104, rowY + 38, 872, 16, 8);
    ctx.fillStyle = "rgba(51, 65, 85, 0.7)";
    ctx.fill();

    // Fill
    const fillW = Math.max(12, Math.round((872 * pct) / 100));
    drawRoundedRect(ctx, 104, rowY + 38, fillW, 16, 8);
    ctx.fillStyle = row.color;
    ctx.fill();

    rowY += 76;
  }

  // Permit & Elevation Footer Strip
  drawRoundedRect(ctx, 104, 1142, 872, 92, 20);
  ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#6ee7b7";
  ctx.font = "700 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(
    `MAX ALTITUDE: ${route.altitudeMeters ?? 1400}M   ·   PERMIT: ${route.permitRule.name.slice(0, 34)}`,
    132,
    1184
  );
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 19px system-ui, -apple-system, sans-serif";
  ctx.fillText("100% Transparent Estimate · Zero Agency Markups · desiroute.in", 132, 1216);

  const link = document.createElement("a");
  link.download = `desiroute-${route.slug}-${activeTransitMode}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  return true;
}
