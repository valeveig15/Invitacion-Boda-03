# 01 · Martina & Federico · Botánica

Esta carpeta es una versión independiente de la invitación que estaba integrada en el catálogo original.

## Estructura
- `index.html`: marcado de esta invitación solamente.
- `style.css`: reglas comunes + reglas específicas necesarias para este diseño; se excluyeron selectores específicos de las demás invitaciones.
- `script.js`: funciones autónomas (cuenta regresiva, música, RSVP de demostración, calendario, mapas, modales y lightbox), sin navegación horizontal entre diseños.
- `assets/`: música, imágenes y ornamentos separados.
- `manifest.json`: inventario de elementos locales y URLs externas.

## Mejoras aplicadas
- Se extrajeron los `data:` embebidos a archivos reales dentro de `assets/`.
- Se eliminó la dependencia del catálogo horizontal para que el diseño funcione por sí solo.
- Se añadieron comprobaciones nulas en JavaScript para evitar errores si un bloque opcional no existe.
- Se añadieron atributos de carga diferida/decodificación a las fotos externas.
- Se conservó la música exacta del código original.
- En los modelos 06–15, los MP3 suministrados coinciden byte a byte con las pistas embebidas en el archivo original.

## Antes de publicar
El RSVP, regalos, sugerencia musical y álbum compartido son demostraciones: conectalos con servicios reales o un backend. Las fotos de Unsplash y Google Fonts requieren conexión a Internet; sus URLs están listadas en `assets/REMOTE_PHOTOS_AND_LINKS.txt`.


Corrección de sombras: reconstruidas desde botanical_tl.png y botanical_top.png con margen transparente amplio y desenfoque horneado, evitando cualquier borde rectangular visible.


Actualización HQ: las cuatro composiciones botánicas y sus sombras fueron reconstruidas desde G387.eps a 144 dpi, recortadas con transparencia real y exportadas con resolución suficiente para pantallas de alta densidad.

## Ajuste botánico final
La portada fue recompuesta usando exclusivamente follaje extraído a alta resolución de G387.eps. La distribución sigue la referencia G387: masas botánicas apoyadas en los bordes izquierdo, superior derecho y derecho, con el centro despejado. Se eliminaron las antiguas sombras de hojas borrosas y los recortes rectangulares se suavizaron con transparencias progresivas.

## Corrección 20-09-2026 · hojas de portada
El marco botánico HQ se movió dentro de la sección `s1-hero`, con posicionamiento absoluto y una capa explícita entre el fondo y el contenido. Esto evita que las hojas queden ocultas por el `stacking context`/fondo del contenedor desplazable. Además, esta entrega incluye la carpeta `assets/` completa con los nombres exactos esperados por `index.html` y `style.css`.
