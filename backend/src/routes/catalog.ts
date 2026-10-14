import { Router, type Response } from "express";
import { channel3ImportTargets } from "../channel3/catalogScope";

const router = Router();

router.get("/channel3/import-targets", (_req, res: Response) => {
  res.json({ data: channel3ImportTargets });
});

export default router;
