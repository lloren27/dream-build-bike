import type { ComponentCategory } from "../types";

export interface Channel3ImportTarget {
  category: ComponentCategory;
  brand: string;
  query: string;
  limit: number;
}

const frameBrands = [
  "Canyon",
  "Trek",
  "Specialized",
  "Giant",
  "Cannondale",
  "Orbea",
  "Cervelo",
  "Factor"
] as const;

const groupsetModels = [
  "Shimano 105 Di2",
  "Shimano Ultegra Di2",
  "Shimano Dura-Ace Di2",
  "SRAM Rival AXS",
  "SRAM Force AXS",
  "SRAM RED AXS",
  "SRAM Force XPLR",
  "SRAM RED XPLR"
] as const;

const wheelBrands = ["DT Swiss", "Zipp", "ENVE", "Shimano", "Bontrager", "Roval"] as const;

const cockpitBrands = [
  "Zipp",
  "PRO",
  "Deda",
  "Vision",
  "ENVE",
  "specific frame cockpit"
] as const;

export const channel3ImportTargets: Channel3ImportTarget[] = [
  ...frameBrands.map((brand: string) => ({
    category: "frameset" as const,
    brand,
    query: `${brand} road bike frameset carbon disc frame`,
    limit: 10
  })),
  ...groupsetModels.map((brand: string) => ({
    category: "groupset" as const,
    brand,
    query: `${brand} road groupset disc electronic`,
    limit: 10
  })),
  ...wheelBrands.map((brand: string) => ({
    category: "wheels" as const,
    brand,
    query: `${brand} road bike carbon disc wheelset`,
    limit: 10
  })),
  ...cockpitBrands.map((brand: string) => ({
    category: "cockpit" as const,
    brand,
    query:
      brand === "specific frame cockpit"
        ? "integrated cockpit road bike frameset proprietary handlebar stem"
        : `${brand} road bike integrated cockpit handlebar stem`,
    limit: 10
  }))
];
