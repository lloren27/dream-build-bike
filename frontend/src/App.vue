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
const validation = ref<ValidationResult>({ valid: true, issues: [] });
const loading = ref<boolean>(true);

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

onMounted(async () => {
  const response: Response = await fetch(`${apiUrl}/api/components`);
  const payload: ComponentsResponse = await response.json();
  components.value = payload.data;

  categories.forEach((category: ComponentOption) => {
    const firstOption: BikeComponent | undefined = components.value.find(
      (component: BikeComponent) => component.category === category.id
    );
    if (firstOption) selected.value[category.id] = firstOption.id;
  });

  loading.value = false;
});

watch(selected, validateCurrentBuild, { deep: true });

async function validateCurrentBuild(): Promise<void> {
  const response: Response = await fetch(`${apiUrl}/api/builds/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedIds: Object.values(selected.value) })
  });
  const payload: BuildValidationResponse = await response.json();
  validation.value = payload.data.validation;
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
        <p v-if="validation.valid" class="valid">Configuracion compatible</p>
        <ul v-else class="issues">
          <li v-for="issue in validation.issues" :key="issue.id">
            {{ issue.message }}
          </li>
        </ul>
      </aside>
    </section>

    <section class="configurator">
      <p v-if="loading">Cargando catalogo...</p>
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
    </section>
  </main>
</template>
