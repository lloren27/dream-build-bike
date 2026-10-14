export const componentCategories = [
  "frameset",
  "groupset",
  "wheels",
  "cockpit",
  "handlebar",
  "seatpost",
  "brakes",
  "pedals"
] as const;

export type ComponentCategory = (typeof componentCategories)[number];

export type BrakeStandard = "disc" | "rim";
export type ShiftingStandard = "mechanical" | "electronic";
export type CatalogSource = "seed" | "manual" | "channel3";
export type ReferenceStatus = "candidate" | "approved" | "rejected";

export interface ComponentStandards {
  brake?: BrakeStandard;
  seatpost?: string;
  bottomBracket?: string;
  maxTyre?: number;
  speeds?: number | number[];
  shifting?: ShiftingStandard;
  axle?: string;
  clamp?: string;
  routing?: string;
  mount?: string;
  cleat?: string;
}

export interface ComponentSourceReference {
  provider: CatalogSource;
  providerProductId?: string;
  sourceUrl?: string;
  importedAt?: string;
  query?: string;
}

export interface BikeComponent {
  id: string;
  category: ComponentCategory;
  brand: string;
  model: string;
  year: number;
  price: number;
  weight: number;
  imageUrl: string;
  paintOptions: string[];
  standards: ComponentStandards;
  compatibilityTags: string[];
  source: ComponentSourceReference;
  sourceUrl?: string;
}

export interface ProductReference {
  id: string;
  provider: "channel3";
  providerProductId: string;
  category: ComponentCategory;
  targetBrand: string;
  title: string;
  description?: string;
  brandNames: string[];
  imageUrl?: string;
  offerUrl?: string;
  price?: number;
  currency?: string;
  availability?: string;
  sourceQuery: string;
  raw: unknown;
  status: ReferenceStatus;
  importedAt: string;
}

export interface ValidationIssue {
  id: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface BuildValidationResponse {
  data: {
    selectedComponents: BikeComponent[];
    validation: ValidationResult;
  };
}
