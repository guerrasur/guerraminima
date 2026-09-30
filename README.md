# Guerra Mínima

Prototipo mobile-first de estrategia por turnos. La demo actual funciona enteramente en el navegador, guarda la partida en `localStorage` y se publica como sitio estático en GitHub Pages. Hoy se juega contra una IA local; el producto final está pensado para jugar online con amigos.

## NEXO

**Guerra Mínima es un juego online de estrategia para jugar con amigos sin presión.**

Esta es la regla principal de producto y está por encima de cualquier feature individual:

- no hay temporizador obligatorio ni cierre automático de turno;
- un turno puede durar segundos, varios minutos o quedar esperando hasta que el jugador vuelva;
- el jugador debe poder mirar, comparar, consultar y planificar antes de actuar;
- inspeccionar el mapa, mover cámara, hacer zoom, abrir reglas, revisar al rival y usar PLAN no consume acciones;
- cerrar el turno es siempre una decisión explícita;
- el multiplayer futuro debe tolerar ausencias y pausas sin castigos;
- la profundidad buscada viene de leer el tablero y construir un plan, no de reaccionar rápido;
- si una feature acelera el ritmo pero reduce la posibilidad de observar y pensar, contradice el NEXO.

Frase guía: **Guerra Mínima no intenta que juegues rápido; intenta que siempre tengas algo interesante que pensar.**

## v0.9.0 — Cada posición cuenta

- **Marcha táctica:** hasta 3 pasos ortogonales por territorio propio conectado, cantidad elegible, 1 acción; siempre queda una tropa en origen. No cruza costa, neutrales ni enemigos. Los destinos posibles se marcan en celeste y se puede cancelar sin gastar.
- **Flanqueo:** dos o más vecinos del atacante con al menos 2 tropas cada uno dan +1 al dado de ataque. Máximo +1, para ambos bandos.
- **Cobertura:** bosque y colinas dan +1 al dado defensor. El escudo se mantiene como protección de una tirada perdida y se puede combinar con cobertura.
- **Previsualización y resultados:** origen elegible, probabilidad calculada sobre las 36 tiradas posibles, consecuencias explícitas y tarjeta descartable con dados y resultado. Opciones permite revisar el último combate incluso después de recargar.
- **Puestos productivos:** cada puesto controlado suma +¤2 al ingreso al comenzar el turno. Perderlo elimina ese ingreso futuro; no entrega monedas inmediatamente ni gana la partida.
- **Feedback:** rutas, etiquetas de tropas, conquistas y escudos; sonidos sintetizados opcionales (apagados por defecto); respeta movimiento reducido. Nada de esto desplaza la cámara, consume acciones ni retrasa la lógica.
- **IA:** redistribuye reservas hacia el frente antes de seguir reforzando. Antes, su rama de movimiento era prácticamente inalcanzable.
- **Validación:** un ataque o traslado que deja de ser válido entre vista previa y confirmación no consume acciones ni tropas.

### Inspiración y límites

