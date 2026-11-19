import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import {
  formatInr,
  calculateItemizedBudget,
} from "@/lib/engine/calculator";
import {
  getRoundTripIntercityPerPersonInr,
  resolveMultiModalTransit,
} from "@/lib/engine/transit-resolver";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Mountain,
  ShieldCheck,
  Train,
  Plane,
  Bus,
  Car,
  Utensils,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function generateStaticParams() {
  return SUBCONTINENT_ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = SUBCONTINENT_ROUTES.find((r) => r.slug === slug);
  if (!route) {
    return {
      title: "Corridor Not Found",
      description: "The requested Subcontinent travel corridor could not be found.",
    };
  }

  const countryName =
    route.country === "BT" ? "Bhutan" : route.country === "NP" ? "Nepal" : "India";
  const title = `${route.destination} Cost & ${route.durationDays}D Guide (${countryName})`;
  const description = `Complete ${route.durationDays}-day ${route.destination} budget from 9 Indian cities: Train, Bus, Flight & Car fares, ${route.permitRule.name}, Pure Veg eateries, and Bheed Se Door detour.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | DesiRoute OS`,
      description,
      type: "article",
      locale: "en_IN",
      url: `https://desiroute.in/routes/${route.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RouteCorridorGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = SUBCONTINENT_ROUTES.find((r) => r.slug === slug);
  if (!route) notFound();

  const countryLabel =
    route.country === "BT" ? "Bhutan" : route.country === "NP" ? "Nepal" : "India";

  // Precompute 9-origin multi-modal fare matrix server-side
  const originMatrix = ORIGIN_CITIES.flatMap((city) => {
    const plan = resolveMultiModalTransit(city.id, route.id);
    if (!plan) return [];
    const trainRt = getRoundTripIntercityPerPersonInr(plan, "train", "comfort", 2, route.durationDays);
    const busRt = getRoundTripIntercityPerPersonInr(plan, "bus", "comfort", 2, route.durationDays);
    const flightRt = getRoundTripIntercityPerPersonInr(plan, "flight", "comfort", 2, route.durationDays);
    const carRt = getRoundTripIntercityPerPersonInr(plan, "car", "comfort", 2, route.durationDays);

    const allInTrain = calculateItemizedBudget(route, "comfort", 2, 0, 1.0, {
      intercityTransitPerPersonInr: trainRt,
    });

    return [
      {
        city,
        distanceKm: plan.distanceKm,
        trainRt,
        busRt,
        flightRt,
        carRt,
        allInPerPersonTrain: Math.round(allInTrain.total / 2),
        trainName: plan.train.trainNumberName,
        airportPair: `${plan.flight.fromAirportCode} → ${plan.flight.toAirportCode}`,
      },
    ];
  });

  const baseComfort = calculateItemizedBudget(route, "comfort", 2, 0, 1.0);
  const perPersonBase = Math.round(baseComfort.total / 2);

  // Structured Data: TouristTrip + FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: `${route.title} — ${route.durationDays} Day Itinerary`,
        description: route.tagline,
        touristType: ["Independent Travelers", "Pure Vegetarian Travelers", "Budget Explorers"],
        itinerary: {
          "@type": "ItemList",
          numberOfItems: route.itinerary.length,
          itemListElement: route.itinerary.map((day) => ({
            "@type": "ListItem",
            position: day.dayNumber,
            name: `Day ${day.dayNumber}: ${day.theme}`,
          })),
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: perPersonBase,
          availability: "https://schema.org/InStock",
          url: `https://desiroute.in/?route=${route.id}`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What permits or ID are required for Indian travelers visiting ${route.destination}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${route.permitRule.name}: ${route.permitRule.notes} Documents: ${route.permitRule.documentsRequired.join(", ")}.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the best time to visit ${route.destination}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Ideal seasons for ${route.destination} are ${route.idealSeasons.join(" and ")}. Peak elevation reaches ${route.altitudeMeters ?? 1400} meters.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the uncrowded Bheed Se Door alternative near ${route.destination}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Swap crowded ${route.detour.popularCrowdedSpot} for ${route.detour.counterpartSpot}: ${route.detour.whyBetter}`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Header />

      <main
        id="main-content"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 flex-1"
      >
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Interactive Calculator</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-500">
            {countryLabel} · {route.region} · {route.durationDays} Days
          </span>
        </div>

        {/* Hero Summary */}
        <section className="visionos-glass-elevated p-6 sm:p-10 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
              {route.durationDays}D / {Math.max(1, route.durationDays - 1)}N Corridor
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold tabular-nums flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
              {route.altitudeMeters ?? 1400}m Peak
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
              Ideal: {route.idealSeasons.join(" / ")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-50 leading-tight">
            {route.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {route.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/?route=${route.id}&origin=delhi`}
              className="py-3 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all tactile-button-3d"
            >
              <span>Customize in Live Rupee Calculator</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={route.permitRule.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl visionos-glass border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <span>Official Permit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* 9-Origin Multi-Modal Comparison Table */}
        <section className="visionos-glass p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              Multi-Modal Intercity Fare Matrix (Round-Trip / Person)
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-slate-50 mt-1">
              How to Reach {route.destination} from 9 Indian Hubs
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Click any city row to launch the live interactive budget calculator pre-loaded for that exact origin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 uppercase">
                  <th className="py-3 pr-4">Origin Hub</th>
                  <th className="py-3 px-3">Distance</th>
                  <th className="py-3 px-3">
                    <span className="inline-flex items-center gap-1">
                      <Train className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> Train (3AC RT)
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="inline-flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" /> Bus (RT)
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="inline-flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" /> Flight + Cab (RT)
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="inline-flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> Car Share (RT)
                    </span>
                  </th>
                  <th className="py-3 pl-3 text-right">All-In Est. (Rail)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {originMatrix.map((row) => (
                  <tr
                    key={row.city.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pr-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      <Link
                        href={`/?route=${route.id}&origin=${row.city.id}&mode=train`}
                        className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline"
                      >
                        {row.city.name}
                      </Link>
                      <span className="block text-[10px] font-mono text-slate-400 font-normal">
                        {row.airportPair}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {row.distanceKm} km
                    </td>
                    <td className="py-3 px-3 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatInr(row.trainRt)}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatInr(row.busRt)}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatInr(row.flightRt)}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatInr(row.carRt)}
                    </td>
                    <td className="py-3 pl-3 text-right font-mono font-black tabular-nums text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      <Link
                        href={`/?route=${route.id}&origin=${row.city.id}&mode=train`}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {formatInr(row.allInPerPersonTrain)}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bheed Se Door + Permit Rules 2-Column Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="visionos-glass p-6 rounded-[2rem] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-extrabold uppercase">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Bheed Se Door Anti-Overtourism Swap</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-50">
              Skip {route.detour.popularCrowdedSpot} → Choose {route.detour.counterpartSpot}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {route.detour.whyBetter}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                Saves ~{route.detour.savingsPercentage}% on crowd markups
              </span>
              <Link
                href={`/?route=${route.id}&detour=1`}
                className="font-bold text-slate-900 dark:text-slate-100 underline"
              >
                Load with Detour →
              </Link>
            </div>
          </div>

          <div className="visionos-glass p-6 rounded-[2rem] border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-mono font-extrabold uppercase">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Permits & Indian ID Rules</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-50">
              {route.permitRule.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {route.permitRule.notes}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
              {route.permitRule.documentsRequired.map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Day-by-Day Field Itinerary Summary */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-slate-50">
            {route.durationDays}-Day Paced Itinerary & Pure Veg Eateries
          </h2>
          <div className="space-y-4">
            {route.itinerary.map((day) => (
              <article
                key={day.dayNumber}
                className="visionos-glass p-5 sm:p-6 rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-950 dark:bg-cyan-500 text-white dark:text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                    D{day.dayNumber}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-slate-50">
                    {day.theme}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day.activities.map((act, idx) => (
                    <div
                      key={`${day.dayNumber}-${idx}`}
                      className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {act.timeOfDay}: {act.title}
                        </span>
                        <span className="font-mono font-bold tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
                          {formatInr(act.estimatedCostInr)}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {act.description}
                      </p>
                      {act.recommendedEatery && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                          <Utensils className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span>
                            {act.recommendedEatery.name} ({act.recommendedEatery.type})
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cross-link other corridors */}
        <section className="pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-500">
            Explore Other Subcontinent Corridors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUBCONTINENT_ROUTES.filter((r) => r.id !== route.id)
              .slice(0, 4)
              .map((other) => (
                <Link
                  key={other.id}
                  href={`/routes/${other.slug}`}
                  className="p-4 rounded-2xl visionos-glass border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500 transition-all space-y-1"
                >
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {other.region} · {other.durationDays}D
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-950 dark:text-slate-50">
                    {other.destination}
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block">
                    From {formatInr(other.baseCostInr.backpacker)} →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
