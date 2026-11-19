"use client";

import React, { useState, useEffect, useRef } from "react";
import { CurrencyCode, SubcontinentRoute } from "@/types/route";
import {
  formatPreferredCurrency,
  generateUpiDeepLink,
  generateWhatsAppGroupShareText,
  isValidUpiVpa,
} from "@/lib/engine/calculator";
import { Modal } from "@/components/ui/Modal";
import { X, Users, Share2, Smartphone, ArrowRight, Plus, Trash2, AlertCircle } from "lucide-react";

interface FairShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: SubcontinentRoute;
  perPersonBudgetInr: number;
  travelersCount: number;
  currencyPref?: CurrencyCode;
}

interface GroupVoteMember {
  id: string;
  name: string;
  budgetCap: number;
  wakeUp: string;
}

export function FairShareModal({
  isOpen,
  onClose,
  route,
  perPersonBudgetInr,
  travelersCount,
  currencyPref = "INR",
}: FairShareModalProps) {
  const [payeeVpa, setPayeeVpa] = useState("travellead@okhdfcbank");
  const [payeeName, setPayeeName] = useState("Trip Organizer");
  const [shareCopied, setShareCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const [members, setMembers] = useState<GroupVoteMember[]>([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendBudget, setNewFriendBudget] = useState<string>(String(perPersonBudgetInr));

  // Sync realistic initial roster to travelersCount when opened
  useEffect(() => {
    if (!isOpen) return;
    const count = Math.max(1, travelersCount);
    const initial: GroupVoteMember[] = [{ id: "m-0", name: "You (Organizer)", budgetCap: perPersonBudgetInr, wakeUp: "8:00 AM" }];
    for (let i = 1; i < count; i++) {
      initial.push({
        id: `m-${i}`,
        name: `Co-Traveler ${i + 1}`,
        budgetCap: Math.max(5000, perPersonBudgetInr + (i % 2 === 0 ? 2000 : -1500)),
        wakeUp: i % 2 === 0 ? "7:30 AM" : "9:30 AM",
      });
    }
    setMembers(initial);
    setNewFriendBudget(String(perPersonBudgetInr));
  }, [isOpen, travelersCount, perPersonBudgetInr]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const lowestCap = members.length > 0 ? Math.min(...members.map((m) => m.budgetCap)) : perPersonBudgetInr;
  const groupAligned = lowestCap >= perPersonBudgetInr;
  const vpaValid = isValidUpiVpa(payeeVpa);

  const canonicalRouteUrl = `https://desiroute.in/?route=${encodeURIComponent(route.id)}`;
  const whatsappTextEncoded = generateWhatsAppGroupShareText({
    routeTitle: route.title,
    durationDays: route.durationDays,
    totalPerPersonInr: perPersonBudgetInr,
    routeUrl: canonicalRouteUrl,
    pureVegGuaranteed: true,
  });
  const whatsappUrl = `https://wa.me/?text=${whatsappTextEncoded}`;

  const upiLink = generateUpiDeepLink({
    payeeVpa,
    payeeName,
    amount: perPersonBudgetInr,
    transactionNote: `${route.destination} Split`,
  });

  const handleCopyText = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(decodeURIComponent(whatsappTextEncoded));
        setShareCopied(true);
        if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setShareCopied(false), 2500);
      } catch {
        // Fallback ignored gracefully
      }
    }
  };

  const handleAddFriend = (e: React.FormEvent) => {
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
            Mode 1 • Group Consensus Engine
          </span>
          <h3 id="fairshare-modal-title" className="text-xl sm:text-2xl font-black text-slate-950 dark:text-slate-50">
            FairShare Concierge
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
        Calibrate group budgets transparently, identify lowest shared cap, and settle shares instantly via native NPCI UPI deep-links.
      </p>

      {/* Feature 1: WhatsApp Group Invite */}
      <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span aria-hidden="true">📲</span> 1-Click WhatsApp Trip Summary
          </h4>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Zero Login Required
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3.5 leading-relaxed">
          Send this transparent cost breakdown and route link to your WhatsApp group before booking tickets.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all tactile-button-3d"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span>Share on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={handleCopyText}
            className="py-2.5 px-3.5 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all tactile-button-3d"
          >
            {shareCopied ? "✓ Summary Copied!" : "Copy Summary"}
          </button>
        </div>
      </div>

      {/* Feature 2: Interactive Group Consensus Roster */}
      <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 mb-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
            Group Budget Ceiling Check ({members.length} Members)
          </h4>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
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

        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
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
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
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

        {/* Add Friend Inline Form */}
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
            className="py-2 px-3 rounded-xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Feature 3: Native Indian UPI Deep-Link Settlement */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/20 space-y-3">
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Native 1-Tap UPI Settlement (GPay / PhonePe / Paytm)
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Verify organizer VPA below to settle {formatPreferredCurrency(perPersonBudgetInr, currencyPref)} split cleanly.
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
            Enter a valid UPI VPA format (e.g., name@okaxis). Fallback protected.
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <a
            href={vpaValid ? upiLink : undefined}
            aria-disabled={!vpaValid}
            onClick={(e) => {
              if (!vpaValid) e.preventDefault();
            }}
            className={`py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs tactile-button-3d ${
              vpaValid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Pay {formatPreferredCurrency(perPersonBudgetInr, currencyPref)} via UPI</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <p className="text-[10px] font-mono text-slate-500 truncate max-w-xs" title={upiLink}>
            RFC: <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded">{upiLink}</code>
          </p>
        </div>
      </div>
    </Modal>
  );
}
