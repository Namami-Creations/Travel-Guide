import { ORIGIN_CITIES } from "@/lib/data/origin-cities";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";
import { MULTIMODAL_TRANSIT_PLANS } from "@/lib/data/multimodal-transit-data";
import { MultiModalTransitPlan, TransitMode } from "@/types/transit";
import { TravelStyle } from "@/types/route";

export interface CityGeoMeta {
  lat: number;
  lon: number;
  altitudeMeters: number;
  stationCode: string;
  highwayGate: string;
}

export const ORIGIN_GEO: Record<string, CityGeoMeta> = {
  delhi: {
    lat: 28.6139,
    lon: 77.209,
    altitudeMeters: 216,
    stationCode: "NDLS (New Delhi)",
    highwayGate: "ISBT Kashmere Gate / NH44",
  },
  mumbai: {
    lat: 19.076,
    lon: 72.8777,
    altitudeMeters: 14,
    stationCode: "CSMT / LTT (Mumbai)",
    highwayGate: "Mumbai-Pune Expy / NH48",
  },
  bengaluru: {
    lat: 12.9716,
    lon: 77.5946,
    altitudeMeters: 920,
    stationCode: "SBC (KSR Bengaluru)",
    highwayGate: "Majestic / NH48 North",
  },
  kolkata: {
    lat: 22.5726,
    lon: 88.3639,
    altitudeMeters: 9,
    stationCode: "HWH / SDAH (Kolkata)",
    highwayGate: "Esplanade / NH12 North",
  },
  chandigarh: {
    lat: 30.7333,
    lon: 76.7794,
    altitudeMeters: 321,
    stationCode: "CDG (Chandigarh)",
    highwayGate: "ISBT Sector 43 / Himalayan Expy",
  },
  jaipur: {
    lat: 26.9124,
    lon: 75.7873,
    altitudeMeters: 431,
    stationCode: "JP (Jaipur Junction)",
    highwayGate: "Sindhi Camp / NH48 Delhi Corridor",
  },
  guwahati: {
    lat: 26.1445,
    lon: 91.7362,
    altitudeMeters: 55,
    stationCode: "GHY (Guwahati)",
    highwayGate: "ISBT Betkuchi / NH27 East-West",
  },
  pune: {
    lat: 18.5204,
    lon: 73.8567,
    altitudeMeters: 560,
    stationCode: "PUNE (Pune Junction)",
    highwayGate: "Swargate / Wakad Bypass",
  },
  siliguri: {
    lat: 26.7271,
    lon: 88.3953,
    altitudeMeters: 120,
    stationCode: "NJP / SGUJ (Siliguri)",
    highwayGate: "Tenzing Norgay Terminus / NH10",
  },
};

const DESTINATION_GEO: Record<
  string,
  {
    lat: number;
    lon: number;
    gatewayStation: string;
    busDrop: string;
    isHimalayan: boolean;
    bikeBaseCity: string;
  }
