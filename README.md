# Dream Build Bike

Configurador web para diseñar una bicicleta de carretera a medida. Permite explorar componentes, revisar su compatibilidad y preparar una configuración personalizada. El catálogo parte de datos semilla y está preparado para incorporar referencias de producto de Channel3.

## Arquitectura

La aplicación se organiza como un monorepo npm con dos workspaces:

- **Frontend (`frontend/`)**: aplicación de una sola página creada con Vue 3, Vite y TypeScript. Presenta el configurador y consume la API.
- **Backend (`backend/`)**: API HTTP con Node.js, Express y TypeScript. Expone el catálogo y valida las combinaciones mediante reglas de compatibilidad. Actualmente puede arrancar con datos semilla; los modelos Mongoose preparan la persistencia futura.
- **Integración Channel3**: el backend consulta y normaliza referencias candidatas. Se mantienen separadas de los componentes aprobados para el catálogo.
- **Documentación (`docs/`)**: decisiones de arquitectura y alcance del flujo de datos de Channel3.

```text
Navegador (Vue) ──HTTP──> API Express ──> catálogo y reglas de compatibilidad
                                      └──> Channel3 (importación de referencias)
```

## Requisitos y puesta en marcha

Se recomienda Node.js 14 o posterior y npm. Desde la raíz del repositorio:

```bash
npm install
cp .env.example .env
npm run dev
```

El frontend queda disponible en <http://localhost:5173> y el backend en <http://localhost:4000>.

Comprobaciones de tipos y compilación:

```bash
npm run typecheck
npm run build
```

## Channel3

Para importar referencias, configura `CHANNEL3_API_KEY` en `.env` y ejecuta:

```bash
cd backend
npm run import:channel3
```

La importación genera un snapshot local en `backend/data/channel3-product-references.json`, ignorado por Git. El alcance y las variables disponibles se describen en [`docs/channel3-data-plan.md`](docs/channel3-data-plan.md).

## Archivos del proyecto

El siguiente inventario incluye los archivos versionados del proyecto. Se omiten `node_modules/`, los directorios `dist/`, snapshots locales y otros archivos generados o propios del sistema.

```text
.
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── backend/
│   ├── data/
│   │   └── .gitkeep
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── channel3/
│       │   ├── catalogScope.ts
│       │   ├── client.ts
│       │   ├── mapper.ts
│       │   └── types.ts
│       ├── models/
│       │   ├── Component.ts
│       │   └── ProductReference.ts
│       ├── routes/
│       │   ├── builds.ts
│       │   ├── catalog.ts
│       │   └── components.ts
│       ├── scripts/
│       │   └── importChannel3.ts
│       ├── services/
│       │   └── compatibility.ts
│       ├── seed.ts
│       ├── server.ts
│       └── types.ts
├── docs/
│   ├── architecture.md
│   └── channel3-data-plan.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── App.vue
        ├── env.d.ts
        ├── main.ts
        ├── style.css
        └── types.ts
```
