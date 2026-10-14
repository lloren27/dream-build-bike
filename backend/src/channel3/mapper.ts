import type { ProductReference } from "../types";
import type { Channel3MappedReferenceInput, Channel3Offer } from "./types";

export function mapChannel3ProductToReference(
  input: Channel3MappedReferenceInput
): ProductReference {
  const primaryOffer: Channel3Offer | undefined = input.product.offers?.[0];
  const primaryImage = input.product.images?.[0];
  const imageUrl = primaryImage?.url ?? primaryImage?.src ?? primaryImage?.thumbnail_url;

  return {
    id: `channel3-${input.product.id}`,
    provider: "channel3",
    providerProductId: input.product.id,
    category: input.category,
    targetBrand: input.targetBrand,
    title: input.product.title,
    description: input.product.description,
    brandNames: input.product.brands?.map((brand) => brand.name) ?? [],
    imageUrl,
    offerUrl: primaryOffer?.url,
    price: primaryOffer?.price?.price,
    currency: primaryOffer?.price?.currency,
    availability: primaryOffer?.availability,
    sourceQuery: input.sourceQuery,
    raw: input.product,
    status: "candidate",
    importedAt: input.importedAt
  };
}
