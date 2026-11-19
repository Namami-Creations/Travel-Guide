import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-[2rem] visionos-glass-elevated border border-slate-200/80 dark:border-slate-800 text-center space-y-5">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
            404 • Off the Mapped Trail
          </span>
          <h1 className="text-2xl font-black text-slate-950 dark:text-slate-50">
            Corridor Not Found
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Even the best detourists lose a trail marker sometimes. Return to the Rupee Budget Calculator or browse our Magazine.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="py-2.5 px-4 rounded-xl bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 tactile-button-3d"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculator</span>
          </Link>
          <Link
            href="/articles"
            className="py-2.5 px-4 rounded-xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs font-bold"
          >
            Browse Magazine
          </Link>
        </div>
      </div>
    </main>
  );
}
