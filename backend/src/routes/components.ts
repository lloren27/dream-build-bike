import { Router, type Request, type Response } from "express";
import { components } from "../seed";
import type { BikeComponent, ComponentCategory } from "../types";

const router = Router();

interface ComponentsQuery {
  category?: ComponentCategory;
}

router.get("/", (req: Request<unknown, unknown, unknown, ComponentsQuery>, res: Response) => {
  const { category } = req.query;
  const result: BikeComponent[] = category
    ? components.filter((component: BikeComponent) => component.category === category)
    : components;

  res.json({ data: result });
});

export default router;
