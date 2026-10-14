import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import componentsRouter from "./routes/components";
import buildsRouter from "./routes/builds";
import catalogRouter from "./routes/catalog";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "dream-build-bike-api" });
});

app.use("/api/components", componentsRouter);
app.use("/api/builds", buildsRouter);
app.use("/api/catalog", catalogRouter);

app.listen(port, () => {
  console.log(`Dream Build Bike API listening on http://localhost:${port}`);
});
