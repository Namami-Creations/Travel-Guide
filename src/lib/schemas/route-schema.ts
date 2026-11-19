import { z } from "zod";

export const CountryCodeSchema = z.enum(["IN", "NP", "BT"]);
export const TravelStyleSchema = z.enum(["backpacker", "comfort", "luxury"]);
export const DietaryTypeSchema = z.enum(["all", "pure-veg", "jain", "halal"]);
export const TravelMonthSchema = z.enum([
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]);

export const PermitRuleSchema = z.object({
  required: z.boolean(),
  name: z.string(),
  costInrPerPerson: z.number().nonnegative(),
  isDailyFee: z.boolean().optional(),
  documentsRequired: z.array(z.string()),
  officialPortalUrl: z.string().url(),
  processingTimeDays: z.number().nonnegative(),
  notes: z.string(),
});

export const DetourAlternativeSchema = z.object({
  popularCrowdedSpot: z.string(),
  crowdLevel: z.enum(["High", "Extreme"]),
  counterpartSpot: z.string(),
  distanceKm: z.number().nonnegative(),
  savingsPercentage: z.number().min(0).max(100),
  whyBetter: z.string(),
});

export const SeasonalAlertSchema = z.object({
  cautionMonths: z.array(TravelMonthSchema),
  closedMonths: z.array(TravelMonthSchema).optional(),
  advisory: z.string(),
  peakMonths: z.array(TravelMonthSchema),
});

export const DayActivitySchema = z.object({
  timeOfDay: z.enum(["Morning", "Afternoon", "Evening"]),
  title: z.string(),
  description: z.string(),
  estimatedCostInr: z.number().nonnegative(),
  durationHours: z.number().positive(),
  pureVegAvailable: z.boolean(),
  jainAvailable: z.boolean(),
  recommendedEatery: z
    .object({
      name: z.string(),
      type: z.string(),
      specialty: z.string(),
    })
    .optional(),
  transitNote: z.string().optional(),
});

export const ItineraryDaySchema = z.object({
  dayNumber: z.number().positive(),
  theme: z.string(),
  activities: z.array(DayActivitySchema).min(1),
});

export const SubcontinentRouteSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  destination: z.string(),
  country: CountryCodeSchema,
  region: z.string(),
  durationDays: z.number().positive(),
  idealSeasons: z.array(z.string()).min(1),
  seasonalAlert: SeasonalAlertSchema.optional(),
  altitudeMeters: z.number().nonnegative().optional(),
  amsRisk: z.boolean().optional(),
  tagline: z.string(),
  description: z.string(),
  coverImageGradient: z.string(),
  baseCostInr: z.object({
    backpacker: z.number().positive(),
    comfort: z.number().positive(),
    luxury: z.number().positive(),
  }),
  permitRule: PermitRuleSchema,
  detour: DetourAlternativeSchema,
  itinerary: z.array(ItineraryDaySchema).min(1),
  audioGuideTitle: z.string().optional(),
  audioGuideNarrator: z.string().optional(),
  audioGuideDurationMinutes: z.number().positive().optional(),
  quietTransitSpots: z
    .array(
      z.object({
        location: z.string(),
        tip: z.string(),
      })
    )
    .optional(),
  creditCardRewardTip: z
    .object({
      cardName: z.string(),
      potentialSavingsInr: z.number().nonnegative(),
      tip: z.string(),
    })
    .optional(),
});

export const OriginCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string(),
  isNationalCapital: z.boolean().optional(),
  isStateCapital: z.boolean().optional(),
});

export const MultiModalTransitPlanSchema = z.object({
  id: z.string(),
  originId: z.string(),
  destinationId: z.string(),
  distanceKm: z.number().positive(),
  provenance: z.enum(["verified", "estimated"]).optional(),
  hubNote: z.string().optional(),
  train: z.object({
    trainNumberName: z.string(),
    classes: z
      .array(
        z.object({
          className: z.enum(["Sleeper", "3AC", "2AC", "1AC", "Vande Bharat Chair"]),
          fareInr: z.number().nonnegative(),
          tatkalBufferInr: z.number().nonnegative(),
        })
      )
      .min(1),
    durationHours: z.number().positive(),
    fromStationCode: z.string(),
    toStationCode: z.string(),
    localCabToHotelInr: z.number().nonnegative(),
    frequency: z.string(),
    proTip: z.string(),
  }),
  bus: z.object({
    serviceType: z.enum([
      "HRTC / State Ordinary",
      "AC Volvo Semi-Sleeper",
      "Multi-Axle Luxury Sleeper",
    ]),
    fareInr: z.number().nonnegative(),
    durationHours: z.number().positive(),
    operator: z.string(),
    boardingPoint: z.string(),
    droppingPoint: z.string(),
    proTip: z.string(),
  }),
  car: z.object({
    distanceKm: z.number().positive(),
    durationHours: z.number().positive(),
    estimatedFuelCostInr: z.number().nonnegative(),
    fastagTollCostInr: z.number().nonnegative(),
    mountainCabUnionSurchargeInr: z.number().nonnegative().optional(),
    routeHighlights: z.string(),
    pitstops: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["Dhaba (Pure Veg)", "Clean Restroom & Coffee", "Scenic Viewpoint"]),
        distanceKm: z.number().nonnegative(),
        tip: z.string(),
      })
    ),
  }),
  bike: z.object({
    recommendedModel: z.string(),
    rentalBaseCity: z.string(),
    dailyRentalInr: z.number().nonnegative(),
    estimatedFuelInr: z.number().nonnegative(),
    ridingGearDepositInr: z.number().nonnegative(),
    mountainPassNotes: z.string(),
  }),
  crossBorderPermit: z
    .object({
      country: z.enum(["NP", "BT"]),
      vehicleCustomsFeeInr: z.number().nonnegative(),
      permitName: z.string(),
      requirementNotes: z.string(),
    })
    .optional(),
});

export const EditorialArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  category: z.enum(["Himalayan Detour", "Weekend Micro-Escape", "Cross-Border Overland"]),
  originCity: z.string(),
  destination: z.string(),
  country: CountryCodeSchema,
  durationDays: z.number().positive(),
  readingTimeMinutes: z.number().positive(),
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  heroImage: z.object({
    src: z.string().startsWith("/"),
    alt: z.string(),
    caption: z.string(),
    elevationMeters: z.number().nonnegative(),
    bestUncrowdedWindow: z.string(),
  }),
  budgetInr: z.object({
    backpacker: z.number().positive(),
    comfort: z.number().positive(),
  }),
  detourPair: z.object({
    avoidTouristTrap: z.string(),
    discoverCounterpart: z.string(),
    distanceAwayKm: z.number().nonnegative(),
    savingsPercentage: z.number().min(0).max(100),
    reason: z.string(),
  }),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        bodyText: z.string(),
        calloutNote: z.string().optional(),
        image: z
          .object({
            src: z.string(),
            alt: z.string(),
            caption: z.string(),
            locationBadge: z.string(),
            bestHourToVisit: z.string().optional(),
          })
          .optional(),
      })
    )
    .min(1),
  relatedRouteId: z.string(),
});
