# Guerra Mínima

Prototipo mobile-first de estrategia por turnos. Funciona enteramente en el navegador, guarda la partida en `localStorage` y se publica como sitio estático en GitHub Pages.

## v0.5.0 — Puntos calientes y mapa despejado

1. **Tres puestos estratégicos:** Paso Oeste (12,14), Valle Central (20,14), Paso Este (27,14), coordenadas internas desde 0. Cada puesto genera +¤2 por turno para su dueño.
2. **Fortificar:** está en Tienda / más opciones. Cuesta ¤4 y una acción; un escudo absorbe la próxima tirada defensiva perdida.
3. **Hitos:** 30 territorios, primer puesto y dos puestos dan +¤6 una sola vez por partida.
4. **Refuerzo gratuito:** sumar 1 tropa cuesta una acción, pero no monedas.
5. **Lectura visual:** estrellas, aviso de amenazas actuales, destinos de movimiento y botón para recorrer objetivos. Se redujeron paneles inferiores para darle más altura al mapa.

Los saves anteriores se migran agregando puestos y progreso, conservando monedas, tropas, dueño de las casillas y ganador. La guía se muestra una vez al abrir la versión. La actualización elimina la victoria por puestos, las etapas de refuerzo y el parte de guerra.

## Reglas base (v0.3.0; cambios de v0.4.0 arriba)

La demo mantiene el mapa isométrico, la estética de tinta/colores planos y los controles táctiles de v0.2.0, pero simplifica por completo las reglas.

### Objetivo

Hay dos formas de ganar:

- conquistar el cuartel rival;
- controlar al menos el 60% del territorio terrestre del continente.

Si el rival conquista tu cuartel o alcanza antes el 60%, perdés.

### Turno

Cada jugador tiene 3 acciones por turno. Las acciones posibles son:

- **Expandir:** ocupar una casilla neutral adyacente. Requiere que un territorio propio vecino tenga al menos 2 tropas; 1 tropa pasa al territorio nuevo.
- **Reforzar:** cuesta ¤2 y agrega 1 tropa al territorio seleccionado.
- **Mover:** mueve 1 tropa entre dos territorios propios adyacentes. El territorio de origen debe conservar al menos 1.
- **Atacar:** ataca un territorio rival adyacente desde el territorio propio vecino con más tropas disponibles.

### Combate

Cada ataque tira 1d6 para atacante y defensor.

- si el atacante obtiene más, el defensor pierde 1 tropa;
- empate o resultado menor favorece al defensor y el atacante pierde 1 tropa;
- cuando un territorio defensor llega a 0 tropas, cambia de dueño y recibe 1 tropa atacante;
- capturar el cuartel termina la partida inmediatamente.

### Economía

Solo existe una moneda.

Al comenzar cada turno se reciben monedas según la cantidad de territorios controlados:

`max(2, floor(territorios / 5))`

Las monedas se usan para reforzar tropas. Se eliminaron mercado, comida, madera, piedra, metal, recolección y ruinas como mecánicas jugables.

### Leer al rival

Las tropas son visibles sobre cada territorio.

- borde blanco punteado: territorio neutral que podés ocupar;
- borde rojo punteado: territorio rival que podés atacar;
- al terminar el turno rival aparece un resumen de sus movimientos;
- una acumulación de tropas cerca de tu frontera o cuartel representa una amenaza inmediata.

El rival automático usa las mismas ideas básicas: expandirse, reforzar, mover tropas y atacar.

## Controles

- toque: seleccionar territorio;
- arrastrar: mover la cámara;
- pellizcar: zoom;
- botones + / −: zoom alternativo;
- ⌖: volver al cuartel.

Mover la cámara o hacer zoom no consume acciones.

## Publicación

No requiere Firebase, servidor ni secretos. GitHub Pages sirve la raíz de `main`.

## Regla de versiones

Al publicar una versión, actualizar juntos:

1. `VERSION` en `app.js`;
2. `version.json`;
3. query strings `?v=X.Y.Z` de `index.html`;
4. nombre de caché y URLs versionadas de `sw.js`.

No borrar ni renombrar `guerra-minima-save-v1` salvo que exista una migración explícita. v0.3.0 migra las partidas anteriores al sistema de tropas/moneda única.

## Regla de documentación

Toda mecánica o control nuevo debe quedar explicado también dentro de la guía/changelog del juego, incluyendo coste, alcance, límites y condición de uso.

## Pruebas

Sin dependencias:

```bash
node --test tests/map.test.cjs
```

Las pruebas cubren geometría isométrica, selección táctil, drag/pinch, alineación del canvas, selección de edificios, orden de render y sincronización de versiones.
