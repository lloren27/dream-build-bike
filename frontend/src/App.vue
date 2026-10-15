<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type {
  BikeComponent,
  BuildValidationResponse,
  ComponentCategory,
  ComponentOption,
  ComponentsResponse,
  ValidationResult
} from "./types";

const apiUrl: string = import.meta.env.VITE_API_URL || "http://localhost:4000";
const categories: ComponentOption[] = [
  { id: "frameset", label: "Cuadro" },
  { id: "groupset", label: "Grupo" },
  { id: "wheels", label: "Ruedas" },
  { id: "cockpit", label: "Cockpit" }
];

const components = ref<BikeComponent[]>([]);
const selected = ref<Partial<Record<ComponentCategory, string>>>({});
const validation = ref<ValidationResult | null>(null);
const loading = ref<boolean>(true);
const catalogError = ref<string>("");
const validationError = ref<string>("");
const validationLoading = ref<boolean>(false);
let validationRequestId = 0;

const selectedComponents = computed<BikeComponent[]>(() =>
  Object.values(selected.value)
    .map((id: string | undefined) =>
      components.value.find((component: BikeComponent) => component.id === id)
    )
    .filter((component): component is BikeComponent => Boolean(component))
);

const totalPrice = computed<number>(() =>
  selectedComponents.value.reduce(
    (sum: number, component: BikeComponent) => sum + component.price,
    0
  )
);

const totalWeight = computed<number>(() =>
  selectedComponents.value.reduce(
    (sum: number, component: BikeComponent) => sum + component.weight,
    0
  )
);

onMounted(loadCatalog);

async function loadCatalog(): Promise<void> {
  loading.value = true;
  catalogError.value = "";
  try {
    const response: Response = await fetch(`${apiUrl}/api/components`);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el catálogo (HTTP ${response.status})`);
    }
    const payload: ComponentsResponse = await response.json();
    components.value = payload.data;

    categories.forEach((category: ComponentOption) => {
      const firstOption: BikeComponent | undefined = components.value.find(
        (component: BikeComponent) => component.category === category.id
      );
      if (firstOption) selected.value[category.id] = firstOption.id;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    catalogError.value = message.startsWith("No se pudo cargar el catálogo (HTTP ")
      ? message
      : "No se pudo cargar el catálogo. Comprueba la conexión e inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
}

watch(selected, validateCurrentBuild, { deep: true });

async function validateCurrentBuild(): Promise<void> {
  const requestId = ++validationRequestId;
  validation.value = null;
  validationError.value = "";
  validationLoading.value = true;

  try {
    const response: Response = await fetch(`${apiUrl}/api/builds/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIds: Object.values(selected.value) })
    });
    if (!response.ok) {
      throw new Error(`No se pudo validar la configuración (HTTP ${response.status})`);
    }
    const payload: BuildValidationResponse = await response.json();
    if (requestId === validationRequestId) {
      validation.value = payload.data.validation;
    }
  } catch (error) {
    if (requestId === validationRequestId) {
      const message = error instanceof Error ? error.message : "";
      validationError.value = message.startsWith("No se pudo validar la configuración (HTTP ")
        ? message
        : "No se pudo validar la configuración. Comprueba la conexión e inténtalo de nuevo.";
    }
  } finally {
    if (requestId === validationRequestId) {
      validationLoading.value = false;
    }
  }
}

function optionsFor(category: ComponentCategory): BikeComponent[] {
  return components.value.filter(
    (component: BikeComponent) => component.category === category
  );
}
</script>

<template>
  <main class="shell">
    <section class="workspace">
      <div class="visual">
        <div class="bike">
          <div class="wheel wheel-front"></div>
          <div class="wheel wheel-back"></div>
          <div class="frame"></div>
          <div class="bar"></div>
          <div class="saddle"></div>
          <div class="crank"></div>
        </div>
      </div>

      <aside class="summary">
        <p class="eyebrow">Road configurator</p>
        <h1>Dream Build Bike</h1>
        <div class="metrics">
          <div>
            <span>Precio</span>
            <strong>{{ totalPrice.toLocaleString("es-ES") }} EUR</strong>
          </div>
          <div>
            <span>Peso</span>
            <strong>{{ (totalWeight / 1000).toFixed(2) }} kg</strong>
          </div>
        </div>
        <p v-if="validationLoading" class="validation-status">Validando configuración...</p>
        <div v-else-if="validationError" class="error" role="alert">
          <p>{{ validationError }}</p>
          <button type="button" @click="validateCurrentBuild">Reintentar validación</button>
        </div>
        <p v-else-if="validation?.valid" class="valid">Configuracion compatible</p>
        <ul v-else-if="validation" class="issues">
          <li v-for="issue in validation.issues" :key="issue.id">
            {{ issue.message }}
          </li>
        </ul>
      </aside>
    </section>

    <section class="configurator">
      <p v-if="loading">Cargando catalogo...</p>
      <div v-else-if="catalogError" class="error" role="alert">
        <p>{{ catalogError }}</p>
        <button type="button" @click="loadCatalog">Reintentar carga del catálogo</button>
      </div>
      <template v-else>
        <label v-for="category in categories" :key="category.id">
          <span>{{ category.label }}</span>
          <select v-model="selected[category.id]">
            <option
              v-for="component in optionsFor(category.id)"
              :key="component.id"
              :value="component.id"
            >
              {{ component.brand }} {{ component.model }}
            </option>
          </select>
        </label>
      </template>
    </section>
  </main>
</template>
