import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesiRouteProvider } from "@/lib/context/DesiRouteContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desiroute.in"),
  title: {
    default: "DesiRoute OS — Intelligent Subcontinent Travel OS (India, Nepal & Bhutan)",
    template: "%s | DesiRoute OS",
  },
  description:
    "Deterministic Rupee budget calculator, multi-modal Rail/Bus/Car/Bike transit matrix, Bhutan SDF ₹1,200 rules, Nepal border guides, and verified Pure Veg & Jain itineraries.",
  keywords: [
    "Bhutan trip cost from India",
    "Nepal overland guide",
    "Manali budget calculator",
    "Spiti valley solo guide",
    "Bhutan SDF fee for Indians",
    "DesiRoute travel",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "DesiRoute OS",
    title: "DesiRoute OS — India, Nepal & Bhutan Travel Calculator",
    description:
      "Multi-modal Rupee budget calculator, Bhutan SDF calculator, and anti-overtourism Himalayan itineraries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DesiRoute OS — Intelligent Subcontinent Travel OS",
    description:
      "Calculate multi-modal train, bus, car & bike costs down to the Rupee across India, Nepal & Bhutan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-slate-950 focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Ambient Warm & Himalayan Glow Elements for Liveness */}
        <div className="ambient-glow-amber" aria-hidden="true" />
        <div className="ambient-glow-blue" aria-hidden="true" />
        <div className="ambient-glow-emerald" aria-hidden="true" />

        {/* Structured Data for Subcontinent Travel Calculator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "DesiRoute OS",
              url: "https://desiroute.in",
              applicationCategory: "TravelApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              description:
                "Deterministic Rupee travel budget calculator, 5-mode transit matrix (IRCTC Train, Volvo Bus, Flight + Cab, Car, Bike), interactive India-Nepal-Bhutan border readiness wizard, and UPI group expense splitter.",
            }).replace(/</g, "\\u003c"),
          }}
        />

        <DesiRouteProvider>
          <div className="relative z-10 flex flex-col flex-1">{children}</div>
        </DesiRouteProvider>
      </body>
    </html>
  );
}
