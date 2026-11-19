"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  CostBreakdown,
  CurrencyCode,
  SubcontinentRoute,
  TravelMonth,
  TravelStyle,
} from "@/types/route";
import { TransitMode } from "@/types/transit";
import {
  formatPreferredCurrency,
  generateUpiDeepLink,
  generateWhatsAppGroupShareText,
  isValidUpiVpa,
} from "@/lib/engine/calculator";
import {
  GroupExpenseItem,
  simplifyGroupDebts,
} from "@/lib/engine/trip-utils";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { downloadTripSummaryCardPng } from "@/components/modes/TripCardExporter";
import { Modal } from "@/components/ui/Modal";
import {
  X,
  Users,
  Share2,
  Smartphone,
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle,
  Link2,
  Download,
  Receipt,
  Check,
} from "lucide-react";

interface FairShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: SubcontinentRoute;
  originName: string;
  activeTransitMode: TransitMode;
  selectedMonth: TravelMonth;
  travelStyle: TravelStyle;
  perPersonBudgetInr: number;
  travelersCount: number;
  childCount: number;
  breakdown: CostBreakdown;
  detourApplied: boolean;
  pureVegFilter: boolean;
  shareableUrl: string;
  currencyPref?: CurrencyCode;
}

interface GroupVoteMember {
  id: string;
  name: string;
  budgetCap: number;
  wakeUp: string;
}

function buildInitialRoster(travelersCount: number, perPersonBudgetInr: number): GroupVoteMember[] {
  const count = Math.max(1, travelersCount);
  const initial: GroupVoteMember[] = [
    { id: "m-0", name: "You (Organizer)", budgetCap: perPersonBudgetInr, wakeUp: "8:00 AM" },
  ];
  for (let i = 1; i < count; i++) {
    initial.push({
      id: `m-${i}`,
      name: `Co-Traveler ${i + 1}`,
      budgetCap: Math.max(5000, perPersonBudgetInr + (i % 2 === 0 ? 2000 : -1500)),
      wakeUp: i % 2 === 0 ? "7:30 AM" : "9:30 AM",
    });
  }
  return initial;
}

export function FairShareModal(props: FairShareModalProps) {
  if (!props.isOpen) return null;
  return (
    <FairShareModalContent
      key={`${props.route.id}-${props.travelersCount}-${props.perPersonBudgetInr}`}
      {...props}
    />
  );
}

