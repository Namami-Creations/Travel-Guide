export type CountryCode = "IN" | "NP" | "BT";

export type CurrencyCode = "INR" | "NPR" | "BTN";

export type TravelStyle = "backpacker" | "comfort" | "luxury";

export type DietaryType = "all" | "pure-veg" | "jain" | "halal";

export type TravelMonth =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export interface CostBreakdown {
  stays: number;
  transit: number;
  intercityTransit: number;
  food: number;
  permitsAndFees: number;
  activities: number;
  buffer: number;
  detourSavings: number;
  total: number;
}

export interface DayActivity {
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  title: string;
  description: string;
  estimatedCostInr: number;
  durationHours: number;
  pureVegAvailable: boolean;
  jainAvailable: boolean;
  recommendedEatery?: {
    name: string;
    type: string;
    specialty: string;
  };
  transitNote?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  activities: DayActivity[];
}

export interface PermitRule {
  required: boolean;
  name: string;
  costInrPerPerson: number;
  isDailyFee?: boolean; // e.g. Bhutan SDF ₹1,200/night
  documentsRequired: string[];
  officialPortalUrl: string;
  processingTimeDays: number;
  notes: string;
}

export interface DetourAlternative {
  popularCrowdedSpot: string;
  crowdLevel: "High" | "Extreme";
  counterpartSpot: string;
  distanceKm: number;
  savingsPercentage: number;
  whyBetter: string;
}

export interface SeasonalAlert {
  cautionMonths: TravelMonth[];
  closedMonths?: TravelMonth[];
  advisory: string;
  peakMonths: TravelMonth[];
}

export interface SubcontinentRoute {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: CountryCode;
  region: string;
  durationDays: number;
  idealSeasons: string[];
  seasonalAlert?: SeasonalAlert;
  altitudeMeters?: number;
  amsRisk?: boolean; // Acute Mountain Sickness risk
  tagline: string;
  description: string;
  coverImageGradient: string;
  baseCostInr: {
    backpacker: number;
    comfort: number;
    luxury: number;
  };
  permitRule: PermitRule;
  detour: DetourAlternative;
  itinerary: ItineraryDay[];
  audioGuideTitle?: string;
  audioGuideNarrator?: string;
  audioGuideDurationMinutes?: number;
  quietTransitSpots?: {
    location: string;
    tip: string;
  }[];
  creditCardRewardTip?: {
    cardName: string;
    potentialSavingsInr: number;
    tip: string;
  };
}

export interface GroupMemberSurvey {
  id: string;
  name: string;
  budgetCapInr: number;
  preferredWakeUpHour: number; // e.g. 8 for 8 AM
  diet: DietaryType;
  activityPreference: "adventure" | "relaxed" | "cultural";
}
