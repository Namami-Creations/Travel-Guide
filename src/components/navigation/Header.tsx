"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mountain,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Calculator,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import { CountryCode } from "@/types/route";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";

interface HeaderProps {
  selectedCountry?: CountryCode | "ALL";
  onSelectCountry?: (country: CountryCode | "ALL") => void;
  pureVegFilter?: boolean;
  onTogglePureVeg?: () => void;
}

export function Header({
  selectedCountry,
  onSelectCountry,
  pureVegFilter = false,
  onTogglePureVeg,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useDesiRoute();

  const countries: { code: CountryCode | "ALL"; label: string; flag: string }[] = [
    { code: "ALL", label: "All", flag: "🌏" },
    { code: "IN", label: "India", flag: "🇮🇳" },
    { code: "NP", label: "Nepal", flag: "🇳🇵" },
    { code: "BT", label: "Bhutan", flag: "🇧🇹" },
  ];

  const navLinks = [
    { href: "/", label: "Calculator", icon: Calculator },
    { href: "/articles", label: "Magazine", icon: BookOpen },
    { href: "/help", label: "Help & Permits", icon: HelpCircle },
    { href: "/about", label: "About", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-3.5 z-40 w-full max-w-6xl mx-auto px-4 sm:px-6 print:hidden">
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between gap-3 p-3 sm:px-5 rounded-[1.75rem] visionos-glass border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-black/50 transition-all duration-300"
      >
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <Mountain className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-950 dark:text-slate-50 text-base sm:text-lg flex items-center gap-1.5">
                DesiRoute{" "}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
                  Himalayas
                </span>
              </span>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono -mt-0.5 hidden sm:flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Live Subcontinent OS
              </p>
            </div>
          </Link>
        </div>

        {/* Primary Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-white/60 dark:border-white/10 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-md dark:bg-slate-900 dark:text-cyan-400 font-black shadow-slate-300/40 dark:shadow-black/50"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Country Selector (When on Calculator Page) */}
        {selectedCountry && onSelectCountry && (
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 shadow-inner">
            {countries.map((c) => {
              const isActive = selectedCountry === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-md dark:bg-slate-900 dark:text-slate-50 font-black"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                  aria-pressed={isActive}
                >
                  <span aria-hidden="true">{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {settings.ghostMode && (
            <Link
              href="/settings"
              title="Ghost Mode active (Zero persistence)"
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
            >
              <EyeOff className="w-3 h-3" aria-hidden="true" />
              <span>Ghost</span>
            </Link>
          )}

          {onTogglePureVeg && (
            <button
              type="button"
              onClick={onTogglePureVeg}
              aria-pressed={pureVegFilter}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all tactile-button-3d ${
                pureVegFilter
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/20"
                  : "visionos-glass text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Pure Vegetarian & Jain Food Filter"
            >
              <span aria-hidden="true">🌿</span>
              <span className="hidden sm:inline">Pure Veg</span>
            </button>
          )}

          <Link
            href="/profile"
            aria-current={pathname === "/profile" ? "page" : undefined}
            className={`p-2 rounded-xl border transition-all tactile-button-3d ${
              pathname === "/profile"
                ? "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:bg-cyan-950/60 dark:text-cyan-400"
                : "visionos-glass text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
            title="User Account & Saved Trips"
            aria-label="Profile"
          >
            <User className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            href="/settings"
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={`p-2 rounded-xl border transition-all tactile-button-3d ${
              pathname === "/settings"
                ? "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:bg-cyan-950/60 dark:text-cyan-400"
                : "visionos-glass text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
            title="Settings & Privacy Vault"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl visionos-glass text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl visionos-glass-elevated border border-slate-200 dark:border-slate-800 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-bold ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span>My Trips</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Settings & Privacy</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