> = {
  "bt-paro-thimphu": {
    lat: 27.4728,
    lon: 89.6393,
    gatewayStation: "HSA (Hasimara) / NJP + Border Cab",
    busDrop: "Thimphu Terminal via Phuentsholing",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
  },
  "bt-punakha-valley": {
    lat: 27.5921,
    lon: 89.8797,
    gatewayStation: "HSA (Hasimara) / NJP + Punakha Transfer",
    busDrop: "Punakha / Dochula Gateway",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
  },
  "np-ktm-pokhara": {
    lat: 27.7172,
    lon: 85.324,
    gatewayStation: "GKP (Gorakhpur Jn) + Sunauli Crossing",
    busDrop: "Kalanki / Pokhara Lakeside",
    isHimalayan: true,
    bikeBaseCity: "Gorakhpur or Kathmandu",
  },
  "np-chitwan-lumbini": {
    lat: 27.5291,
    lon: 84.3542,
    gatewayStation: "GKP (Gorakhpur Jn) + Sunauli (1.5h drive)",
    busDrop: "Sauraha / Lumbini Terminal",
    isHimalayan: false,
    bikeBaseCity: "Gorakhpur",
  },
  "in-goa-south": {
    lat: 15.01,
    lon: 74.0232,
    gatewayStation: "MAO (Madgaon Junction)",
    busDrop: "Margao / Canacona Bypass",
    isHimalayan: false,
    bikeBaseCity: "Madgaon / Margao",
  },
  "in-himachal-tirthan": {
    lat: 31.6388,
    lon: 77.3496,
    gatewayStation: "CDG (Chandigarh) / UHL + Aut Tunnel Cab",
    busDrop: "Aut Tunnel Junction / Jibhi Cut",
    isHimalayan: true,
    bikeBaseCity: "Chandigarh or Aut",
  },
  "in-himachal-spiti": {
    lat: 32.2265,
    lon: 78.0711,
    gatewayStation: "KLK (Kalka) → SML (Shimla) Acclimatization Gate",
    busDrop: "Kaza Bus Stand via Kinnaur",
    isHimalayan: true,
    bikeBaseCity: "Shimla or Chandigarh",
  },
  "in-kashmir-gurez": {
    lat: 34.6345,
    lon: 74.832,
    gatewayStation: "JAT / SVDK (Jammu / Katra) + Banihal-Srinagar Cab",
    busDrop: "Srinagar TRC → Bandipora Sumo",
    isHimalayan: true,
    bikeBaseCity: "Srinagar",
  },
  "in-sikkim-pelling": {
    lat: 27.3198,
    lon: 88.2399,
    gatewayStation: "NJP (New Jalpaiguri) + Jorethang Shared Cab",
    busDrop: "Siliguri SNT → Pelling Helipad",
    isHimalayan: true,
    bikeBaseCity: "Siliguri",
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

/**
 * Resolves verified or deterministically calculated multi-modal transit between
 * any supported origin city and destination corridor so there are zero dead ends.
 */
export function resolveMultiModalTransit(
  originId: string,
  destinationId: string
): MultiModalTransitPlan | null {
  const curatedKey = `${originId}-${destinationId}`;
  if (MULTIMODAL_TRANSIT_PLANS[curatedKey]) {
    return MULTIMODAL_TRANSIT_PLANS[curatedKey];
  }

  const originCity = ORIGIN_CITIES.find((c) => c.id === originId);
  const originGeo = ORIGIN_GEO[originId];
  const destRoute = SUBCONTINENT_ROUTES.find((r) => r.id === destinationId);
  const destGeo = DESTINATION_GEO[destinationId];

  if (!originCity || !originGeo || !destRoute || !destGeo) {
    return null;
  }

  const crowKm = Math.max(85, haversineKm(originGeo.lat, originGeo.lon, destGeo.lat, destGeo.lon));
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
      ? `Long-haul corridor (~${distanceKm} km from ${originCity.name}). Consider an overnight Superfast rail leg to the nearest gateway hub (${destGeo.gatewayStation}) rather than direct bus.`
      : `Calculated highway & rail gateway estimate from ${originCity.name} to ${destRoute.destination}.`,
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

/**
 * Computes round-trip per-person intercity transit cost for the chosen mode and style,
 * sharing private vehicle costs sensibly across travelers (max 4 per car).
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
        ? plan.train.classes.find((c) => c.className === "Sleeper") ?? plan.train.classes[plan.train.classes.length - 1]
        : style === "luxury"
        ? plan.train.classes.find((c) => c.className === "2AC" || c.className === "Vande Bharat Chair") ?? plan.train.classes[0]
        : plan.train.classes.find((c) => c.className === "3AC") ?? plan.train.classes[0];

    const oneWay = (classTarget?.fareInr ?? 800) + Math.round(plan.train.localCabToHotelInr / Math.min(pax, 3));
    return oneWay * 2;
  }

  if (mode === "bus") {
    return plan.bus.fareInr * 2;
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
  // Up to 2 riders (pillion) if travelersCount >= 2 and backpacker/comfort
  const pillionSplit = pax >= 2 && style === "backpacker" ? 1.5 : 1;
  return Math.round(perBikeCost / pillionSplit);
}
