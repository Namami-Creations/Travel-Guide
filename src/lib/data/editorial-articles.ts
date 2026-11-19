import { EditorialArticle } from "@/types/article";

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: "art-delhi-kathmandu",
    slug: "delhi-to-kathmandu-budget-gen-z",
    title: "Delhi to Kathmandu on a Gen Z Budget: The Detourist's Guide",
    subtitle:
      "Skip the ₹14,000 flight, bypass commercial tourist traps in Thamel, and experience ancient Newari alleyways, serene lakeside stupas, and pure Himalayan peace without burning through your savings.",
    category: "Cross-Border Overland",
    originCity: "New Delhi",
    destination: "Kathmandu & Pokhara",
    country: "NP",
    durationDays: 7,
    readingTimeMinutes: 6,
    author: {
      name: "Aryan Malhotra",
      role: "Solo Backpacker & Subcontinent Chronicler",
    },
    heroImage: {
      src: "/images/destinations/patan-durbar-kathmandu.jpg",
      alt: "Patan Durbar Square at dawn in Kathmandu Valley with red-brick pagoda temples and morning mist",
      caption: "Patan Durbar Square, Lalitpur (Nepal) • Ancient Newari Courtyard at 6:30 AM",
      elevationMeters: 1400,
      bestUncrowdedWindow: "6:00 AM – 8:00 AM (Zero Tour Groups)",
    },
    budgetInr: {
      backpacker: 10800,
      comfort: 20600,
    },
    detourPair: {
      avoidTouristTrap: "Thamel Commercial Nightclub Strip (Noisy bars, tourist markups)",
      discoverCounterpart: "Patan (Lalitpur) Heritage Square (Quiet brick courtyards, artisan cafes)",
      distanceAwayKm: 5,
      savingsPercentage: 35,
      reason: "Patan offers 10x more authentic Newari architecture, peaceful artisan workshops, and calm rooftop pure-veg dining without noisy disco bars.",
    },
    relatedRouteId: "np-ktm-pokhara",
    sections: [
      {
        heading: "1. The Overland Train Hack: Delhi to Gorakhpur",
        bodyText:
          "Board the 12558 Sapt Kranti Express from New Delhi at 8:00 PM. Wake up arriving at Gorakhpur Junction by 9:30 AM. From the station, shared AC taxis take you to Sunauli border in 2.5 hours for just ₹150. Walk across the international border with your original Indian Voter ID or Passport. No visa required, zero paperwork fee.",
        calloutNote:
          "Pro Tip: Indian ₹100 currency notes are accepted everywhere in Nepal at a fixed 1 INR = 1.60 NPR rate. Avoid carrying ₹500 notes which are restricted.",
      },
      {
        heading: "2. The Detour: Why Gen Z Travelers Are Choosing Patan Over Thamel",
        bodyText:
          "Thamel has turned into an open-air mall for generic tourist trinkets. Instead, book a boutique Newari homestay in Patan (₹900/night). You wake up to the gentle clanging of temple bells, watch local coppersmiths carving Buddha statues, and sip organic pour-over coffee at quiet rooftop cafes overlooking 12th-century pagoda shrines.",
      },
      {
        heading: "3. Sacred Peace & Pure Veg Survival",
        bodyText:
          "For dining, head to Annapurna Bhojanalaya for unlimited pure-ghee Marwari Jain Thalis (₹155 INR). At sunset, sit on the stone steps across the Bagmati river to witness the evening aarti at holy Pashupatinath without commercial interruption.",
      },
    ],
  },

  {
    id: "art-delhi-manali-sissu",
    slug: "delhi-to-manali-sissu-lahaul-zen",
    title: "Delhi to Manali & Sissu (Lahaul): Skip Rohtang Jams for Pure Alpine Zen",
    subtitle:
      "Why driving past the crowded Mall Road into the newly opened Lahaul Valley through the Atal Tunnel unlocks pristine glacial waterfalls, golden poplar forests, and authentic wooden homestays.",
    category: "Himalayan Detour",
    originCity: "New Delhi",
    destination: "Sissu, Lahaul & Tirthan Valley",
    country: "IN",
    durationDays: 5,
    readingTimeMinutes: 5,
    author: {
      name: "Tanya Sen",
      role: "Himalayan Adventure Guide",
    },
    heroImage: {
      src: "/images/destinations/sissu-waterfall-lahaul.jpg",
      alt: "Sissu waterfall cascading down sheer Himalayan mountain face into turquoise Chandra river in Lahaul Valley",
      caption: "Sissu Glacial Waterfall • Lahaul Valley (3,120m) • Trans-Himalayan Frontier",
      elevationMeters: 3120,
      bestUncrowdedWindow: "7:30 AM – 9:30 AM (Before Day-Tripper Cabs Arrive)",
    },
    budgetInr: {
      backpacker: 11500,
      comfort: 21000,
    },
    detourPair: {
      avoidTouristTrap: "Manali Mall Road & Rohtang Pass 8-Hour Traffic Jams",
      discoverCounterpart: "Sissu Waterfall & Shoja Pine Meadows (Tirthan)",
      distanceAwayKm: 45,
      savingsPercentage: 40,
      reason: "Drive 40 minutes through Atal Tunnel into Lahaul to leave behind commercial chaos for towering granite cliffs, zero honking, and pristine Chandra riverbanks.",
    },
    relatedRouteId: "in-himachal-tirthan",
    sections: [
      {
        heading: "1. The New Express Transit: Kiratpur 4-Lane Route",
        bodyText:
          "The newly opened Kiratpur-Nerchowk expressway bypasses the dreaded Swarghat mountain hairpins, cutting travel time from Delhi to Kullu by over 3.5 hours. Stop at Amrik Sukhdev in Murthal for clean restrooms and tandoori parathas before cruising into the Himalayas.",
        calloutNote:
          "Road Hack: Drive during early morning (depart Delhi at 4:30 AM) to clear the Murthal-Panipat toll corridor with zero commercial truck congestion.",
      },
      {
        heading: "2. The Lahaul Revelation Beyond Atal Tunnel",
        bodyText:
          "The moment you emerge from the north portal of the 9.02km Atal Tunnel, the landscape transforms from lush green pine slopes into dramatic, stark Tibetan-style mountain expanses. Sissu sits on the banks of the turquoise Chandra river with twin waterfalls dropping 150 feet directly opposite the village.",
      },
    ],
  },

  {
    id: "art-delhi-spiti-valley",
    slug: "delhi-to-spiti-valley-cold-desert",
    title: "Delhi to Spiti Valley: The Solo Detourist's Guide to the Middle Land",
    subtitle:
      "1,000-year-old cliffside monasteries, fossil villages at 4,400 meters, and starry night skies that redefine solitude. How to conquer the Kinnaur-Kaza circuit on a budget.",
    category: "Himalayan Detour",
    originCity: "New Delhi",
    destination: "Spiti Valley & Kaza",
    country: "IN",
    durationDays: 8,
    readingTimeMinutes: 7,
    author: {
      name: "Rohan Verma",
      role: "Motorcycle Nomad & High-Altitude Specialist",
    },
    heroImage: {
      src: "/images/destinations/key-monastery-spiti.jpg",
      alt: "Ancient Key Monastery fortress perched on conical desert hill at 4,166m elevation in Spiti Valley",
      caption: "Key Gompa • Spiti Valley (4,166m) • 1,000 Years of Buddhist Solitude",
      elevationMeters: 4166,
      bestUncrowdedWindow: "Early Morning (Sunrise Prayer Chants at 6:00 AM)",
    },
    budgetInr: {
      backpacker: 14500,
      comfort: 27500,
    },
    detourPair: {
      avoidTouristTrap: "Commercialized Cafes in Kaza Market",
      discoverCounterpart: "Dhankar Monastery Cliff & Mudh Village (Pin Valley)",
      distanceAwayKm: 32,
      savingsPercentage: 30,
      reason: "Dhankar offers dramatic mud-cliff forts overlooking the river confluence, silent meditation rooms, and homestays serving authentic seabuckthorn tea.",
    },
    relatedRouteId: "in-himachal-spiti",
    sections: [
      {
        heading: "1. The Acclimatization Route: Always via Shimla-Kinnaur",
        bodyText:
          "Never rush into Spiti via Manali directly to 4,000m unless you want Acute Mountain Sickness (AMS). Take the gradual ascent through Kinnaur (Delhi → Shimla → Kalpa → Nako → Kaza). Your body naturally adapts to the thinning oxygen while you witness the roaring Sutlej gorge.",
        calloutNote:
          "AMS Rule: Drink 4 liters of water daily. Keep Diamox handy and avoid sleeping above 3,500m on Day 1.",
      },
      {
        heading: "2. Monastic Silence at Key Gompa",
        bodyText:
          "Climbing up the narrow wooden ladders of Key Monastery as young lama monks chant ancient Pali verses in deep guttural tones is a transcendent experience. Sip warm butter tea in the monastery kitchen with the monks before exploring the fossil beds of Langza.",
      },
    ],
  },

  {
    id: "art-siliguri-paro-bhutan",
    slug: "siliguri-to-paro-bhutan-overland",
    title: "Siliguri to Paro (Bhutan): The Smart Overland Guide for Indians",
    subtitle:
      "Demystifying the ₹1,200/night SDF fee, taking the scenic border train to Hasimara, and hiking to Tiger's Nest cliff without paying luxury agency markups.",
    category: "Cross-Border Overland",
    originCity: "Siliguri / Bagdogra",
    destination: "Paro & Thimphu",
    country: "BT",
    durationDays: 5,
    readingTimeMinutes: 6,
    author: {
      name: "Karma Tshering",
      role: "Bhutan Cultural Guide",
    },
    heroImage: {
      src: "/images/destinations/paro-tigers-nest-bhutan.jpg",
      alt: "Paro Taktsang Tiger's Nest Monastery built on sheer vertical granite cliff in morning mist",
      caption: "Paro Taktsang (Tiger's Nest) • Paro (3,120m) • Bhutan's Holiest Sanctuary",
      elevationMeters: 3120,
      bestUncrowdedWindow: "Start Hike at 7:00 AM (Beat Horse Caravans and Heat)",
    },
    budgetInr: {
      backpacker: 28500,
      comfort: 46000,
    },
    detourPair: {
      avoidTouristTrap: "Midday Tour Groups on Taktsang Cafeteria Trail",
      discoverCounterpart: "Cheri Monastery & Tango University (Thimphu North)",
      distanceAwayKm: 14,
      savingsPercentage: 35,
      reason: "Tucked into pine forests, Cheri Monastery offers peaceful monk meditation rooms, mountain rivers, zero tour crowds, and identical spiritual elevation.",
    },
    relatedRouteId: "bt-paro-thimphu",
    sections: [
      {
        heading: "1. The Indian SDF Privilege Explained",
        bodyText:
          "While international travelers pay $100 per night Sustainable Development Fee (SDF), Indian passport and voter ID holders pay a subsidized SDF of ₹1,200 per night (50% discount for children aged 6-12). Indian Rupee cash is officially accepted 1:1 with Bhutanese Ngultrum everywhere.",
        calloutNote:
          "Permit Requirement: Must pre-book certified 3-star+ hotel and a certified Bhutanese tour guide before entry at Phuentsholing.",
      },
      {
        heading: "2. The Sacred Ascent to the Tiger's Nest",
        bodyText:
          "Climbing through fluttering prayer flags and blue pine forests to reach Guru Rinpoche's meditation cave 900 meters above the valley floor is life-changing. Take the early morning window at 7:00 AM to hear the gentle wind chimes in absolute stillness.",
      },
    ],
  },
];
