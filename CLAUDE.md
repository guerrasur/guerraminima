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

**leer el parte → inspeccionar mapa → marcar PLAN → probar distribución → replantear si hace falta → ejecutar/reforzar/mover/expandir/atacar → revisar el frente → cerrar voluntariamente.**

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
