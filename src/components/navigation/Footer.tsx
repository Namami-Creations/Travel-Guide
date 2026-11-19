import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 mt-8 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 print:hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-extrabold text-slate-900 dark:text-slate-100">
            DesiRoute OS • Subcontinent Edition
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Built for travelers across India, Nepal & Bhutan. Zero sponsored placement bias.
          </p>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Calculator
          </Link>
          <Link href="/articles" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Magazine
          </Link>
          <Link href="/help" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Help & Permits
          </Link>
          <Link href="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Manifesto
          </Link>
          <Link href="/profile" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Saved Trips
          </Link>
          <Link href="/settings" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Privacy Vault
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <span>INR / BTN 1:1</span>
          <span aria-hidden="true">•</span>
          <span>1 INR = 1.60 NPR</span>
          <span aria-hidden="true">•</span>
          <span>DPDP 2023 Compliant</span>
        </div>
      </div>
    </footer>
  );
}
