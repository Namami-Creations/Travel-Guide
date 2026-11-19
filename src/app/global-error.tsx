"use client";

import React from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  console.error("Global Error Boundary:", error);
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-xl">
          <h1 className="text-xl font-black">DesiRoute OS Recovery Mode</h1>
          <p className="text-xs text-slate-500">
            An unexpected application error occurred. Reload this route to restore your session.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="py-2.5 px-5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
