import { Router, type Request, type Response } from "express";
import { components } from "../seed";
import { validateBuild } from "../services/compatibility";
import type { BikeComponent, BuildValidationResponse } from "../types";

const router = Router();

interface ValidateBuildBody {
  selectedIds?: string[];
}

router.post(
  "/validate",
  (req: Request<unknown, unknown, ValidateBuildBody>, res: Response<BuildValidationResponse>) => {
    const selectedIds: string[] = req.body.selectedIds ?? [];
    const selectedComponents: BikeComponent[] = selectedIds
      .map((id: string) => components.find((component: BikeComponent) => component.id === id))
      .filter((component): component is BikeComponent => Boolean(component));

    res.json({
      data: {
        selectedComponents,
        validation: validateBuild(selectedComponents)
      }
    });
  }
);

export default router;
