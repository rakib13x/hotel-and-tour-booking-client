export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: number;
  nights?: number;
  price: number;
  originalPrice?: number;
  bookingFeePercentage?: number;
  image: string;
  bookingFee: number;
  galleryImages?: string[];
  categoryName?: string;
  highlights: string[];
  attractions: string[];
  category: "regular" | "combo" | "latest" | "recommended";
  isRecommended?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  terms: string[];
  otherDetails: {
    transportation: string[];
    specialNotes: string[];
    contactInfo: string;
    emergencyContact: string;
  };
  visaRequirements: {
    required: boolean;
    documents: string[];
    processingTime: string;
    applicationProcedure: string;
  };
  packageCode: string;
  validFrom: string;
  validTo: string;
}

export interface DayItinerary {
  day: number;
  location: string;
  title?: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  transportation: string;
  timeFrom?: string;
  timeTo?: string;
  description?: string;
}

export const mockPackages: TravelPackage[] = [
  {
    id: "europe-13-days-group-tour",
    title: "Europe 13 Days Group Tour",
    destination:
      "Netherlands, Belgium, France, Switzerland, Luxembourg, Germany, Austria, Italy",
    country: "Multiple",
    duration: 13,
    bookingFee: 398000,
    price: 398000,
    originalPrice: 398500,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    highlights: [
      "Amsterdam Canal Cruise",
      "Paris Eiffel Tower",
      "Swiss Alps",
      "Rome Colosseum",
      "Venice Gondola Ride",
      "Interlaken Scenic Views",
    ],
    attractions: [
      "Amsterdam, Ghent, Bruges",
      "Paris, Leaning Tower of Pisa",
      "Interlaken, Colosseum photo stop",
      "Luxembourg, Germany, Austria",
    ],
    category: "recommended",
    isRecommended: true,
    rating: 4.9,
    reviewCount: 156,
    description:
      "Experience the best of Europe with this comprehensive 13-day group tour covering 8 countries including Netherlands, Belgium, France, Switzerland, Luxembourg, Germany, Austria, and Italy.",
    packageCode: "EU001",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    itinerary: [
      {
        day: 1,
        location: "Netherlands",
        activities: [
          "Arrival at Amsterdam Airport",
          "Hotel check-in",
          "Amsterdam Canal Cruise",
          "Dam Square visit",
          "Anne Frank House",
        ],
        accommodation: "Hotel in Amsterdam",
        meals: ["Welcome Dinner"],
        transportation: "Airport Transfer, Bus, Walking",
      },
      {
        day: 2,
        location: "Netherlands",
        activities: [
          "Zaanse Schans Windmills",
          "Volendam fishing village",
          "Cheese tasting",
          "Free time in Amsterdam",
        ],
        accommodation: "Hotel in Amsterdam",
        meals: ["Breakfast", "Lunch"],
        transportation: "Bus, Walking",
      },
      {
        day: 3,
        location: "Belgium",
        activities: [
          "Travel to Ghent",
          "Ghent city tour",
          "Bruges medieval town",
          "Chocolate tasting",
          "Canal boat ride",
        ],
        accommodation: "Hotel in Brussels",
        meals: ["Breakfast", "Dinner"],
        transportation: "Bus, Walking",
      },
    ],
    inclusions: [
      "Hotel Accommodation",
      "Daily Breakfast",
      "Airport pick and drop",
      "All Transfers",
      "Sightseeing at Netherlands, Belgium, France, Switzerland, Luxembourg, Germany, Austria, Italy",
      "English speaking guide",
      "Group tour coordination",
    ],
    exclusions: [
      "Lunch & dinner",
      "Guest Insurance",
      "Personal Expenses",
      "All Entry fees",
      "Air Fare",
      "Train Fare",
      "Anything not mentioned in inclusions",
    ],
    terms: [
      "International Hotel Check in Time: 3 PM (If Hotel rooms are available some time Hotel Management can Give Early Check in on request)",
      "International Hotel Check out Time: 12 PM (if you need Early Check in & Late Check out, You can Pay Direct to Hotel Reception as per hotel Rules)",
      "Booking confirmation required 30 days in advance",
      "Cancellation policy: 50% refund if cancelled 15 days before departure",
      "Valid passport required with 6 months validity",
      "Minimum 2 passengers required for group departure",
    ],
    otherDetails: {
      transportation: ["Tours by Bus/Train/Micro/Walking"],
      specialNotes: [
        "Comfortable walking shoes recommended",
        "Weather-appropriate clothing",
        "Camera for memorable photos",
      ],
      contactInfo: "+8801778889203",
      emergencyContact: "rescosmosbd@gmail.com",
    },
    visaRequirements: {
      required: true,
      documents: [
        "Valid passport",
        "Visa application form",
        "Passport photos",
        "Bank statements",
      ],
      processingTime: "5-7 business days",
      applicationProcedure: "Apply at Japanese Embassy or Consulate",
    },
  },
  {
    id: "thailand-beach-2024",
    title: "Thailand Beach Paradise",
    destination: "Bangkok, Phuket, Krabi",
    country: "Thailand",
    duration: 6,
    bookingFee: 398000,
    price: 85000,
    originalPrice: 100000,
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    highlights: [
      "Tropical Beaches",
      "Island Hopping",
      "Thai Cuisine",
      "Night Markets",
    ],
    attractions: [
      "Wat Pho Temple",
      "Phi Phi Islands",
      "Railay Beach",
      "Chatuchak Market",
    ],
    category: "regular",
    rating: 4.6,
    reviewCount: 89,
    description:
      "Discover the beauty of Thailand with pristine beaches, vibrant culture, and delicious cuisine.",
    packageCode: "THA-BCH-2024",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    itinerary: [
      {
        day: 1,
        location: "Bangkok",
        activities: [
          "Arrival at Suvarnabhumi Airport",
          "Hotel check-in",
          "Wat Pho Temple",
          "Khao San Road",
        ],
        accommodation: "Bangkok Marriott Hotel",
        meals: ["Welcome Dinner"],
        transportation: "Airport Transfer, Tuk-tuk",
      },
    ],
    inclusions: [
      "5 nights accommodation in 4-star hotels",
      "Daily breakfast",
      "Airport transfers",
      "Island hopping tour",
      "Temple visits",
      "English speaking guide",
    ],
    exclusions: [
      "Lunch & dinner (except welcome dinner)",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "International airfare",
    ],
    terms: [
      "Hotel check-in: 2:00 PM, check-out: 12:00 PM",
      "Booking confirmation required 14 days in advance",
      "Cancellation policy: 30% refund if cancelled 7 days before departure",
    ],
    otherDetails: {
      transportation: ["Airport Transfer", "Boat", "Tuk-tuk", "Walking"],
      specialNotes: ["Sun protection recommended", "Respect local customs"],
      contactInfo: "+880-1234-567890",
      emergencyContact: "+880-9876-543210",
    },
    visaRequirements: {
      required: false,
      documents: ["Valid passport"],
      processingTime: "On arrival",
      applicationProcedure: "Visa on arrival available",
    },
  },
  {
    id: "europe-combo-2024",
    title: "European Grand Tour",
    destination: "Paris, Rome, Barcelona, Amsterdam",
    country: "Multiple",
    duration: 12,
    bookingFee: 398000,
    price: 250000,
    originalPrice: 300000,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    highlights: [
      "Eiffel Tower",
      "Colosseum",
      "Sagrada Familia",
      "Canal Cruise",
    ],
    attractions: [
      "Louvre Museum",
      "Vatican City",
      "Park Güell",
      "Anne Frank House",
    ],
    category: "combo",
    rating: 4.9,
    reviewCount: 156,
    description:
      "Experience the best of Europe with this comprehensive 12-day tour covering four iconic cities.",
    packageCode: "EUR-GRD-2024",
    validFrom: "2024-04-01",
    validTo: "2024-10-31",
    itinerary: [
      {
        day: 1,
        location: "Paris",
        activities: [
          "Arrival at CDG Airport",
          "Hotel check-in",
          "Eiffel Tower",
          "Seine River Cruise",
        ],
        accommodation: "Hotel des Grands Boulevards",
        meals: ["Welcome Dinner"],
        transportation: "Airport Transfer, Metro",
      },
    ],
    inclusions: [
      "11 nights accommodation in 4-star hotels",
      "Daily breakfast",
      "Airport transfers",
      "City tours",
      "Museum entries",
      "Train tickets between cities",
      "English speaking guide",
    ],
    exclusions: [
      "Lunch & dinner (except welcome dinner)",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "International airfare",
      "Visa fees",
    ],
    terms: [
      "Hotel check-in: 3:00 PM, check-out: 11:00 AM",
      "Booking confirmation required 45 days in advance",
      "Cancellation policy: 25% refund if cancelled 30 days before departure",
    ],
    otherDetails: {
      transportation: ["Train", "Metro", "Walking", "Airport Transfer"],
      specialNotes: [
        "Schengen visa required",
        "Comfortable walking shoes essential",
      ],
      contactInfo: "+880-1234-567890",
      emergencyContact: "+880-9876-543210",
    },
    visaRequirements: {
      required: true,
      documents: [
        "Valid passport",
        "Schengen visa",
        "Travel insurance",
        "Bank statements",
      ],
      processingTime: "15-20 business days",
      applicationProcedure: "Apply at Schengen Embassy",
    },
  },
  {
    id: "maldives-luxury-2024",
    title: "Maldives Luxury Escape",
    bookingFee: 398000,
    destination: "Malé, Baa Atoll",
    country: "Maldives",
    duration: 5,
    price: 180000,
    originalPrice: 220000,
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    highlights: [
      "Overwater Villas",
      "Coral Reefs",
      "Spa Treatments",
      "Sunset Cruises",
    ],
    attractions: [
      "Hanifaru Bay",
      "Malé Fish Market",
      "Artificial Beach",
      "National Museum",
    ],
    category: "latest",
    rating: 4.7,
    reviewCount: 78,
    description:
      "Indulge in luxury at the pristine beaches and crystal-clear waters of the Maldives.",
    packageCode: "MDV-LUX-2024",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    itinerary: [
      {
        day: 1,
        location: "Malé",
        activities: [
          "Arrival at Velana Airport",
          "Seaplane transfer",
          "Resort check-in",
          "Welcome ceremony",
        ],
        accommodation: "Conrad Maldives Rangali Island",
        meals: ["Welcome Dinner"],
        transportation: "Seaplane, Boat",
      },
    ],
    inclusions: [
      "4 nights in overwater villa",
      "All meals included",
      "Airport transfers",
      "Snorkeling equipment",
      "Spa treatment (1 session)",
      "Sunset cruise",
      "Resort activities",
    ],
    exclusions: [
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "International airfare",
      "Alcoholic beverages",
    ],
    terms: [
      "Resort check-in: 2:00 PM, check-out: 12:00 PM",
      "Booking confirmation required 21 days in advance",
      "Cancellation policy: 40% refund if cancelled 14 days before departure",
    ],
    otherDetails: {
      transportation: ["Seaplane", "Boat", "Walking"],
      specialNotes: ["Resort wear recommended", "Underwater camera suggested"],
      contactInfo: "+880-1234-567890",
      emergencyContact: "+880-9876-543210",
    },
    visaRequirements: {
      required: false,
      documents: ["Valid passport"],
      processingTime: "On arrival",
      applicationProcedure: "Visa on arrival available",
    },
  },
  {
    id: "singapore-family-2024",
    title: "Singapore Family Fun",
    destination: "Singapore",
    bookingFee: 398000,
    country: "Singapore",
    duration: 4,
    price: 75000,
    originalPrice: 90000,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    highlights: [
      "Universal Studios",
      "Gardens by the Bay",
      "Marina Bay Sands",
      "Sentosa Island",
    ],
    attractions: [
      "Merlion Park",
      "Singapore Flyer",
      "Chinatown",
      "Little India",
    ],
    category: "regular",
    rating: 4.5,
    reviewCount: 92,
    description:
      "Perfect family vacation in Singapore with theme parks, gardens, and cultural experiences.",
    packageCode: "SGP-FAM-2024",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    itinerary: [
      {
        day: 1,
        location: "Singapore",
        activities: [
          "Arrival at Changi Airport",
          "Hotel check-in",
          "Marina Bay Sands",
          "Gardens by the Bay",
        ],
        accommodation: "Marina Bay Sands",
        meals: ["Welcome Dinner"],
        transportation: "Airport Transfer, MRT",
      },
    ],
    inclusions: [
      "3 nights accommodation in 5-star hotel",
      "Daily breakfast",
      "Airport transfers",
      "Universal Studios entry",
      "Gardens by the Bay entry",
      "City tour",
      "English speaking guide",
    ],
    exclusions: [
      "Lunch & dinner (except welcome dinner)",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "International airfare",
    ],
    terms: [
      "Hotel check-in: 3:00 PM, check-out: 11:00 AM",
      "Booking confirmation required 14 days in advance",
      "Cancellation policy: 30% refund if cancelled 7 days before departure",
    ],
    otherDetails: {
      transportation: ["MRT", "Taxi", "Walking", "Airport Transfer"],
      specialNotes: ["Comfortable walking shoes", "Light clothing recommended"],
      contactInfo: "+880-1234-567890",
      emergencyContact: "+880-9876-543210",
    },
    visaRequirements: {
      required: false,
      documents: ["Valid passport"],
      processingTime: "On arrival",
      applicationProcedure: "Visa on arrival available",
    },
  },
];

export const packageCategories = [
  { value: "all", label: "All Packages" },
  { value: "regular", label: "Regular" },
  { value: "combo", label: "Combo" },
  { value: "latest", label: "Latest" },
  { value: "recommended", label: "Recommended" },
];

export const destinations = [
  "Japan",
  "Thailand",
  "Maldives",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Vietnam",
  "Philippines",
  "South Korea",
  "Taiwan",
];

export const durationRanges = [
  { min: 1, max: 3, label: "1-3 days" },
  { min: 4, max: 7, label: "4-7 days" },
  { min: 8, max: 14, label: "8-14 days" },
  { min: 15, max: 30, label: "15+ days" },
];

export const priceRanges = [
  { min: 0, max: 50000, label: "Under ৳50,000" },
  { min: 50000, max: 100000, label: "৳50,000 - ৳100,000" },
  { min: 100000, max: 150000, label: "৳100,000 - ৳150,000" },
  { min: 150000, max: 200000, label: "৳150,000 - ৳200,000" },
  { min: 200000, max: 300000, label: "৳200,000+" },
];
