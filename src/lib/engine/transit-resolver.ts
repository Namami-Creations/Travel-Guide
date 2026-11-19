import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { MULTIMODAL_TRANSIT_PLANS } from "@/lib/data/multimodal-transit-data";
import {
  FlightOption,
  MultiModalTransitPlan,
  ResolvedTransitPlan,
  TransitMode,
} from "@/types/transit";
import { TravelStyle } from "@/types/route";

export interface CityGeoMeta {
  lat: number;
  lon: number;
  altitudeMeters: number;
  stationCode: string;
  airportCode: string;
  highwayGate: string;
}

export interface DestinationGeoMeta {
  lat: number;
  lon: number;
  gatewayStation: string;
  busDrop: string;
  isHimalayan: boolean;
  bikeBaseCity: string;
  gatewayAirportCode: string;
  gatewayAirportName: string;
  airportTransferHours: number;
  airportCabInr: number;
  checkpointName?: string;
}

export const ORIGIN_GEO: Record<string, CityGeoMeta> = {
  delhi: {
    lat: 28.6139,
    lon: 77.209,
    altitudeMeters: 216,
    stationCode: "NDLS (New Delhi)",
    airportCode: "DEL",
    highwayGate: "ISBT Kashmere Gate / NH44",
  },
  mumbai: {
    lat: 19.076,
    lon: 72.8777,
    altitudeMeters: 14,
    stationCode: "CSMT / LTT (Mumbai)",
    airportCode: "BOM",
    highwayGate: "Mumbai-Pune Expy / NH48",
  },
  bengaluru: {
    lat: 12.9716,
    lon: 77.5946,
    altitudeMeters: 920,
    stationCode: "SBC (KSR Bengaluru)",
    airportCode: "BLR",
    highwayGate: "Majestic / NH48 North",
  },
  kolkata: {
    lat: 22.5726,
    lon: 88.3639,
    altitudeMeters: 9,
    stationCode: "HWH / SDAH (Kolkata)",
    airportCode: "CCU",
    highwayGate: "Esplanade / NH12 North",
  },
  chandigarh: {
    lat: 30.7333,
    lon: 76.7794,
    altitudeMeters: 321,
    stationCode: "CDG (Chandigarh)",
    airportCode: "IXC",
    highwayGate: "ISBT Sector 43 / Himalayan Expy",
  },
  jaipur: {
    lat: 26.9124,
    lon: 75.7873,
    altitudeMeters: 431,
    stationCode: "JP (Jaipur Junction)",
    airportCode: "JAI",
    highwayGate: "Sindhi Camp / NH48 Delhi Corridor",
  },
  guwahati: {
    lat: 26.1445,
    lon: 91.7362,
    altitudeMeters: 55,
    stationCode: "GHY (Guwahati)",
    airportCode: "GAU",
    highwayGate: "ISBT Betkuchi / NH27 East-West",
  },
  pune: {
    lat: 18.5204,
    lon: 73.8567,
    altitudeMeters: 560,
    stationCode: "PUNE (Pune Junction)",
    airportCode: "PNQ",
    highwayGate: "Swargate / Wakad Bypass",
  },
  siliguri: {
    lat: 26.7271,
    lon: 88.3953,
    altitudeMeters: 120,
    stationCode: "NJP / SGUJ (Siliguri)",
    airportCode: "IXB",
    highwayGate: "Tenzing Norgay Terminus / NH10",
  },
};

