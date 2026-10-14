# Plan de datos con Channel3

## Rol de Channel3

Channel3 sera el proveedor de referencias de producto. No debe ser la fuente directa de verdad del configurador sin revision, porque una busqueda puede devolver accesorios, productos antiguos, variantes incompletas o referencias que no sirven para compatibilidad.

Flujo recomendado:

```text
Channel3 search -> ProductReference candidate -> revision/aprobacion -> BikeComponent
```

## Alcance inicial

Categorias activas:

- Cuadros: Canyon, Trek, Specialized, Giant, Cannondale, Orbea, Cervelo, Factor.
- Grupos: Shimano 105 Di2, Ultegra Di2, Dura-Ace Di2, SRAM Rival AXS, Force AXS, RED AXS, Force XPLR, RED XPLR.
- Ruedas: DT Swiss, Zipp, ENVE, Shimano, Bontrager, Roval.
- Cockpit: Zipp, PRO, Deda, Vision, ENVE y cockpit especifico del cuadro.

## Variables de entorno

```bash
CHANNEL3_API_URL=https://api.trychannel3.com
CHANNEL3_API_KEY=
CHANNEL3_COUNTRY=ES
CHANNEL3_CURRENCY=EUR
CHANNEL3_LANGUAGE=es
```

## Importacion

```bash
cd backend
npm run import:channel3
```

El script genera:

```text
backend/data/channel3-product-references.json
```

Ese fichero es un snapshot local de candidatos y esta ignorado por Git para no versionar datos grandes o sujetos a licencia.

## Endpoints internos

- `GET /api/catalog/channel3/import-targets`: devuelve las busquedas configuradas.

## Normalizacion pendiente

La siguiente fase debe convertir candidatos aprobados a componentes del configurador. Para eso necesitaremos detectar:

- Categoria real.
- Marca y modelo canonico.
- Ano o temporada.
- Precio y moneda.
- Imagen principal.
- URL de compra o referencia.
- Estandares tecnicos: freno, velocidades, eje, nucleo, pedalier, tija, cableado, etc.

## Criterio de aprobacion

Un candidato deberia pasar a `BikeComponent` solo si:

- La marca coincide con el objetivo.
- La categoria es correcta.
- La referencia tiene URL o identificador estable.
- Hay imagen util o posibilidad de completarla manualmente.
- Las especificaciones tecnicas minimas se pueden completar.
