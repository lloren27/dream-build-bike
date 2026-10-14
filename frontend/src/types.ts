export type ComponentCategory =
  | "frameset"
  | "groupset"
  | "wheels"
  | "cockpit"
  | "handlebar"
  | "seatpost"
  | "brakes"
  | "pedals";

export interface ComponentOption {
  id: ComponentCategory;
  label: string;
}

export type BrakeStandard = "disc" | "rim";
export type ShiftingStandard = "mechanical" | "electronic";
export type CatalogSource = "seed" | "manual" | "channel3";

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

export interface ComponentsResponse {
  data: BikeComponent[];
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
