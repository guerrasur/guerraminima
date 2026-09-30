# CLAUDE.md — Guerra Mínima

## Producto

Guerra Mínima es un juego web mobile-first de estrategia asíncrona. El prototipo v0.1 funciona sin backend: un jugador humano contra un rival automático.

## NEXO — invariante de producto

Guerra Mínima es estrategia online para jugar con amigos sin presión temporal. Toda actualización debe respetar estas reglas:

- no usar temporizadores, urgencia artificial ni cierre automático de ronda;
- un turno puede durar varios minutos o quedar pendiente hasta que el jugador vuelva;
- inspeccionar el mapa, consultar información, hacer zoom, revisar historial y planificar no consume acciones;
- priorizar decisiones legibles y reflexivas sobre velocidad de ejecución;
- el jugador cierra el turno explícitamente cuando considera que terminó;
- el multiplayer futuro debe ser asíncrono o semi-asíncrono y tolerar ausencias sin castigo;
- si una mejora acelera el ritmo pero reduce la posibilidad de observar y pensar, contradice el producto.

Frase guía: **Guerra Mínima no intenta que juegues rápido; intenta que siempre tengas algo interesante que pensar.**

Principios actuales:
- vista isométrica tipo RTS clásico;
- mapa más grande que la pantalla y cámara por drag/touch;
- partidas largas y tranquilas;
- 6 acciones por turno en v0.6.0, sin reloj ni cierre automático;
- moneda única para reforzar y fortificar;
- países reales aleatorios como identidad visual, sin bonificaciones nacionales;
- continente procedural con valle central y tres puestos estratégicos;
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

## Dirección visual (v0.2.0)
Cómic psicodélico con tinta negra, verde ácido, ocre/naranja y azul; paneles negros y bordes blancos. Mantener texturas deterministas, lectura territorial +/× y selección visible. No alterar proyección/picking para decorar el terreno; conservar pruebas táctiles.

## Campaña v0.5.0
Reglas actuales en README y guía in-game: tres puestos, hitos únicos, escudos consumibles y refuerzos gratuitos. La victoria solo ocurre por cuartel o 60% del territorio. Fortificar está dentro de Tienda / más opciones, fuera de las acciones principales. Mantener la vista del mapa amplia y evitar paneles negros innecesarios.


## Dirección de turno v0.6.0

La ronda humana tiene 6 acciones, planificación gratuita de hasta 5 sectores, parte rival navegable y confirmación de cierre. El tutorial guiado de 12 pasos forma parte del producto. No convertir herramientas de lectura o planificación en costes de acción.
