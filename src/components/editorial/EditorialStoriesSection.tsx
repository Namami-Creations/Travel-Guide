"use client";

import { useState } from "react";
import Image from "next/image";
import { EDITORIAL_ARTICLES } from "@/lib/data/editorial-articles";
import { EditorialArticle } from "@/types/article";
import { formatPreferredCurrency } from "@/lib/engine/calculator";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { Modal } from "@/components/ui/Modal";
import { Compass, Clock, ArrowRight, BookOpen, X, Mountain } from "lucide-react";

interface EditorialStoriesSectionProps {
  onSelectRouteFromArticle: (routeId: string) => void;
}

export function EditorialStoriesSection({
  onSelectRouteFromArticle,
}: EditorialStoriesSectionProps) {
  const [activeArticle, setActiveArticle] = useState<EditorialArticle | null>(null);
  const { settings } = useDesiRoute();

  return (
    <section aria-label="Editorial Detourist Guides" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              VisionOS Spatial Journalism
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mt-1">
            Uncrowded Himalayan Guides & Detours
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Researched for solo explorers, Gen Z creators, and anti-tourist-trap travelers. Real topography, authentic AI imagery, and zero sponsored fluff.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 self-start sm:self-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {EDITORIAL_ARTICLES.length} PUBLISHED ESSAYS
        </span>
      </div>

      {/* Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EDITORIAL_ARTICLES.map((art) => (
          <article
            key={art.id}
            className="group rounded-[2rem] visionos-glass border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-300 flex flex-col justify-between spatial-card-3d"
          >
            <div>
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={art.heroImage.src}
                  alt={art.heroImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                  <span className="text-[10px] uppercase font-mono px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md font-extrabold border border-white/20">
                    {art.category}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-600/80 text-white backdrop-blur-md flex items-center gap-1 border border-white/20">
                    <Mountain className="w-3 h-3" aria-hidden="true" />
                    <span>{art.heroImage.elevationMeters}m Alt</span>
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                  ⏱️ Best: {art.heroImage.bestUncrowdedWindow}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{art.author.name}</span>
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-500" aria-hidden="true" /> {art.readingTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 group-hover:text-cyan-500 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {art.subtitle}
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1 font-bold gap-2">
                    <span className="text-rose-600 dark:text-rose-400 truncate">
                      Skip: {art.detourPair.avoidTouristTrap}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                      Save ~{art.detourPair.savingsPercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                    🌿 Do This: {art.detourPair.discoverCounterpart}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Budget from</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                  {formatPreferredCurrency(art.budgetInr.backpacker, settings.currencyPref)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveArticle(art)}
                  className="py-2 px-3 rounded-xl visionos-glass border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all hover:border-cyan-500 tactile-button-3d"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
                  <span>Read Story</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRouteFromArticle(art.relatedRouteId)}
                  className="py-2 px-3.5 rounded-xl bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 tactile-button-3d"
                >
                  <span>Plan Route</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Full-Screen Reading Modal */}
      <Modal
        isOpen={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        labelledBy="article-modal-title"
        maxWidthClass="max-w-2xl"
      >
        {activeArticle && (
          <>
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="sticky top-0 float-right z-10 p-2.5 rounded-full visionos-glass text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
              aria-label="Close Story"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase font-mono tracking-wider text-cyan-600 dark:text-cyan-400 font-extrabold block mb-1">
              {activeArticle.category} • {activeArticle.durationDays} Days
            </span>

            <h2
              id="article-modal-title"
              className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 leading-tight"
            >
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-2 mb-6">
              <span>By {activeArticle.author.name}</span>
              <span aria-hidden="true">•</span>
              <span>{activeArticle.readingTimeMinutes} min read</span>
            </div>

            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-200 dark:border-slate-800">
              <Image
                src={activeArticle.heroImage.src}
                alt={activeArticle.heroImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-[11px] text-white">
                {activeArticle.heroImage.caption}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-800/40 mb-6 text-xs text-emerald-950 dark:text-emerald-200">
              <h4 className="font-extrabold flex items-center gap-1.5 mb-1 text-emerald-900 dark:text-emerald-100">
                <Compass className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                The Detourist Verdict
              </h4>
              <p className="text-[11px] leading-relaxed">{activeArticle.detourPair.reason}</p>
            </div>

            <div className="space-y-6 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeArticle.sections.map((sec) => (
                <div key={sec.heading} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-slate-50">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sec.bodyText}
                  </p>
                  {sec.calloutNote && (
                    <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
                      {sec.calloutNote}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectRouteFromArticle(activeArticle.relatedRouteId);
                  setActiveArticle(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all tactile-button-3d"
              >
                <span>Calculate Real Route & Multi-Modal Budget</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="py-3 px-4 rounded-xl visionos-glass text-slate-700 dark:text-slate-300 font-bold text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
