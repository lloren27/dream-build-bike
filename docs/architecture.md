# Arquitectura tecnica

## Vision

Dream Build Bike se plantea como un configurador de producto con reglas de compatibilidad. El sistema debe separar tres responsabilidades:

- Catalogo: componentes, marcas, modelos, tallas, colores y fuentes.
- Referencias externas: candidatos importados desde Channel3.
- Compatibilidad: reglas tecnicas que permiten o bloquean combinaciones.
- Presentacion visual: composicion 2D/3D de la bici configurada.

## Frontend

La app Vue mantiene el estado de la configuracion seleccionada, consulta el catalogo al backend y muestra advertencias cuando una combinacion no es valida. Todo el estado principal esta tipado con TypeScript.

Capas principales:

- `src/App.vue`: experiencia principal del configurador, con `<script setup lang="ts">`.
- `src/main.ts`: arranque de Vue.
- `src/types.ts`: contratos del catalogo, categorias, estandares y validacion.
- `src/style.css`: sistema visual inicial.

## Backend

La API Express expone el catalogo y centraliza la validacion. La validacion debe vivir en backend para que el futuro guardado de builds, precios y enlaces externos no dependa de reglas duplicadas en el navegador.

Capas principales:

- `src/server.ts`: arranque HTTP.
- `src/routes/components.ts`: consulta de catalogo.
- `src/routes/builds.ts`: validacion de configuraciones.
- `src/services/compatibility.ts`: reglas de compatibilidad.
- `src/models/Component.ts`: modelo Mongoose tipado.
- `src/models/ProductReference.ts`: referencias candidatas importadas desde Channel3.
- `src/channel3/*`: cliente, tipos, alcance y mapper de Channel3.
- `src/scripts/importChannel3.ts`: importacion de referencias a snapshot local.
- `src/types.ts`: tipos de dominio compartidos dentro del backend.
- `src/seed.ts`: datos iniciales tipados.

## Base de datos

La primera version usa datos semilla para avanzar sin bloquearse. Cuando el catalogo crezca:

- MongoDB encaja bien si los componentes tienen atributos muy variables.
- PostgreSQL encaja mejor si las reglas relacionales y consultas de compatibilidad se vuelven centrales.

Recomendacion actual: empezar con MongoDB si se quiere prototipar rapido; reevaluar PostgreSQL antes de construir el panel admin definitivo.

## Channel3

Channel3 se usara como base externa de referencias. La app distingue entre:

- `ProductReference`: producto candidato encontrado en Channel3.
- `BikeComponent`: componente aprobado y normalizado para el configurador.

Esto evita que una busqueda externa contamine el configurador con resultados incorrectos. La importacion inicial queda limitada a cuadros, grupos, ruedas y cockpit.

## Visualizacion

Fase 1: composicion 2D con capas por categoria.

Fase 2: imagenes reales normalizadas por componente.

Fase 3: modelos 3D en formato GLB usando Three.js o model-viewer.

## Reglas de compatibilidad

Ejemplos de reglas:

- Un cuadro con `brake: disc` solo acepta frenos y ruedas de disco.
- Un grupo de 12 velocidades requiere cassette/rueda compatible.
- La tija debe coincidir con el diametro o formato propietario del cuadro.
- El tipo de pedalier condiciona bielas y adaptadores.
