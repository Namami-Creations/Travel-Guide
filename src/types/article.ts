export interface ArticleSection {
  heading: string;
  bodyText: string;
  calloutNote?: string;
  image?: {
    src: string;
    alt: string;
    caption: string;
    locationBadge: string;
    bestHourToVisit?: string;
  };
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Himalayan Detour" | "Weekend Micro-Escape" | "Cross-Border Overland";
  originCity: string;
  destination: string;
  country: "IN" | "NP" | "BT";
  durationDays: number;
  readingTimeMinutes: number;
  author: {
    name: string;
    role: string;
  };
  heroImage: {
    src: string;
    alt: string;
    caption: string;
    elevationMeters: number;
    bestUncrowdedWindow: string;
  };
  budgetInr: {
    backpacker: number;
    comfort: number;
  };
  detourPair: {
    avoidTouristTrap: string;
    discoverCounterpart: string;
    distanceAwayKm: number;
    savingsPercentage: number;
    reason: string;
  };
  sections: ArticleSection[];
  relatedRouteId: string;
}
