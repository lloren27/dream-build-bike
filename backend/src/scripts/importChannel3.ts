import dotenv from "dotenv";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { channel3ImportTargets } from "../channel3/catalogScope";
import { createChannel3ClientFromEnv } from "../channel3/client";
import { mapChannel3ProductToReference } from "../channel3/mapper";
import type { ProductReference } from "../types";

dotenv.config();

async function main(): Promise<void> {
  const client = createChannel3ClientFromEnv();
  const importedAt = new Date().toISOString();
  const referencesByProviderId = new Map<string, ProductReference>();

  for (const target of channel3ImportTargets) {
    console.log(`Searching ${target.category}: ${target.brand}`);
    const response = await client.searchProducts(target.query, target.limit);

    response.products.forEach((product) => {
      const reference = mapChannel3ProductToReference({
        product,
        category: target.category,
        targetBrand: target.brand,
        sourceQuery: target.query,
        importedAt
      });

      if (!referencesByProviderId.has(reference.providerProductId)) {
        referencesByProviderId.set(reference.providerProductId, reference);
      }
    });
  }

  const references = Array.from(referencesByProviderId.values());
  const outputDir = path.resolve(process.cwd(), "data");
  const outputFile = path.join(outputDir, "channel3-product-references.json");

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(references, null, 2));

  console.log(`Saved ${references.length} Channel3 product references to ${outputFile}`);
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
