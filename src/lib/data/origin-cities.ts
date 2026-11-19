import { OriginCity } from "@/types/transit";

export const ORIGIN_CITIES: OriginCity[] = [
  { id: "delhi", name: "New Delhi", state: "NCR", isNationalCapital: true },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", isStateCapital: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", isStateCapital: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", isStateCapital: true },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab / Haryana", isStateCapital: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", isStateCapital: true },
  { id: "guwahati", name: "Guwahati", state: "Assam", isStateCapital: false },
  { id: "pune", name: "Pune", state: "Maharashtra", isStateCapital: false },
  { id: "siliguri", name: "Siliguri / Bagdogra", state: "West Bengal", isStateCapital: false },
];