function FairShareModalContent({
  isOpen,
  onClose,
  route,
  originName,
  activeTransitMode,
  selectedMonth,
  travelStyle,
  perPersonBudgetInr,
  travelersCount,
  childCount,
  breakdown,
  detourApplied,
  pureVegFilter,
  shareableUrl,
  currencyPref = "INR",
}: FairShareModalProps) {
  const { expensesByRoute, addRouteExpense, removeRouteExpense } = useDesiRoute();
  const [activeSubTab, setActiveSubTab] = useState<"consensus" | "ledger">("consensus");
  const [payeeVpa, setPayeeVpa] = useState("travellead@okhdfcbank");
  const [payeeName, setPayeeName] = useState("Trip Organizer");
  const [shareCopied, setShareCopied] = useState<"summary" | "link" | "card" | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const [members, setMembers] = useState<GroupVoteMember[]>(() =>
    buildInitialRoster(travelersCount, perPersonBudgetInr)
  );
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendBudget, setNewFriendBudget] = useState<string>(String(perPersonBudgetInr));

  // Expense Ledger form state
  const [expenseLabel, setExpenseLabel] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] =
    useState<GroupExpenseItem["category"]>("Transit");
  const [expensePayerId, setExpensePayerId] = useState("m-0");

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const flashCopied = (kind: "summary" | "link" | "card") => {
    setShareCopied(kind);
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setShareCopied(null), 2400);
  };

  const lowestCap = members.length > 0 ? Math.min(...members.map((m) => m.budgetCap)) : perPersonBudgetInr;
  const groupAligned = lowestCap >= perPersonBudgetInr;
  const vpaValid = isValidUpiVpa(payeeVpa);

  const whatsappTextEncoded = generateWhatsAppGroupShareText({
    routeTitle: `${route.title} (${originName} · ${activeTransitMode.toUpperCase()})`,
    durationDays: route.durationDays,
    totalPerPersonInr: perPersonBudgetInr,
    routeUrl: shareableUrl,
    pureVegGuaranteed: pureVegFilter,
  });
  const whatsappUrl = `https://wa.me/?text=${whatsappTextEncoded}`;

  const upiLink = generateUpiDeepLink({
    payeeVpa,
    payeeName,
    amount: perPersonBudgetInr,
    transactionNote: `${route.destination} Split`,
  });

  const routeExpenses = expensesByRoute[route.id] ?? [];
  const ledgerSummary = simplifyGroupDebts(
    members.map((m) => ({ id: m.id, name: m.name })),
    routeExpenses
  );

  const handleCopySummary = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(decodeURIComponent(whatsappTextEncoded));
        flashCopied("summary");
      } catch {
        // Ignored gracefully
      }
    }
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        flashCopied("link");
      } catch {
        // Ignored gracefully
      }
    }
  };

  const handleExportCard = () => {
    const ok = downloadTripSummaryCardPng({
      route,
      originName,
      activeTransitMode,
      selectedMonth,
      style: travelStyle,
      travelersCount,
      childCount,
      breakdown,
      perPersonCostInr: perPersonBudgetInr,
      detourApplied,
      pureVegFilter,
      currencyPref,
    });
    if (ok) flashCopied("card");
  };

  const handleAddFriend = (e: FormEvent) => {
    e.preventDefault();
    const cleanedName = newFriendName.trim();
    const parsedCap = parseInt(newFriendBudget, 10);
    if (!cleanedName || !Number.isFinite(parsedCap) || parsedCap < 1000) return;

    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: cleanedName.slice(0, 32),
        budgetCap: parsedCap,
        wakeUp: "8:30 AM",
      },
    ]);
    setNewFriendName("");
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
  };

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = expenseLabel.trim();
    const amountNum = Math.round(Number(expenseAmount));
    if (!cleaned || !Number.isFinite(amountNum) || amountNum <= 0) return;

    const validPayer = members.some((m) => m.id === expensePayerId)
      ? expensePayerId
      : members[0]?.id ?? "m-0";

    addRouteExpense(route.id, {
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: cleaned.slice(0, 48),
      paidById: validPayer,
      amountInr: amountNum,
      category: expenseCategory,
    });
    setExpenseLabel("");
    setExpenseAmount("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="fairshare-modal-title">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full visionos-glass text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        aria-label="Close FairShare Modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs">
          <Users className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-extrabold">
            Mode 1 • Group Consensus & Live Splitwise Vault
          </span>
          <h3 id="fairshare-modal-title" className="text-xl sm:text-2xl font-black text-slate-950 dark:text-slate-50">
            FairShare Concierge
          </h3>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 mb-5 mt-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("consensus")}
          aria-pressed={activeSubTab === "consensus"}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "consensus"
              ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Consensus & Share</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("ledger")}
          aria-pressed={activeSubTab === "ledger"}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "ledger"
              ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            Live Expense Ledger ({routeExpenses.length})
          </span>
        </button>
      </div>

      {activeSubTab === "consensus" && (
        <div className="space-y-5">
          {/* Stateful Share & Visual Trip Cost Card Export */}
          <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                Share Exact Trip Plan & Export Visual Card
              </h4>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Stateful Link
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Your link preserves origin ({originName}), {activeTransitMode.toUpperCase()} mode, {selectedMonth} season, {travelersCount} adults, and {detourApplied ? "Bheed Se Door swap" : "base corridor"}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all tactile-button-3d whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>WhatsApp Group</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all tactile-button-3d whitespace-nowrap"
              >
                {shareCopied === "link" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Trip Link</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportCard}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{shareCopied === "card" ? "PNG Saved!" : "Trip Card PNG"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {shareCopied === "summary" ? "✓ Full WhatsApp text summary copied to clipboard" : "Copy formatted text summary instead"}
            </button>
          </div>

          {/* Interactive Group Consensus Roster */}
          <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                Group Budget Ceiling Check ({members.length} Members)
              </h4>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  groupAligned
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                }`}
              >
                {groupAligned
                  ? "All Budgets Aligned"
                  : `Lowest Cap: ${formatPreferredCurrency(lowestCap, currencyPref)}`}
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {members.map((m, i) => {
                const fits = m.budgetCap >= perPersonBudgetInr;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{m.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono">Wake: {m.wakeUp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                        {formatPreferredCurrency(m.budgetCap, currencyPref)}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          fits
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {fits ? "Fits" : "Over Cap"}
                      </span>
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                          aria-label={`Remove ${m.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Add friend name (e.g., Kabir)"
                aria-label="Friend name"
                className="flex-1 text-xs p-2 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
              <input
                type="number"
                min={1000}
                max={200000}
                step={500}
                value={newFriendBudget}
                onChange={(e) => setNewFriendBudget(e.target.value)}
                placeholder="Cap (₹)"
                aria-label="Friend budget cap in INR"
                className="w-full sm:w-28 text-xs font-mono p-2 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                className="py-2 px-3 rounded-xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Native Indian UPI Deep-Link Settlement */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/20 space-y-3">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Native 1-Tap UPI Pool Deposit (GPay / PhonePe / Paytm)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Verify organizer VPA below to collect {formatPreferredCurrency(perPersonBudgetInr, currencyPref)} per person cleanly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={payeeVpa}
                onChange={(e) => setPayeeVpa(e.target.value)}
                placeholder="organizer@okhdfcbank"
                className={`text-xs font-mono p-2.5 rounded-xl visionos-glass border text-slate-900 dark:text-slate-100 ${
                  vpaValid ? "border-slate-300 dark:border-slate-700" : "border-rose-500"
                }`}
                aria-label="Organizer UPI ID (VPA)"
              />
              <input
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Payee Name"
                className="text-xs p-2.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                aria-label="Organizer Name"
              />
            </div>

            {!vpaValid && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Enter a valid UPI VPA format (e.g., name@okaxis).
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <a
                href={vpaValid ? upiLink : undefined}
                aria-disabled={!vpaValid}
                onClick={(e) => {
                  if (!vpaValid) e.preventDefault();
                }}
                className={`py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs tactile-button-3d whitespace-nowrap ${
                  vpaValid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Pay {formatPreferredCurrency(perPersonBudgetInr, currencyPref)} via UPI</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <p className="text-[10px] font-mono text-slate-500 truncate max-w-xs" title={upiLink}>
                NPCI: <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded">{upiLink}</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "ledger" && (
        <div className="space-y-5">
          {/* Add Expense Form */}
          <form
            onSubmit={handleAddExpense}
            className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                Log Shared Trip Expense (Local-First Vault)
              </h4>
              <span className="text-[10px] font-mono font-bold text-slate-500 tabular-nums">
                Total Logged: {formatPreferredCurrency(ledgerSummary.totalSpendInr, currencyPref)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={expenseLabel}
                onChange={(e) => setExpenseLabel(e.target.value)}
                placeholder="e.g., Bhuntar Taxi / Dhaba Lunch / SDF Fee"
                aria-label="Expense description"
                className="sm:col-span-5 text-xs p-2.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
              <input
                type="number"
                min={1}
                max={500000}
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount (₹)"
                aria-label="Expense amount in INR"
                className="sm:col-span-3 text-xs font-mono p-2.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
              <select
                value={expensePayerId}
                onChange={(e) => setExpensePayerId(e.target.value)}
                aria-label="Paid by member"
                className="sm:col-span-2 text-xs p-2.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={expenseCategory}
                onChange={(e) =>
                  setExpenseCategory(e.target.value as GroupExpenseItem["category"])
                }
                aria-label="Expense category"
                className="sm:col-span-2 text-xs p-2.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Transit">Transit</option>
                <option value="Stay">Stay</option>
                <option value="Food">Food</option>
                <option value="Permit">Permit</option>
                <option value="Activity">Activity</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all tactile-button-3d"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Expense to {route.destination} Ledger</span>
            </button>
          </form>

          {/* Logged Expenses List */}
          <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100">
                Recorded Expenses ({routeExpenses.length})
              </h4>
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                Equal Share: {formatPreferredCurrency(ledgerSummary.equalShareInr, currencyPref)} / pax
              </span>
            </div>

            {routeExpenses.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No expenses logged yet for {route.destination}. Add shared cab, fuel, stay, or dhaba bills above to auto-calculate minimal UPI settlements.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {routeExpenses.map((exp) => {
                  const payerName =
                    members.find((m) => m.id === exp.paidById)?.name ?? "Group Member";
                  return (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">
                          {exp.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {exp.category} · Paid by {payerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                          {formatPreferredCurrency(exp.amountInr, currencyPref)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRouteExpense(route.id, exp.id)}
                          aria-label={`Delete expense ${exp.label}`}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimum-Transfer Simplified Settlements */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/25 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Simplified Minimum-Transfer UPI Settlements</span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                {ledgerSummary.transfers.length} transfer{ledgerSummary.transfers.length === 1 ? "" : "s"}
              </span>
            </h4>

            {ledgerSummary.transfers.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Everyone is settled up — zero transfers required.
              </p>
            ) : (
              <div className="space-y-2">
                {ledgerSummary.transfers.map((t) => {
                  const settleUpi = generateUpiDeepLink({
                    payeeVpa,
                    payeeName: t.toName,
                    amount: t.amountInr,
                    transactionNote: `${route.destination} Settle`,
                  });
                  return (
                    <div
                      key={`${t.fromId}-${t.toId}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/80 dark:bg-slate-900/75 border border-emerald-500/20 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          {t.fromName}
                        </span>{" "}
                        <span className="text-slate-500">pays</span>{" "}
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          {t.toName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black tabular-nums text-slate-950 dark:text-slate-50">
                          {formatPreferredCurrency(t.amountInr, currencyPref)}
                        </span>
                        <a
                          href={vpaValid ? settleUpi : undefined}
                          onClick={(e) => {
                            if (!vpaValid) e.preventDefault();
                          }}
                          className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold whitespace-nowrap"
                        >
                          Settle UPI
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
