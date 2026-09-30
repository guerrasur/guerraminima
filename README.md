# Guerra Mínima

Prototipo mobile-first de estrategia asíncrona por turnos.

## v0.1.1 — demo local

Esta primera versión no necesita backend ni otro jugador. Corre enteramente en el navegador y guarda la partida en \`localStorage\`.

Incluye:

- continente procedural con vista isométrica;
- cámara táctil: arrastrar con el dedo para recorrer el mapa, con pinch-to-zoom y botones +/−;
- dos países reales elegidos al azar con sus banderas;
- valle central, bosques, colinas, costa y ruinas;
- nombre procedural para cada conflicto;
- mundo visualmente vivo con habitantes, humo y banderas;
- 3 acciones por turno;
- acciones: expandir, construir, recolectar, explorar ruinas e intervenir territorio rival;
- alcance visible: casillas neutrales adyacentes a tu territorio aparecen marcadas y las fronteras rivales alcanzables también;
- guía/changelog dentro del juego, mostrada automáticamente al abrir una versión nueva;
- mercado de comida, madera, piedra y metal, con hasta 3 transacciones por turno;
- rival automático que realiza sus 3 movimientos;
- guardado automático local;
- PWA/service worker y detección de versiones nuevas.

## Objetivo del prototipo

Comprobar si resulta entretenido entrar a un pequeño continente, recorrerlo y tomar tres decisiones importantes por turno. La estética busca sensación de RTS clásico (AoE / Clash of Clans), pero el ritmo es asíncrono y pausado.

Más adelante, el rival automático puede reemplazarse por otro jugador sin cambiar el núcleo del tablero.

## Publicación

El sitio es estático y está pensado para GitHub Pages desde la raíz de \`main\`.

No requiere Firebase, servidor ni secretos.

## Regla de versiones

La actualización del cliente sigue la misma idea usada en Pelao Bolao: \`version.json\` permite que una pestaña abierta detecte que existe una versión más nueva y obligue a recargar.

Al publicar una versión, actualizar juntos:

1. \`VERSION\` en \`app.js\`.
2. \`version.json\`.
3. Los query strings \`?v=X.Y.Z\` de \`index.html\`.
4. El nombre de caché y URLs versionadas de \`sw.js\`.

No borrar ni renombrar \`guerra-minima-save-v1\` salvo que exista una migración explícita del estado guardado.


## Regla de documentación de mecánicas

Toda mecánica o control nuevo debe documentarse también dentro de la guía/changelog del juego. La explicación debe indicar qué hace, coste, alcance o límite y condiciones de uso. La guía debe seguir disponible desde el menú y mostrarse una vez al entrar a cada versión nueva.


## v0.1.2 — mapa y controles

Se conservan las proporciones isométricas de v0.1.0. El lienzo ya no altera el tamaño de la grilla y se sincroniza con el espacio disponible, también al girar el teléfono. El terreno se dibuja antes de los objetos; tocar un edificio selecciona su sector.

El arrastre sigue al dedo sin interpolación y el zoom conserva el punto del mapa entre ambos dedos. Soltar un dedo permite continuar arrastrando sin saltos; cancelar un gesto no selecciona. La rueda del mouse también permite hacer zoom. Una nueva partida vuelve a la capital. La limpieza de caché se limita a Guerra Mínima, sin borrar cachés de otros juegos del mismo dominio.

Pruebas de regresión sin dependencias: `node --test tests/map.test.cjs`.