[Into the Breach, Subset Games](https://www.subsetgames.com/itb.html): información para planificar antes de actuar. Se toma esa claridad, manteniendo los dados propios de Guerra Mínima.

[Polytopia: Clear & Hold, Midjiwan](https://polytopia.io/news/strategy-tip-clear-hold/): ocupar una posición también exige defenderla. Aquí se traduce en cobertura, flanqueo y puestos con ingreso recurrente. No se reutilizan recursos gráficos ni código de esos juegos.

Se conservan los saves, las 6 acciones, el refuerzo gratis, PLAN, REPLANTEAR antes del combate, la tienda y el resumen rival. La demo sigue siendo local contra IA.

## v0.8.0 — Entrar al turno informado

1. **Tienda integrada:** sale del menú y vive junto a la selección, con el saldo visible durante el turno.
2. **Tienda contextual:** Fortificar explica si el sector seleccionado es válido; Orden extra conserva su límite de una por ronda.
3. **Resumen rival automático:** cada nueva ronda deja un parte compacto sobre el mapa. Si cerrás la app antes de leerlo, vuelve a aparecer al regresar.
4. **Resumen navegable:** tocar un evento centra el mapa en el sector afectado. El botón RIVAL conserva el historial completo.
5. **UX de acciones:** la Orden extra muestra correctamente un presupuesto de 7/7 y el primer render ya dice Refuerzo +2.
6. **Tutorial menos invasivo:** una actualización de versión ya no fuerza a repetir el tutorial completo si ya lo habías visto.

La rama `backup-v0.7.0-before-v0.8.0` conserva el estado anterior.

## v0.7.0 — Pensar antes de cerrar

1. **REPLANTEAR:** antes del primer ataque podés restaurar el estado exacto del comienzo de tu ronda: tropas, territorios, fortificaciones, dinero, acciones e hitos. Las marcas PLAN se conservan.
2. **Anti-reroll:** en cuanto confirmás un ataque, REPLANTEAR queda bloqueado hasta la ronda siguiente.
3. **Refuerzo +2 uniforme:** cualquier territorio propio recibe +2 tropas por 1 acción y ¤0.
4. **Movimiento por cantidad:** elegís cuántas tropas trasladar entre vecinos propios y todo cuesta 1 acción.
5. **Ataque con previsualización:** origen, fuerzas, fortificación y probabilidad aparecen antes de tirar.
6. **Orden extra:** +1 acción por ¤5, máximo una vez por ronda.
7. **Amenazas visibles:** los sectores propios atacables por el rival reciben un borde rojo punteado.
8. **Parte rival al comenzar:** tras cerrar una ronda, el rival juega y su parte se abre para leer qué cambió.
9. **Tutorial de 15 pasos:** enseña el juego de punta a punta.
10. **Tests de invariantes:** protegen replanteo, anti-reroll, Orden extra, refuerzo +2, tutorial y NEXO.

La rama `backup-v0.6.0-before-v0.7.0` conserva el estado anterior.

## Reglas actuales

### Victoria

Ganás si conquistás el cuartel rival o controlás al menos el 60% del territorio terrestre. Perdés si el rival logra cualquiera antes.

### Turno

Cada jugador tiene **6 acciones base** y no existe reloj.

- **Expandir:** neutral adyacente; un vecino propio con 2+ tropas transfiere 1 al nuevo sector.
- **Reforzar:** +2 tropas sobre cualquier territorio propio. 1 acción, ¤0.
- **Mover:** cantidad elegida hasta 3 pasos ortogonales conectados por tierra propia. 1 acción y al menos 1 tropa queda en origen.
- **Atacar:** territorio rival adyacente; la tirada se realiza recién después de la previsualización.
- **Fortificar:** ¤4 + 1 acción.
- **Orden extra:** ¤5 para +1 acción, máximo una vez por ronda.

Llegar a 0 acciones no cierra la ronda automáticamente.

### PLAN

PLAN es una libreta táctica gratuita: hasta 5 sectores numerados, sin coste de acción. No mueve tropas ni altera el combate. Se limpia al cerrar la ronda y se conserva al usar REPLANTEAR.

### REPLANTEAR

Al comenzar cada ronda se guarda un baseline interno. Antes de confirmar el primer ataque, REPLANTEAR restaura ese estado. El primer ataque bloquea el replanteo para impedir rerolls.

### Combate

Cada lado tira 1d6. Dos o más vecinos atacantes con 2+ tropas dan +1 al atacante (flanqueo, máximo +1). Bosque y colinas dan +1 al defensor (cobertura). El empate de los totales favorece al defensor. El perdedor pierde 1 tropa. Una fortificación absorbe una tirada atacante ganada y se rompe. Si el defensor llega a 0, el territorio cambia de dueño con 1 tropa transferida desde el origen. Capturar el cuartel termina la partida.

Probabilidad de ganar una tirada (no necesariamente conquistar):

| Flanqueo | Cobertura defensiva | Tiradas ganadoras |
| --- | --- | --- |
| No | No | 15/36 ≈ 42% |
| Sí | No | 21/36 ≈ 58% |
| No | Sí | 10/36 ≈ 28% |
| Sí | Sí | 15/36 ≈ 42% |

La interfaz usa la misma función de bonificaciones que el combate real. Se elige el origen; perder o conquistar descuenta la tropa de ese origen. Más tropas no mejoran el dado por cantidad, pero permiten resistir más bajas y habilitar flanqueo.

### Economía

Ingreso por ronda:

`max(2, floor(territorios / 5)) + 2 × puestos controlados`

Las tropas normales no cuestan monedas. Actualmente las monedas sirven para fortificar y comprar una Orden extra. La Tienda está siempre accesible junto a la selección y muestra el saldo; la fortificación se evalúa sobre el sector seleccionado. Los hitos siguen siendo recompensas únicas.

### Puestos estratégicos

Hay tres puestos ★ en el eje central. Cada uno da +¤2 al inicio del turno de su dueño, además de los hitos únicos. Son posiciones para disputar y sostener, no una condición adicional de victoria.

### Leer al rival

- número = tropas;
- + = propio;
- × = rival;
- blanco punteado = neutral expandible;
- rojo sobre rival = ataque disponible;
- rojo punteado sobre propio = amenaza conocida;
- resumen rival de llegada = aparece automáticamente al volver a una ronda con movimientos enemigos pendientes;
- RIVAL = historial reciente de acciones enemigas.

El resumen automático persiste hasta que lo descartás o abrís el historial. Cada evento del parte puede centrar el mapa en su sector.

## Tutorial y reglas

**Tutorial completo** tiene 15 pasos y es la entrada principal para un jugador nuevo.

**Reglas y referencia rápida** sirve para consultar durante la partida.

Toda nueva mecánica debe actualizar ambos lugares cuando corresponda. No agregar reglas ocultas.

## Dirección visual

Mantener vista isométrica, mapa protagonista, tinta negra + verde ácido + ocre/naranja + azul, cámara táctil y HUD compacto. Evitar grandes paneles permanentes que vuelvan a comprimir el mapa.

## Multiplayer futuro

La demo local no debe fingir multiplayer real. Cuando se agregue backend, preservar turnos persistentes, ausencia de reloj obligatorio, posibilidad de volver más tarde, resumen de cambios y notificaciones informativas sin penalidades por demora.

## Publicación

GitHub Pages sirve la raíz de `main`. No hay Firebase ni backend en la demo actual.

## Versionado

Actualizar juntos en cada release:

1. `VERSION` en app.js;
2. version.json;
3. `?v=X.Y.Z` de index.html;
4. caché y URLs de sw.js.

No renombrar `guerra-minima-save-v1` sin migración explícita.

## Documentación

Una feature visible no está terminada hasta que se explica, aclara coste/alcance/límite, actualiza tutorial/reglas y respeta el NEXO.

## Pruebas

```bash
node --test tests/map.test.cjs
```

GitHub Actions ejecuta la suite en cada push y pull request. La suite prueba también las 36 combinaciones de dados de cada bonificación para ambos bandos, rutas de marcha y límites, elección de origen, validación de órdenes, ingreso por puestos, persistencia y replanteo.