export const DESTINATION_GEO: Record<string, DestinationGeoMeta> = {
  "bt-paro-thimphu": {
    lat: 27.4728,
    lon: 89.6393,
    gatewayStation: "HSA (Hasimara) / NJP + Border Cab",
    busDrop: "Thimphu Terminal via Phuentsholing",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
    gatewayAirportCode: "IXB / PBH",
    gatewayAirportName: "Bagdogra (IXB) + Phuentsholing Border / Paro (PBH)",
    airportTransferHours: 4.5,
    airportCabInr: 3200,
    checkpointName: "Phuentsholing RSTA & DoI Gate",
  },
  "bt-punakha-valley": {
    lat: 27.5921,
    lon: 89.8797,
    gatewayStation: "HSA (Hasimara) / NJP + Punakha Transfer",
    busDrop: "Punakha / Dochula Gateway",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
    gatewayAirportCode: "IXB / PBH",
    gatewayAirportName: "Bagdogra (IXB) or Paro International (PBH)",
    airportTransferHours: 5.5,
    airportCabInr: 3800,
    checkpointName: "Dochula Pass (3,100m) Permit Check",
  },
  "np-ktm-pokhara": {
    lat: 27.7172,
    lon: 85.324,
    gatewayStation: "GKP (Gorakhpur Jn) + Sunauli Crossing",
    busDrop: "Kalanki / Pokhara Lakeside",
    isHimalayan: true,
    bikeBaseCity: "Gorakhpur or Kathmandu",
    gatewayAirportCode: "KTM",
    gatewayAirportName: "Tribhuvan International Airport, Kathmandu (KTM)",
    airportTransferHours: 0.6,
    airportCabInr: 700,
    checkpointName: "Sunauli / Belahiya Border or KTM Immigration",
  },
  "np-chitwan-lumbini": {
    lat: 27.5291,
    lon: 84.3542,
    gatewayStation: "GKP (Gorakhpur Jn) + Sunauli (1.5h drive)",
    busDrop: "Sauraha / Lumbini Terminal",
    isHimalayan: false,
    bikeBaseCity: "Gorakhpur",
    gatewayAirportCode: "BWA / GOP",
    gatewayAirportName: "Gautam Buddha Intl (BWA) / Gorakhpur (GOP)",
    airportTransferHours: 1.5,
    airportCabInr: 1400,
    checkpointName: "Sunauli / Bhairahawa Land Border",
  },
  "in-goa-south": {
    lat: 15.01,
    lon: 74.0232,
    gatewayStation: "MAO (Madgaon Junction)",
    busDrop: "Margao / Canacona Bypass",
    isHimalayan: false,
    bikeBaseCity: "Madgaon / Margao",
    gatewayAirportCode: "GOI",
    gatewayAirportName: "Dabolim South Goa Airport (GOI)",
    airportTransferHours: 1.4,
    airportCabInr: 1800,
    checkpointName: "Canacona Coastal Entry",
  },
  "in-himachal-tirthan": {
    lat: 31.6388,
    lon: 77.3496,
    gatewayStation: "CDG (Chandigarh) / UHL + Aut Tunnel Cab",
    busDrop: "Aut Tunnel Junction / Jibhi Cut",
    isHimalayan: true,
    bikeBaseCity: "Chandigarh or Aut",
    gatewayAirportCode: "KUU / IXC",
    gatewayAirportName: "Kullu-Bhuntar (KUU) or Chandigarh (IXC)",
    airportTransferHours: 1.6,
    airportCabInr: 1600,
    checkpointName: "Aut Tunnel & Great Himalayan NP Gate",
  },
  "in-himachal-spiti": {
    lat: 32.2265,
    lon: 78.0711,
    gatewayStation: "KLK (Kalka) → SML (Shimla) Acclimatization Gate",
    busDrop: "Kaza Bus Stand via Kinnaur",
    isHimalayan: true,
    bikeBaseCity: "Shimla or Chandigarh",
    gatewayAirportCode: "IXC",
    gatewayAirportName: "Chandigarh Intl (IXC) → Shimla-Kinnaur Drive",
    airportTransferHours: 11.5,
    airportCabInr: 4500,
    checkpointName: "Kunzum Pass (4,551m) / Sumdo Checkpost",
  },
  "in-kashmir-gurez": {
    lat: 34.6345,
    lon: 74.832,
    gatewayStation: "JAT / SVDK (Jammu / Katra) + Banihal-Srinagar Cab",
    busDrop: "Srinagar TRC → Bandipora Sumo",
    isHimalayan: true,
    bikeBaseCity: "Srinagar",
    gatewayAirportCode: "SXR",
    gatewayAirportName: "Sheikh ul-Alam Intl Airport, Srinagar (SXR)",
    airportTransferHours: 5.5,
    airportCabInr: 3200,
    checkpointName: "Razdan Pass (3,556m) & Tragbal Army Check",
  },
  "in-sikkim-pelling": {
    lat: 27.3198,
    lon: 88.2399,
    gatewayStation: "NJP (New Jalpaiguri) + Jorethang Shared Cab",
    busDrop: "Siliguri SNT → Pelling Helipad",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
    gatewayAirportCode: "IXB",
    gatewayAirportName: "Bagdogra Airport (IXB) → Jorethang Climb",
    airportTransferHours: 4.5,
    airportCabInr: 2800,
    checkpointName: "Melli / Rangpo Sikkim Border Checkpost",
  },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildFlightOption(
  originId: string,
  originGeo: CityGeoMeta,
  destGeo: DestinationGeoMeta,
  country: "IN" | "NP" | "BT",
  crowKm: number
): FlightOption {
  const sameAirport = originGeo.airportCode === destGeo.gatewayAirportCode.split(" ")[0];

  if (sameAirport) {
    return {
      fromAirportCode: originGeo.airportCode,
      toAirportCode: destGeo.gatewayAirportCode,
      gatewayAirportName: destGeo.gatewayAirportName,
      carriers: "Overland Recommended (Same Aviation Hub)",
      flightDurationHours: 0.5,
      transferDriveHours: destGeo.airportTransferHours,
      oneWayFareInr: 2200,
      airportCabToHotelInr: destGeo.airportCabInr,
      isDirect: true,
      proTip: `You are already at the ${originGeo.airportCode} gateway hub — take a direct private/shared cab or Volvo instead of flying.`,
    };
  }

  const isBhutan = country === "BT";
  const isNepal = country === "NP";
  const isDirect =
    (originId === "delhi" || originId === "mumbai" || originId === "bengaluru" || originId === "kolkata") &&
    crowKm >= 380;

  // Realistic Indian domestic & India-Nepal/Bhutan average economy fares (booked 21+ days ahead)
  const baseAirfare = isBhutan
    ? originId === "kolkata" || originId === "guwahati"
      ? 5400
      : 6800
    : isNepal
    ? originId === "delhi" || originId === "kolkata"
      ? 5200
      : 7400
    : Math.max(3400, Math.min(8900, Math.round(2400 + crowKm * 2.85)));

  const flightDurationHours = Number(
    Math.max(1.1, crowKm / 680 + (isDirect ? 0.35 : 1.8)).toFixed(1)
  );

  const carriers = isBhutan
    ? "IndiGo / Air India Express to IXB (or Drukair to PBH)"
    : isNepal
    ? "IndiGo / Air India / Nepal Airlines"
    : "IndiGo / Air India / Akasa Air";

  const proTip = isBhutan
    ? "Fly to Bagdogra (IXB) for 60% cheaper fares than direct Paro (PBH) flights, then cross overland via Phuentsholing."
    : isNepal
    ? "Mandatory: Carry original Indian Passport or Election Voter ID at airport security. Aadhaar is rejected at KTM."
    : destGeo.isHimalayan
    ? `Book morning departures into ${destGeo.gatewayAirportCode} to clear mountain transfers before dusk and avoid afternoon mountain fog.`
    : `Book 21–35 days ahead via Tuesday/Wednesday fares; pre-book prepaid airport taxi at arrival counter.`;

  return {
    fromAirportCode: originGeo.airportCode,
    toAirportCode: destGeo.gatewayAirportCode,
    gatewayAirportName: destGeo.gatewayAirportName,
    carriers,
    flightDurationHours,
    transferDriveHours: destGeo.airportTransferHours,
    oneWayFareInr: baseAirfare,
    airportCabToHotelInr: destGeo.airportCabInr,
    isDirect,
    proTip,
  };
}

/**
 * Resolves verified or deterministically calculated multi-modal transit (Train, Bus, Car, Bike, Flight)
 * between any supported origin city and destination corridor so there are zero dead ends.
 */
export function resolveMultiModalTransit(
  originId: string,
  destinationId: string
): ResolvedTransitPlan | null {
  const originCity = ORIGIN_CITIES.find((c) => c.id === originId);
  const originGeo = ORIGIN_GEO[originId];
  const destRoute = SUBCONTINENT_ROUTES.find((r) => r.id === destinationId);
  const destGeo = DESTINATION_GEO[destinationId];

  if (!originCity || !originGeo || !destRoute || !destGeo) {
    return null;
  }

  const crowKm = Math.max(85, haversineKm(originGeo.lat, originGeo.lon, destGeo.lat, destGeo.lon));
  const computedFlight = buildFlightOption(originId, originGeo, destGeo, destRoute.country, crowKm);

  const curatedKey = `${originId}-${destinationId}`;
  if (MULTIMODAL_TRANSIT_PLANS[curatedKey]) {
    const curated = MULTIMODAL_TRANSIT_PLANS[curatedKey];
    return {
      ...curated,
      flight: curated.flight ?? computedFlight,
    };
  }

  const roadFactor = destGeo.isHimalayan ? 1.38 : 1.24;
  const distanceKm = Math.round(crowKm * roadFactor);

  // Realistic Indian Railways tariff bands
  const sleeperFare = Math.max(220, Math.round(distanceKm * 0.68));
  const ac3Fare = Math.max(620, Math.round(distanceKm * 1.75));
  const ac2Fare = Math.max(980, Math.round(distanceKm * 2.55));
  const trainDurationHours = Number((distanceKm / 56 + (destGeo.isHimalayan ? 3.5 : 1)).toFixed(1));
  const busFare = Math.max(550, Math.round(Math.min(3400, distanceKm * 1.9)));
  const busDurationHours = Number((distanceKm / 42 + (destGeo.isHimalayan ? 2.5 : 0.5)).toFixed(1));
  const carDurationHours = Number((distanceKm / (destGeo.isHimalayan ? 40 : 54)).toFixed(1));
  const fuelCost = Math.round((distanceKm / 14) * 96);
  const tollCost = Math.round(distanceKm * 0.95);
  const isLongHaulFlightHint = distanceKm > 1100;

  return {
    id: `est-${originId}-${destinationId}`,
    originId,
    destinationId,
    distanceKm,
    provenance: "estimated",
    hubNote: isLongHaulFlightHint
      ? `Long-haul corridor (~${distanceKm} km from ${originCity.name}). Compare Flight (${originGeo.airportCode} → ${destGeo.gatewayAirportCode}) vs overnight 3AC Rail to save 16+ hours.`
      : `Calculated highway, rail & aviation gateway estimate from ${originCity.name} to ${destRoute.destination}.`,
    train: {
      trainNumberName: `${originCity.name} → ${destGeo.gatewayStation} Express Connector`,
      classes: [
        { className: "2AC", fareInr: ac2Fare, tatkalBufferInr: Math.min(500, Math.round(ac2Fare * 0.22)) },
        { className: "3AC", fareInr: ac3Fare, tatkalBufferInr: Math.min(400, Math.round(ac3Fare * 0.22)) },
        { className: "Sleeper", fareInr: sleeperFare, tatkalBufferInr: Math.min(200, Math.round(sleeperFare * 0.25)) },
      ],
      durationHours: trainDurationHours,
      fromStationCode: originGeo.stationCode,
      toStationCode: destGeo.gatewayStation,
      localCabToHotelInr: destGeo.isHimalayan ? 950 : 450,
      frequency: "Daily Express / Connecting Rail",
      proTip: isLongHaulFlightHint
        ? `Book 3AC or 2AC up to ${destGeo.gatewayStation}, then transfer to local mountain shared Sumo/cab to save 12+ hours of highway fatigue.`
        : `Compare IRCTC 3AC vs overnight Volvo arrival timings to align with early-morning hotel check-in.`,
    },
    bus: {
      serviceType: distanceKm > 750 ? "Multi-Axle Luxury Sleeper" : "AC Volvo Semi-Sleeper",
      fareInr: busFare,
      durationHours: busDurationHours,
      operator: isLongHaulFlightHint ? "State Express + Regional Gateway Coach" : "State Roadways / Zingbus / IntrCity",
      boardingPoint: originGeo.highwayGate,
      droppingPoint: destGeo.busDrop,
      proTip: isLongHaulFlightHint
        ? `Over 1,000 km total — split bus journey via major railway hub rather than single-seat endurance.`
        : `Prefer overnight departures to save one full hotel night and arrive during golden daylight.`,
    },
    car: {
      distanceKm,
      durationHours: carDurationHours,
      estimatedFuelCostInr: fuelCost,
      fastagTollCostInr: tollCost,
      mountainCabUnionSurchargeInr: destGeo.isHimalayan ? 750 : undefined,
      routeHighlights: `${originCity.name} (${originGeo.highwayGate}) → National Highway Trunk Corridor → ${destRoute.destination}`,
      pitstops: [
        {
          name: "Mid-Corridor Highway Food Plaza",
          type: "Clean Restroom & Coffee",
          distanceKm: Math.round(distanceKm * 0.4),
          tip: "Take a 20-min hydration break every 250 km on multi-lane expressways.",
        },
        {
          name: `${destRoute.region} Foothill Pure-Veg Dhaba`,
          type: "Dhaba (Pure Veg)",
          distanceKm: Math.round(distanceKm * 0.78),
          tip: "Refuel tank to 100% before ascending mountain hairpin stretches.",
        },
      ],
    },
    bike: {
      recommendedModel: destGeo.isHimalayan
        ? "Royal Enfield Himalayan 450"
        : "Royal Enfield Meteor 350 / Classic 350",
      rentalBaseCity: destGeo.bikeBaseCity,
      dailyRentalInr: destGeo.isHimalayan ? 1350 : 1000,
      estimatedFuelInr: Math.round((distanceKm / 30) * 96),
      ridingGearDepositInr: 5000,
      mountainPassNotes: isLongHaulFlightHint
        ? `Take train from ${originCity.name} to ${destGeo.bikeBaseCity}, rent locally from trusted shops, and save highway tyre wear.`
        : `Check brake pads and tyre tread thoroughly before entering mountain ghats or coastal wet roads.`,
    },
    flight: computedFlight,
    crossBorderPermit:
      destRoute.country === "BT"
        ? {
            country: "BT",
            vehicleCustomsFeeInr: 4500,
            permitName: "Bhutan RSTA Entry Permit & Green Tax",
            requirementNotes:
              "Private Indian vehicles pay daily green tax at Phuentsholing and require a certified Bhutanese guide onboard.",
          }
        : destRoute.country === "NP"
        ? {
            country: "NP",
            vehicleCustomsFeeInr: 500,
            permitName: "Nepal Bhansar Vehicle Entry Permit",
            requirementNotes:
              "Valid original RC book, Indian DL, and third-party Nepal border insurance required at Sunauli/Kakarbhitta.",
          }
        : undefined,
  };
}

export interface IrctcWaitlistPlanB {
  arpWindowNote: string;
  tatkalWindowNote: string;
  fallbackHeadline: string;
  fallbackMode: TransitMode;
  fallbackOneWayInr: number;
  actionTip: string;
}

/**
 * Generates an actionable IRCTC Waitlist (WL/RAC) Plan B for Indian rail travelers
 * so trips don't collapse when Tatkal sells out in 90 seconds.
 */
export function getIrctcWaitlistPlanB(plan: ResolvedTransitPlan): IrctcWaitlistPlanB {
  const useFlightFallback = plan.distanceKm > 1050;
  const fallbackMode: TransitMode = useFlightFallback ? "flight" : "bus";
  const fallbackOneWayInr = useFlightFallback ? plan.flight.oneWayFareInr : plan.bus.fareInr;

  return {
    arpWindowNote: "IRCTC Advance Reservation Period (ARP) opens 60 days prior at 8:00 AM IST.",
    tatkalWindowNote: "Tatkal opens 1 day before journey: 10:00 AM (AC classes) · 11:00 AM (Sleeper).",
    fallbackHeadline: useFlightFallback
      ? `Long-Haul WL Fallback: Fly ${plan.flight.fromAirportCode} → ${plan.flight.toAirportCode}`
      : `Overland WL Fallback: ${plan.bus.operator}`,
    fallbackMode,
    fallbackOneWayInr,
    actionTip: useFlightFallback
      ? `If WL stays above 15 at T-48h, pivot to a gateway flight (${plan.flight.toAirportCode}) rather than paying last-minute dynamic Premium Tatkal fares.`
      : `Lock a zero-cancellation AC Volvo seat from ${plan.bus.boardingPoint} if your train remains Waitlist >10 two days before departure.`,
  };
}

/**
 * Computes round-trip per-person intercity transit cost for the chosen mode and style,
 * sharing private vehicle and airport transfer cab costs sensibly across travelers.
 */
export function getRoundTripIntercityPerPersonInr(
  plan: MultiModalTransitPlan | null,
  mode: TransitMode,
  style: TravelStyle,
  travelersCount: number,
  durationDays: number
): number {
  if (!plan) return 0;
  const pax = Math.max(1, Math.round(travelersCount));

  if (mode === "train") {
    const classTarget =
      style === "backpacker"
        ? plan.train.classes.find((c) => c.className === "Sleeper") ??
          plan.train.classes[plan.train.classes.length - 1]
        : style === "luxury"
        ? plan.train.classes.find((c) => c.className === "2AC" || c.className === "Vande Bharat Chair") ??
          plan.train.classes[0]
        : plan.train.classes.find((c) => c.className === "3AC") ?? plan.train.classes[0];

    const oneWay =
      (classTarget?.fareInr ?? 800) + Math.round(plan.train.localCabToHotelInr / Math.min(pax, 3));
    return oneWay * 2;
  }

  if (mode === "bus") {
    return plan.bus.fareInr * 2;
  }

  if (mode === "flight") {
    if (!plan.flight) return 0;
    const styleMultiplier = style === "luxury" ? 1.25 : 1.0;
    const cabShare = Math.round(plan.flight.airportCabToHotelInr / Math.min(pax, 3));
    return Math.round(plan.flight.oneWayFareInr * styleMultiplier + cabShare) * 2;
  }

  if (mode === "car") {
    const totalVehicleOneWay =
      plan.car.estimatedFuelCostInr +
      plan.car.fastagTollCostInr +
      (plan.car.mountainCabUnionSurchargeInr ?? 0) +
      (plan.crossBorderPermit?.vehicleCustomsFeeInr ?? 0) / 2;
    const sharers = Math.min(pax, 4);
    return Math.round((totalVehicleOneWay * 2) / sharers);
  }

  // Bike: daily rental across active riding days + round-trip fuel
  const rentalDays = Math.max(2, Math.min(durationDays, 7));
  const perBikeCost =
    plan.bike.dailyRentalInr * rentalDays +
    plan.bike.estimatedFuelInr * 2 +
    (plan.crossBorderPermit ? 500 : 0);
  // Up to 2 riders (pillion) if travelersCount >= 2 and backpacker
  const pillionSplit = pax >= 2 && style === "backpacker" ? 1.5 : 1;
  return Math.round(perBikeCost / pillionSplit);
}
