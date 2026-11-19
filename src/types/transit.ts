export type TransitMode = "train" | "bus" | "car" | "bike" | "flight";

export interface OriginCity {
  id: string;
  name: string;
  state: string;
  isNationalCapital?: boolean;
  isStateCapital?: boolean;
}

export interface TrainOption {
  trainNumberName: string;
  classes: {
    className: "Sleeper" | "3AC" | "2AC" | "1AC" | "Vande Bharat Chair";
    fareInr: number;
    tatkalBufferInr: number;
  }[];
  durationHours: number;
  fromStationCode: string;
  toStationCode: string;
  localCabToHotelInr: number;
  frequency: string;
  proTip: string;
}

export interface BusOption {
  serviceType: "HRTC / State Ordinary" | "AC Volvo Semi-Sleeper" | "Multi-Axle Luxury Sleeper";
  fareInr: number;
  durationHours: number;
  operator: string;
  boardingPoint: string;
  droppingPoint: string;
  proTip: string;
}

export interface CarOption {
  distanceKm: number;
  durationHours: number;
  estimatedFuelCostInr: number; // based on avg 14 km/l @ ₹96/L petrol
  fastagTollCostInr: number;
  mountainCabUnionSurchargeInr?: number;
  routeHighlights: string;
  pitstops: {
    name: string;
    type: "Dhaba (Pure Veg)" | "Clean Restroom & Coffee" | "Scenic Viewpoint";
    distanceKm: number;
    tip: string;
  }[];
}

export interface BikeOption {
  recommendedModel: string; // e.g. Royal Enfield Himalayan 450
  rentalBaseCity: string; // e.g. "Manali" or "Delhi" or "Siliguri"
  dailyRentalInr: number;
  estimatedFuelInr: number;
  ridingGearDepositInr: number;
  mountainPassNotes: string;
}

export interface FlightOption {
  fromAirportCode: string;
  toAirportCode: string;
  gatewayAirportName: string;
  carriers: string;
  flightDurationHours: number;
  transferDriveHours: number;
  oneWayFareInr: number;
  airportCabToHotelInr: number;
  isDirect: boolean;
  proTip: string;
}

export interface MultiModalTransitPlan {
  id: string;
  originId: string;
  destinationId: string;
  distanceKm: number;
  provenance?: "verified" | "estimated";
  hubNote?: string;
  train: TrainOption;
  bus: BusOption;
  car: CarOption;
  bike: BikeOption;
  flight?: FlightOption;
  crossBorderPermit?: {
    country: "NP" | "BT";
    vehicleCustomsFeeInr: number;
    permitName: string;
    requirementNotes: string;
  };
}

export interface ResolvedTransitPlan extends MultiModalTransitPlan {
  flight: FlightOption;
}

export interface ReverseBudgetMatch {
  routeId: string;
  destinationName: string;
  country: "IN" | "NP" | "BT";
  durationDays: number;
  bestTransitMode: TransitMode;
  totalCostInr: number;
  budgetCapInr: number;
  savingsInr: number;
  overBudgetByInr: number;
  fitsWithinBudget: boolean;
  tagline: string;
  whyFitsBudget: string;
}
