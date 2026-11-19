"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route Error Boundary caught:", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-[2rem] visionos-glass-elevated border border-rose-500/30 text-center space-y-5">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-950 dark:text-slate-50">
            Trail Disruption Detected
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A temporary rendering fault interrupted this screen. Your offline trip settings remain safe.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="py-2.5 px-4 rounded-xl bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 tactile-button-3d"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Segment</span>
          </button>
          <Link
            href="/"
            className="py-2.5 px-4 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Base Camp</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
