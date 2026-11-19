"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import {
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: "Bhutan SDF" | "Nepal Border" | "Railways & Transit" | "Health & AMS";
}

const FAQ_DATABASE: FaqItem[] = [
  {
    category: "Bhutan SDF",
    question: "How does the Bhutan Sustainable Development Fee (SDF) work for Indian nationals?",
    answer:
      "Under the revised policy, Indian nationals with a valid Indian Passport or original Voter ID pay a subsidized SDF of ₹1,200 per adult per night (compared to $100/night for international visitors). Children aged 6 to 12 receive a 50% concession (₹600/night), and children under 6 are exempt. You must pre-book a Department of Tourism certified hotel and a certified Bhutanese guide before entry.",
  },
  {
    category: "Bhutan SDF",
    question: "Can I drive my own Indian car or motorcycle into Bhutan?",
    answer:
      "Yes. You must register at the RSTA (Road Safety and Transport Authority) office at the Phuentsholing border. You will need your original Registration Certificate (RC), comprehensive insurance, pollution certificate (PUC), and driving licence. You must pay a daily Green Tax (~₹4,500/day beyond Phuentsholing) and hire a certified local Bhutanese guide.",
  },
  {
    category: "Nepal Border",
    question: "Is an Aadhaar card valid for entering Nepal?",
    answer:
      "NO. Nepal Immigration strictly rejects Aadhaar cards, PAN cards, or driving licenses as valid travel documents for air travel into Tribhuvan International Airport (Kathmandu). You MUST carry either an original Indian Election Commission Voter ID card OR an Indian Passport with at least 6 months validity.",
  },
  {
    category: "Nepal Border",
    question: "What is the rule regarding Indian currency notes in Nepal?",
    answer:
      "Indian Rupee ₹100 notes are widely accepted across Nepal at the official fixed exchange rate of 1 INR = 1.60 NPR. However, carrying or using Indian ₹500 currency notes is legally restricted by Nepal Rastra Bank. Carry ₹100 notes or exchange currency into Nepali Rupees at authorized border bank counters at Sunauli/Belahiya.",
  },
  {
    category: "Railways & Transit",
    question: "How do I beat the IRCTC Tatkal rush for mountain trains?",
    answer:
      "For AC classes (3AC/2AC), Tatkal opens at 10:00 AM; for Sleeper, it opens at 11:00 AM. Always save passenger master lists in your IRCTC profile beforehand. Alternatively, check Vande Bharat or Shatabdi routes to terminal base cities (e.g., Delhi to Chandigarh/Una for Himachal, or Sealdah to New Jalpaiguri for Sikkim/Bhutan), which consistently have higher seat quotas.",
  },
  {
    category: "Health & AMS",
    question: "What are the rules for preventing Acute Mountain Sickness (AMS) in Spiti, Ladakh or Tiger's Nest?",
    answer:
      "When ascending above 2,500 meters (8,200 ft), your body requires acclimatization. Spend your first 24 hours resting with minimal exertion. Drink at least 3.5 to 4 liters of water daily. Avoid alcohol and heavy sleeping pills. If you experience persistent throbbing headaches, nausea, or dizziness, descend immediately to a lower altitude.",
  },
];

const CATEGORIES = ["All", "Bhutan SDF", "Nepal Border", "Railways & Transit", "Health & AMS"] as const;

export function HelpClient() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(FAQ_DATABASE[0].question);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATABASE.filter((f) => {
      const catMatch = activeCategory === "All" || f.category === activeCategory;
      const textMatch =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header />

      <main
        id="main-content"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 flex-1"
      >
        <section className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>Official Subcontinent Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            Help Center & Permit Guides
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mx-auto sm:mx-0">
            Everything you need to know about Bhutan&apos;s ₹1,200 SDF, Nepal border crossing laws, IRCTC railway hacks, and high-altitude mountain safety.
          </p>
        </section>

        {/* Search + Category Filter Bar */}
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="help-search-input" className="sr-only">
              Search help topics, permits, or railway rules
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="help-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SDF, Aadhaar, Tatkal, ₹500 notes, AMS..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl visionos-glass border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap tactile-button-3d ${
                  activeCategory === cat
                    ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md"
                    : "visionos-glass text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion keyed by faq.question */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 rounded-[1.75rem] visionos-glass border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No matching guidance found for &quot;{searchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openQuestion === faq.question;
              return (
                <div
                  key={faq.question}
                  className="rounded-[1.75rem] visionos-glass border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all spatial-card-3d"
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold shrink-0 border border-slate-200 dark:border-slate-700">
                        {faq.category}
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-slate-950 dark:text-slate-50">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Official Portals Box */}
        <div className="p-6 sm:p-7 rounded-[2rem] visionos-glass border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              Need to verify official government notifications?
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Never pay commission agents. Always verify permits directly on official immigration websites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <a
              href="https://bhutan.travel"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl visionos-glass border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 flex items-center gap-1.5 shadow-xs tactile-button-3d"
            >
              <span>Bhutan Dept of Tourism</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://nepalimmigration.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl visionos-glass border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 flex items-center gap-1.5 shadow-xs tactile-button-3d"
            >
              <span>Nepal Immigration</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
