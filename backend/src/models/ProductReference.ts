import mongoose, { Schema, type Model } from "mongoose";
import type { ProductReference } from "../types";

export interface ProductReferenceDocument extends Omit<ProductReference, "id"> {}

const productReferenceSchema = new Schema<ProductReferenceDocument>(
  {
    provider: { type: String, required: true, index: true },
    providerProductId: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    targetBrand: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    brandNames: { type: [String], default: [] },
    imageUrl: String,
    offerUrl: String,
    price: Number,
    currency: String,
    availability: String,
    sourceQuery: { type: String, required: true },
    raw: { type: Schema.Types.Mixed, required: true },
    status: { type: String, required: true, default: "candidate" },
    importedAt: { type: String, required: true }
  },
  { timestamps: true }
);

productReferenceSchema.index(
  { provider: 1, providerProductId: 1 },
  { unique: true }
);

export const ProductReferenceModel: Model<ProductReferenceDocument> =
  mongoose.model<ProductReferenceDocument>("ProductReference", productReferenceSchema);
