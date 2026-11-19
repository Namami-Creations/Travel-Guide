# DesiRoute OS • Subcontinent Edition 🌏

> **Intelligent, Multi-Modal Himalayan & Coastal Travel Operating System for India, Nepal, and Bhutan.**  
> *Calculated down to the exact Rupee. Zero sponsored placement bias. 100% DPDP Act 2023 compliant.*

---

## 🌟 Overview

**DesiRoute OS** is a modern travel planning engine engineered specifically for travelers across India, Nepal, and Bhutan. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS, it eliminates the chaos of legacy travel portals by offering:

- **100% Rupee Transparency**: Explicit calculation of IRCTC Tatkal buffer fares, Volvo bus fares, fuel mileage, FASTag tolls, cab union surcharges, and state permits.
- **Bhutan SDF & Permit Engine**: Real-time calculation of Bhutan's Sustainable Development Fee (₹1,200/night for Indian nationals, 50% child concession, zero fee under 6) and Nepal Voter ID / currency restrictions.
- **Bheed Se Door (Anti-Overtourism Engine)**: Dynamic 1-click swaps from crowded commercial traps to serene counterpart valleys (e.g., Manali → Sissu/Tirthan, Thamel → Patan Durbar).
- **Pure Veg & Jain Verified Corridors**: Verified sattvic & Jain dining options alongside explicit high-altitude dry ration warnings.
- **Privacy First (DPDP Act 2023)**: Client-side local storage with Incognito Travel (Ghost Mode) and 1-click permanent storage erasure.

---

## 🚀 Key Features & Dynamic Modes

### 1. Multi-Modal Budget OS & Route Resolver
- **63-Corridor Matrix**: Full origin-to-destination resolver covering 9 gateway hubs (*Delhi, Mumbai, Bengaluru, Kolkata, Chandigarh, Jaipur, Guwahati, Pune, Siliguri*) to curated Himalayan and coastal sanctuaries.
- **Interactive Budget Matrix**: Sliders for group size, children, duration, and style (Backpacker, Comfort, Luxury).
- **Reverse Budget Matcher ("Mera Budget, Meri Trip")**: Enter a spending limit (e.g., ₹20,000) and receive destinations that genuinely fit including intercity transit.

### 2. Contextual Intelligence Dock (4 Active Modes)
- 🤝 **FairShare Mode**: Group budget split calculator with dynamic UPI deep-links (`upi://pay`) and formatted WhatsApp itinerary sharing.
- 🎙️ **The 9 PM Club**: Atmospheric evening audio lore and curated dinner pods for solo and group travelers.
- 🧘 **Sukoon Mode**: Low-stimulus sensory guide, transit lounge tips, and Acute Mountain Sickness (AMS) elevation protocols.
- 🧭 **Bheed Se Door**: Anti-overtourism engine offering real savings percentage and tranquil alternative itineraries.

### 3. VisionOS Spatial Glassmorphic Design System
- Pure CSS3 spatial depth and glassmorphism without heavy WebGL/Three.js dependencies.
- Apple-inspired accessibility, light/dark mode support, reduced-motion compliance, and high-contrast printable offline trip briefs (`@media print`).

### 4. Detourist Editorial Magazine
- Long-form essays with real Himalayan topographic research and authentic visual assets.
- Direct 1-click "Open in Planner" bridging editorial reading to live itinerary calculation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router, Server & Client Components)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide Icons, CSS3 Glassmorphism
- **Validation**: Zod schema validation for routes, transit corridors, and user state
- **Type Safety**: TypeScript 5 (Strict Mode)
- **State & Storage**: Local-first `DesiRouteContext` with real-time byte calculation and DPDP compliance

---

## 📂 Project Structure

```
tarvel guide/
├── src/
│   ├── app/                      # Next.js App Router (Server pages, metadata, error boundaries)
│   │   ├── about/                # Manifesto & comparison
│   │   ├── articles/             # Detourist Magazine
│   │   ├── help/                 # Official Subcontinent Knowledge Base (SDF, Nepal laws)
│   │   ├── profile/              # Traveler DNA & Bookmarked Routes
│   │   ├── settings/             # Currency display (INR/NPR/BTN), Ghost Mode & Erasure Vault
│   │   ├── error.tsx             # Route error boundary
│   │   ├── global-error.tsx      # Root error boundary
│   │   ├── layout.tsx            # Metadata, fonts & DesiRouteProvider
│   │   ├── not-found.tsx         # Custom 404
│   │   ├── page.tsx              # Root page (Server Component)
│   │   ├── robots.ts             # Search engine crawler policy
│   │   └── sitemap.ts            # Dynamic sitemap generator
│   ├── components/               # Modular UI components
│   │   ├── calculator/           # BudgetMatrix & SourceDestinationCalculator
│   │   ├── editorial/            # EditorialStoriesSection & ArticlesClient
│   │   ├── help/                 # HelpClient (live searchable FAQ)
│   │   ├── itinerary/            # Day-by-day ItineraryTimeline
│   │   ├── modes/                # SukoonMode, DetouristCard, FairShareModal, NinePmClubModal
│   │   ├── monetization/         # EditorialAffiliateCard
│   │   ├── navigation/           # Apple-style Header & Responsive Footer
│   │   ├── permits/              # Bhutan SDF & Cross-Border PermitInfoCard
│   │   ├── planner/              # HomePlannerClient
│   │   ├── profile/              # ProfileClient
│   │   ├── settings/             # SettingsClient
│   │   └── ui/                   # WCAG Accessible Modal & Primitives
│   ├── lib/
│   │   ├── context/              # DesiRouteContext (Local storage persistence & Ghost Mode)
│   │   ├── data/                 # Routes, Origin cities, Transit plans, Editorial articles
│   │   ├── engine/               # calculator.ts, reverse-budget.ts, transit-resolver.ts
│   │   └── schemas/              # Zod validation schemas
│   ├── types/                    # TypeScript interfaces (route, transit, article)
│   └── __tests__/                # Comprehensive unit tests & user simulations
├── public/                       # Static assets & destination photography
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js >= 20.9.0 (LTS recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Namami-Creations/Travel-Guide.git
   cd Travel-Guide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
# Run unit test suite (Zod schemas, transit resolver, Bhutan SDF, UPI logic)
npm test

# Run user simulation script (Delhi to Manali ₹20,000 budget test)
npx tsx src/__tests__/user-simulation.ts
```

---

## 🔒 Privacy & Compliance

DesiRoute OS is built privacy-first in alignment with the **Digital Personal Data Protection (DPDP) Act 2023**:
- No external ad tracking, analytics trackers, or user profiling cookies.
- Incognito / Ghost Mode operates strictly in volatile memory.
- 1-click permanent wipe purges all device storage keys (`localStorage.clear()`).

---

## 📄 License

MIT © [Namami Creations](https://github.com/Namami-Creations)
