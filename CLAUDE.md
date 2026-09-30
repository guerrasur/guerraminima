# CLAUDE.md — Guerra Mínima

## Producto

Guerra Mínima es un juego web mobile-first de estrategia por turnos. La demo actual funciona contra IA, sin backend. El producto final está pensado para jugar online con amigos.

## NEXO — INVARIANTE PRINCIPAL

**Jugar online con amigos sin presión, con suficiente tiempo e información para observar, pensar, planificar y recién después cerrar la ronda.**

- NO agregar temporizador obligatorio.
- NO cerrar una ronda automáticamente por tiempo.
- NO premiar jugar rápido.
- NO castigar ausencias o pausas.
- Una ronda puede durar varios minutos.
- Inspeccionar, zoom, cámara, reglas, RIVAL y PLAN no consumen acciones.
- Cerrar turno siempre es una decisión explícita.
- Al volver a una partida, el jugador debe poder reconstruir qué hizo el rival.
- La UI prioriza lectura y planificación, no urgencia.
- Si una feature acelera el ritmo pero reduce lectura o tranquilidad, contradice el producto.

Frase guía: **Guerra Mínima no intenta que juegues rápido; intenta que siempre tengas algo interesante que pensar.**

## v0.9.0 — Invariantes de táctica y feedback

- Marcha: hasta 3 pasos ortogonales por casillas propias de tierra, 1 acción por traslado, conserva 1 tropa en origen. Usar BFS, no distancia directa atravesando obstáculos.
- Flanqueo: >=2 vecinos atacantes con >=2 tropas, +1 máximo al dado atacante.
- Cobertura: bosque/colinas, +1 al dado defensor. Empates de los totales favorecen al defensor.
- Vista previa y resolver comparten `combatForecast`; no duplicar probabilidades ni confundir ganar una tirada con conquistar.
- El origen elegido debe respetarse. Revalidar rutas/ataques al confirmar; no gastar ni bloquear replanteo si la orden dejó de ser válida.
- Cada puesto controlado suma +¤2 al ingreso al empezar el turno. Mantener los hitos únicos y las condiciones de victoria existentes.
- Jugador e IA comparten bonificaciones, rutas, costes y límites.
- Feedback solo de presentación: no altera proyección, picking, cámara, azar ni turnos. No bloquear controles esperando animaciones.
- Respetar prefers-reduced-motion y sonido opcional apagado por defecto. El fallo de audio no puede interrumpir una acción.
- Mantener historial del último combate al recargar. Nunca reiniciar una partida para aplicar estas reglas.

## v0.8.0

- Tienda siempre visible junto a la selección; no volver a esconderla como opción secundaria.
- El saldo debe estar visible en el acceso a Tienda.
- Cada turno nuevo con acciones rivales genera un resumen compacto sobre el mapa.
- Ese resumen debe persistir si el jugador cierra y vuelve antes de leerlo.
- El historial RIVAL completo sigue disponible y sus eventos centran el mapa.
- No usar el resumen rival como temporizador ni como bloqueo: informa y se puede descartar.
- Una nueva release no debe forzar a repetir el tutorial completo a quien ya lo completó.
- Si Orden extra está activa, el HUD expresa el presupuesto ampliado (7/7, 6/7, etc.).

## v0.7.0

- 6 acciones base;
- refuerzo = +2 tropas, ¤0, 1 acción;
- movimiento por cantidad;
- ataque con previsualización;
- PLAN = hasta 5 marcas gratuitas;
- REPLANTEAR restaura el inicio del turno antes del primer ataque;
- primer ataque bloquea REPLANTEAR para impedir rerolls;
- fortificación = ¤4 + 1 acción;
- Orden extra = ¤5, +1 acción, máximo una vez por ronda;
- parte rival persistente y navegable;
- amenaza conocida marcada visualmente;
- tutorial de 15 pasos;
- turno sin reloj y cierre manual.

No convertir REPLANTEAR en una forma de repetir azar.

## Loop prioritario

**leer el resumen rival de llegada → inspeccionar mapa → marcar PLAN → probar distribución → replantear si hace falta → ejecutar/reforzar/mover/expandir/atacar → revisar el frente → cerrar voluntariamente.**

Antes de sumar tecnologías, diplomacia, clases de unidad o árboles complejos, validar que este loop sea interesante.

## Multiplayer futuro

- persistir estado por partida/jugador;
- mostrar de quién es el turno;
- permitir cerrar y volver horas después;
- no usar timeout por defecto;
- resumir cambios desde la última visita;
- notificaciones pueden avisar «te toca» pero no penalizar demora;
- preservar el NEXO en arquitectura y UX.

## Dirección visual

Vista isométrica, mapa grande, cámara drag/pinch, tinta negra + verde ácido + ocre/naranja + azul, paneles mínimos, información contextual. No alterar proyección/picking para decoración. El mapa es el protagonista.

## Arquitectura

- repo: `guerrasur/guerraminima`
- deploy: `main`
- GitHub Pages
- sitio estático
- sin build
- sin Firebase en la demo
- save: `guerra-minima-save-v1`

## Versionado

Actualizar juntos: VERSION, version.json, queries de index.html y CACHE/URLs de sw.js. Conservar la clave de save salvo migración deliberada.

## Documentación obligatoria

Cada mecánica o control visible debe actualizar changelog/reglas, tutorial si corresponde, README y este archivo cuando cambie una invariante.

## Tests

```bash
node --test tests/map.test.cjs
```

Proteger geometría/touch, versión/cache, economía/combate, movimiento, PLAN, REPLANTEAR, anti-reroll, Orden extra, tutorial y NEXO. GitHub Actions debe correr la suite en push y pull request.
