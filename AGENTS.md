# Instrucciones para agentes

## Proyecto

Dream Build Bike es un monorepo npm para un configurador de bicicletas MVP.

- Runtime requerido: Node.js 24 LTS, indicado en `.nvmrc` y en `engines`.
- `frontend/`: Vue 3, TypeScript y Vite. La experiencia principal vive en `src/App.vue`.
- `backend/`: Node.js, Express y TypeScript. Las rutas HTTP están en `src/routes/`; las reglas de compatibilidad, en `src/services/`.
- El frontend consume la API del backend. La validación de compatibilidad pertenece al backend.
- Vitest ejecuta las pruebas; se usan Vue Test Utils y jsdom para frontend, y Supertest para rutas HTTP.
- Respeta el alcance del MVP y las decisiones documentadas en `docs/`.

## Forma de trabajo

1. Inspecciona el código, los scripts y las pruebas existentes antes de cambiar comportamiento.
2. Prioriza el cambio más pequeño que resuelva la tarea. Evita dependencias, refactorizaciones y cambios de arquitectura ajenos al objetivo.
3. Valida las entradas en los límites de la API y gestiona explícitamente errores HTTP, de red y estados de carga.
4. Añade o actualiza pruebas de comportamiento cuando cambie el comportamiento funcional.
5. Antes de instalar dependencias o ejecutar pruebas o builds, comprueba `node -v`. Continúa solo si muestra una versión `v24.x`; si no, activa Node 24 y vuelve a comprobarlo.
6. Ejecuta las comprobaciones pertinentes desde la raíz:
   - `npm test`
   - `npm run typecheck`
   - `npm run build`
   - `npm audit` cuando cambien dependencias o seguridad.
7. No sobrescribas cambios existentes del usuario. No crees commits ni despliegues sin autorización.

## Delegación y coordinación

Delega cuando una especialización aporte valor; no invoques varios agentes para tareas triviales.

- **Frontend Developer:** cambios relevantes de interfaz, Vue o reactividad.
- **Backend Architect:** APIs, servicios y contratos del backend.
- **Software Architect:** cambios estructurales o decisiones de arquitectura.
- **Mobile App Builder:** solo cuando el proyecto incorpore desarrollo móvil.
- **Minimal Change Engineer:** correcciones puntuales cuyo alcance deba limitarse.
- **Code Reviewer:** revisión independiente de cambios relevantes antes de darlos por terminados.

Al dividir trabajo, asigna a cada subagente archivos o responsabilidades distintos. No permitas cambios simultáneos en los mismos archivos; coordina dependencias antes de integrar resultados. Indica con transparencia qué subagentes se invocaron realmente y qué trabajo completaron.

## Finalización y entrega

Da el trabajo por terminado solo después de ejecutar las pruebas, el typecheck y el build pertinentes, y revisar posibles regresiones. Informa de cualquier comprobación omitida o fallida y de los problemas pendientes; no afirmes verificaciones ni delegaciones sin evidencia.

Resume los cambios y los archivos afectados, las comprobaciones ejecutadas y sus resultados, y los problemas pendientes.
