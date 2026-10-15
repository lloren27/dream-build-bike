import { Router, type Request, type Response } from "express";
import { components } from "../seed";
import { validateBuild } from "../services/compatibility";
import type { BikeComponent, BuildValidationResponse } from "../types";

const router = Router();

interface ValidateBuildBody {
  selectedIds?: unknown;
}

interface ValidationErrorResponse {
  error: string;
}

router.post(
  "/validate",
  (
    req: Request<unknown, unknown, ValidateBuildBody>,
    res: Response<BuildValidationResponse | ValidationErrorResponse>
  ) => {
    const selectedIds: unknown = req.body?.selectedIds;

    if (
      !Array.isArray(selectedIds) ||
      !selectedIds.every((id: unknown) => typeof id === "string" && id.length > 0)
    ) {
      return res.status(400).json({ error: "selectedIds must be an array of non-empty strings." });
    }

    const selectedComponents: BikeComponent[] = [];
    for (const id of selectedIds as string[]) {
      const component: BikeComponent | undefined = components.find(
        (candidate: BikeComponent) => candidate.id === id
      );
      if (!component) {
        return res.status(400).json({ error: `Unknown component identifier: ${id}.` });
      }
      selectedComponents.push(component);
    }

    return res.json({
      data: {
        selectedComponents,
        validation: validateBuild(selectedComponents)
      }
    });
  }
);

export default router;
