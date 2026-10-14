import mongoose, { Schema, type Model } from "mongoose";
import type { BikeComponent, ComponentStandards } from "../types";

export interface ComponentDocument extends Omit<BikeComponent, "id"> {
  standards: ComponentStandards;
  reviewedAt?: Date;
}

const componentSchema = new Schema<ComponentDocument>(
  {
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    paintOptions: { type: [String], default: [] },
    standards: { type: Schema.Types.Mixed, default: {} },
    compatibilityTags: { type: [String], default: [] },
    source: { type: Schema.Types.Mixed, required: true },
    sourceUrl: { type: String, default: "" },
    reviewedAt: Date
  },
  { timestamps: true }
);

export const Component: Model<ComponentDocument> = mongoose.model<ComponentDocument>(
  "Component",
  componentSchema
);
