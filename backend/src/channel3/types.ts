import type { ComponentCategory } from "../types";

export interface Channel3Money {
  price?: number;
  currency?: string;
  compare_at_price?: number;
}

export interface Channel3Offer {
  url?: string;
  domain?: string;
  availability?: string;
  price?: Channel3Money;
  max_commission_rate?: number;
}

export interface Channel3Brand {
  id?: string;
  name: string;
}

export interface Channel3Image {
  url?: string;
  src?: string;
  thumbnail_url?: string;
}

export interface Channel3Category {
  slug?: string;
  title?: string;
}

export interface Channel3Product {
  id: string;
  title: string;
  description?: string;
  brands?: Channel3Brand[];
  images?: Channel3Image[];
  category?: Channel3Category;
  categories?: Channel3Category[];
  materials?: string[];
  key_features?: string[];
  offers?: Channel3Offer[];
  structured_attributes?: Record<string, unknown>;
}

export interface Channel3SearchRequest {
  query: string;
  limit: number;
  filters?: {
    conditions?: string[];
    availability?: string[];
  };
  config?: {
    country?: string;
    currency?: string;
    language?: string;
    mode?: string;
  };
  page_token?: string;
}

export interface Channel3SearchResponse {
  products: Channel3Product[];
  next_page_token?: string | null;
}

export interface Channel3MappedReferenceInput {
  product: Channel3Product;
  category: ComponentCategory;
  targetBrand: string;
  sourceQuery: string;
  importedAt: string;
}
