# CLAUDE.md — Guerra Mínima

## Producto

Guerra Mínima es un juego web mobile-first de estrategia asíncrona. El prototipo v0.1 funciona sin backend: un jugador humano contra un rival automático.

Principios actuales:
- vista isométrica tipo RTS clásico;
- mapa más grande que la pantalla y cámara por drag/touch;
- partidas largas y tranquilas;
- 3 acciones por turno;
- comercio separado de los puntos de acción;
- países reales aleatorios como identidad visual, sin bonificaciones nacionales;
- continente procedural con valle central y ruinas;
- mundo visualmente vivo sin castigar al jugador por estar desconectado.

## Deploy

Hosting: GitHub Pages.
Repositorio: guerrasur/guerraminima.
Branch: main.
Sitio estático; no hay build step ni Firebase en la demo.

## Actualizaciones

Nunca actualizar solo parte de la versión. En cada release:
- cambiar VERSION en app.js;
- cambiar version.json;
- cambiar ?v= de style.css y app.js en index.html;
- cambiar CACHE y URLs versionadas en sw.js;
- conservar la clave localStorage guerra-minima-save-v1 salvo migración deliberada.

La detección de update consulta version.json con cache:no-store. Si difiere, bloquea la UI con un botón de actualización. La recarga limpia Cache Storage pero conserva localStorage.

## Alcance v0.1

No agregar todavía:
- multiplayer real;
- Firebase;
- tecnologías;
- diplomacia;
- unidades controlables individualmente;
- árboles de edificios complejos;
- ventajas por país.

Primero validar navegación del mapa, lectura territorial y decisiones de turno.


## Regla de documentación para IA

Cada vez que se agregue o modifique una mecánica, acción, recurso, control, límite o sistema visible para el jugador:

- actualizar la guía/changelog dentro del juego en `index.html`;
- explicar en lenguaje simple qué hace, cuánto cuesta, cuándo se puede usar y qué límite tiene;
- incluir el cambio bajo la versión correspondiente;
- hacer que la guía se muestre automáticamente una vez al abrir esa versión nueva;
- mantener accesible la guía desde el menú;
- no introducir mecánicas que dependan de reglas ocultas sin una señal visual o explicación en la interfaz.

Esta documentación forma parte de la funcionalidad, no es opcional. Una feature nueva no se considera terminada hasta que su explicación para el jugador también esté actualizada.
