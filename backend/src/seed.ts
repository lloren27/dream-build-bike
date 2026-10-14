import type { BikeComponent } from "./types";

export const components: BikeComponent[] = [
  {
    id: "frame-aero-disc-carbon",
    category: "frameset",
    brand: "Demo Cycles",
    model: "Aero Disc Carbon",
    year: 2026,
    price: 3299,
    weight: 890,
    imageUrl: "",
    paintOptions: ["Gloss Red", "Raw Carbon", "Pearl White"],
    standards: {
      brake: "disc",
      seatpost: "proprietary-aero",
      bottomBracket: "t47",
      maxTyre: 32
    },
    compatibilityTags: ["road", "aero", "disc", "electronic-ready"],
    source: {
      provider: "seed",
      sourceUrl: "https://example.com/source/frame-aero-disc-carbon"
    },
    sourceUrl: "https://example.com/source/frame-aero-disc-carbon"
  },
  {
    id: "groupset-wireless-12",
    category: "groupset",
    brand: "Demo Components",
    model: "Wireless Road 12",
    year: 2026,
    price: 2199,
    weight: 2450,
    imageUrl: "",
    paintOptions: [],
    standards: {
      speeds: 12,
      brake: "disc",
      shifting: "electronic"
    },
    compatibilityTags: ["road", "disc", "12-speed", "electronic"],
    source: {
      provider: "seed"
    }
  },
  {
    id: "wheels-carbon-disc-50",
    category: "wheels",
    brand: "Demo Wheels",
    model: "Carbon Disc 50",
    year: 2026,
    price: 1499,
    weight: 1480,
    imageUrl: "",
    paintOptions: [],
    standards: {
      brake: "disc",
      axle: "12x100-12x142",
      speeds: [11, 12, 13]
    },
    compatibilityTags: ["road", "disc", "tubeless"],
    source: {
      provider: "seed"
    }
  },
  {
    id: "cockpit-integrated-aero",
    category: "cockpit",
    brand: "Demo Cockpit",
    model: "Integrated Aero",
    year: 2026,
    price: 549,
    weight: 350,
    imageUrl: "",
    paintOptions: ["Black"],
    standards: {
      clamp: "integrated",
      routing: "internal"
    },
    compatibilityTags: ["road", "aero", "internal-routing"],
    source: {
      provider: "seed"
    }
  }
];
