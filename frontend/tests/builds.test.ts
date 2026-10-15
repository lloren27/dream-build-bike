import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import buildsRouter from "../../backend/src/routes/builds";

const app = express();
app.use(express.json());
app.use("/api/builds", buildsRouter);

describe("POST /api/builds/validate", () => {
  it.each([
    ["missing selectedIds", {}],
    ["null selectedIds", { selectedIds: null }],
    ["a string instead of an array", { selectedIds: "frame-aero-disc-carbon" }],
    ["an empty identifier", { selectedIds: [""] }],
    ["a non-string identifier", { selectedIds: [123] }],
    ["a mixed array", { selectedIds: ["frame-aero-disc-carbon", null] }]
  ])("returns HTTP 400 for %s", async (_description, body) => {
    const response = await request(app).post("/api/builds/validate").send(body);

    expect(response.status).toBe(400);
  });

  it("returns HTTP 400 if any identifier is absent from the catalog", async () => {
    const response = await request(app)
      .post("/api/builds/validate")
      .send({ selectedIds: ["frame-aero-disc-carbon", "unknown-component"] });

    expect(response.status).toBe(400);
  });

  it("accepts an empty selection as valid", async () => {
    const response = await request(app)
      .post("/api/builds/validate")
      .send({ selectedIds: [] });

    expect(response.status).toBe(200);
    expect(response.body.data.selectedComponents).toEqual([]);
    expect(response.body.data.validation).toEqual({ valid: true, issues: [] });
  });

  it("validates a selection containing known identifiers", async () => {
    const response = await request(app)
      .post("/api/builds/validate")
      .send({ selectedIds: ["frame-aero-disc-carbon"] });

    expect(response.status).toBe(200);
    expect(response.body.data.selectedComponents.map((component: { id: string }) => component.id))
      .toEqual(["frame-aero-disc-carbon"]);
  });
});
