# Dream Build Bike

Proyecto web para configurar una bici de carretera de ensueno: cuadro, grupo, manillar, tija, ruedas, frenos, pedales y pintura.

## Objetivo del MVP

El primer objetivo no es cubrir todo el mercado, sino validar la experiencia con un catalogo curado:

- Seleccion de componentes por categoria.
- Reglas basicas de compatibilidad.
- Visualizacion inicial 2D del montaje.
- Preparacion para anadir imagenes reales o modelos 3D por componente.
- Backend listo para pasar de datos semilla a MongoDB.

## Arquitectura

```text
dream-build-bike/
  backend/         API Node/Express y modelo de datos
  frontend/        App Vue/Vite del configurador
  docs/            Decisiones tecnicas y roadmap
```

## Stack propuesto

- Frontend: Vue 3 + Vite + TypeScript.
- Backend: Node.js + Express + TypeScript.
- Base de datos inicial: datos semilla en memoria.
- Base de datos futura: MongoDB con Mongoose, o PostgreSQL si las reglas de compatibilidad crecen mucho.
- Datos de producto: Channel3 como proveedor de referencias candidatas.
- Visual futuro: Three.js o model-viewer con modelos glTF/GLB.

## Como arrancar

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

Nota: la configuracion inicial usa TypeScript y versiones compatibles con Node 14.x. Si actualizas a Node 20 LTS, conviene subir Vite, Vue tooling, ts-node y Mongoose a versiones actuales.

## Calidad y tipos

```bash
npm run typecheck
npm run build
```

El frontend tipa las respuestas de API, categorias y estado del configurador. El backend tipa los modelos de componente, los estandares tecnicos, las reglas de compatibilidad y las respuestas HTTP principales.

## Channel3

El proyecto ya incluye una capa tipada para Channel3:

- `backend/src/channel3/client.ts`: cliente HTTP tipado.
- `backend/src/channel3/catalogScope.ts`: marcas y busquedas iniciales.
- `backend/src/channel3/mapper.ts`: conversion de producto Channel3 a `ProductReference`.
- `backend/src/models/ProductReference.ts`: modelo MongoDB para candidatos.
- `backend/src/scripts/importChannel3.ts`: importador a snapshot local.

Variables necesarias:

```bash
CHANNEL3_API_URL=https://api.trychannel3.com
CHANNEL3_API_KEY=
CHANNEL3_COUNTRY=ES
CHANNEL3_CURRENCY=EUR
CHANNEL3_LANGUAGE=es
```

Importar referencias:

```bash
cd backend
npm run import:channel3
```

El resultado se guarda en `backend/data/channel3-product-references.json`. Ese fichero no se sube a Git por defecto.

Endpoint de alcance:

- `GET /api/catalog/channel3/import-targets`

## API inicial

- `GET /health`: estado de la API.
- `GET /api/components`: listado completo de componentes.
- `GET /api/components?category=frameset`: componentes por categoria.
- `POST /api/builds/validate`: valida una configuracion.
- `GET /api/catalog/channel3/import-targets`: marcas y consultas que se enviaran a Channel3.

## Modelo de datos inicial

Cada componente tiene:

- `id`
- `category`
- `brand`
- `model`
- `year`
- `price`
- `weight`
- `imageUrl`
- `paintOptions`
- `standards`
- `compatibilityTags`
- `sourceUrl`

Las compatibilidades se calculan por etiquetas y estandares: freno de disco, velocidades, eje, pedalier, diametro de tija, tipo de cableado, etc.

## Estrategia de datos

1. Empezar con carga manual y fuentes oficiales.
2. Guardar siempre la URL de origen y fecha de revision.
3. Crear un panel admin o importador CSV.
4. Mas adelante conectar feeds de afiliacion, distribuidores o acuerdos con marcas.

## Roadmap

1. Configurador funcional con catalogo semilla.
2. Persistencia real en MongoDB.
3. Importacion Channel3 con revision de candidatos.
4. Administracion de componentes.
5. Visual 2D mas fiel por capas.
6. Visual 3D con modelos GLB.
7. Guardado y comparticion de builds.
8. Precios, disponibilidad y enlaces afiliados.
