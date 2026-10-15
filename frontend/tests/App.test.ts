import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App.vue";

function response(payload: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const catalogResponse = response({
  data: [
    { id: "frame-aero-disc-carbon", category: "frameset", brand: "Demo", model: "Frame A" },
    { id: "frame-endurance-carbon", category: "frameset", brand: "Demo", model: "Frame B" },
    { id: "groupset-wireless-12", category: "groupset", brand: "Demo", model: "Group" },
    { id: "wheels-carbon-disc-50", category: "wheels", brand: "Demo", model: "Wheels" },
    { id: "cockpit-integrated-aero", category: "cockpit", brand: "Demo", model: "Cockpit" }
  ]
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App request behavior", () => {
  it("shows a catalog HTTP error and finishes loading", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({}, 503)));
    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.text()).toContain("No se pudo cargar el catálogo (HTTP 503)");
    expect(wrapper.text()).not.toContain("Cargando catálogo...");
    expect(wrapper.findAll("select")).toHaveLength(0);
    wrapper.unmount();
  });

  it("shows a clear catalog error and finishes loading after a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.text()).toContain("No se pudo cargar el catálogo. Comprueba la conexión e inténtalo de nuevo.");
    expect(wrapper.text()).not.toContain("Cargando catálogo...");
    expect(wrapper.findAll("select")).toHaveLength(0);
    wrapper.unmount();
  });

  it("retries a failed catalog load and shows selectors after recovery", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({}, 503))
      .mockResolvedValueOnce(catalogResponse)
      .mockResolvedValueOnce(response({
        data: { validation: { valid: true, issues: [] } }
      }));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await flushPromises();
    expect(wrapper.findAll("select")).toHaveLength(0);

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).not.toContain("No se pudo cargar el catálogo");
    expect(wrapper.findAll("select")).toHaveLength(4);
    expect(wrapper.findAll("option").length).toBeGreaterThan(0);
    wrapper.unmount();
  });

  it("keeps selectors hidden and exits loading when a catalog retry fails", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({}, 503))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await flushPromises();
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("No se pudo cargar el catálogo. Comprueba la conexión e inténtalo de nuevo.");
    expect(wrapper.text()).not.toContain("Cargando catálogo...");
    expect(wrapper.findAll("select")).toHaveLength(0);
    wrapper.unmount();
  });

  it("shows validation errors and lets the user retry", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(catalogResponse)
      .mockResolvedValueOnce(response({}, 503))
      .mockResolvedValueOnce(response({
        data: { validation: { valid: true, issues: [] } }
      }));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await flushPromises();
    expect(wrapper.text()).toContain("No se pudo validar la configuración (HTTP 503)");

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Configuracion compatible");
    expect(wrapper.text()).not.toContain("No se pudo validar");
    wrapper.unmount();
  });

  it("shows a clear validation error after a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(catalogResponse)
      .mockRejectedValueOnce(new TypeError("Failed to fetch")));
    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.text()).toContain("No se pudo validar la configuración. Comprueba la conexión e inténtalo de nuevo.");
    expect(wrapper.text()).toContain("Reintentar validación");
    wrapper.unmount();
  });

  it("does not show a previous validation as current after a new request fails", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(catalogResponse)
      .mockResolvedValueOnce(response({
        data: { validation: { valid: true, issues: [] } }
      }))
      .mockResolvedValueOnce(response({}, 503));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await flushPromises();
    expect(wrapper.text()).toContain("Configuracion compatible");

    await wrapper.findAll("select")[0].setValue("frame-endurance-carbon");
    await flushPromises();

    expect(wrapper.text()).toContain("No se pudo validar la configuración (HTTP 503)");
    expect(wrapper.text()).not.toContain("Configuracion compatible");
    wrapper.unmount();
  });

  it("keeps the latest validation when an older response arrives afterwards", async () => {
    const oldValidation = deferred<ReturnType<typeof response>>();
    const newValidation = deferred<ReturnType<typeof response>>();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(catalogResponse)
      .mockReturnValueOnce(oldValidation.promise)
      .mockReturnValueOnce(newValidation.promise);
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await flushPromises();
    await wrapper.findAll("select")[0].setValue("frame-endurance-carbon");
    await flushPromises();

    newValidation.resolve(response({
      data: { validation: { valid: false, issues: [{ id: "current", message: "Resultado actual" }] } }
    }));
    await flushPromises();
    expect(wrapper.text()).toContain("Resultado actual");

    oldValidation.resolve(response({
      data: { validation: { valid: true, issues: [] } }
    }));
    await flushPromises();

    expect(wrapper.text()).toContain("Resultado actual");
    expect(wrapper.text()).not.toContain("Configuracion compatible");
    wrapper.unmount();
  });
});
