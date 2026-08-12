# Guía de instalación (≈10 minutos, sin saber programar)

Vas a dejar el "Mapa de Ayuda Viva — Valle del Cauca" funcionando **en vivo** y
**publicado en internet**, para que cualquier persona pueda verlo y reportar
necesidades u ofertas de ayuda.

## Parte 1 — Crear la base de datos compartida (Google Sheets)

1. Entra a [sheets.google.com](https://sheets.google.com) con cualquier cuenta de
   Google y crea una hoja de cálculo nueva. Ponle de nombre, por ejemplo,
   `ayuda-viva-valle-datos`.
2. En el menú, ve a **Extensiones → Apps Script**.
3. Borra todo el código de ejemplo que aparece (`function myFunction() {...}`).
4. Abre el archivo [`apps-script/Code.gs`](./apps-script/Code.gs) de este
   repositorio, copia **todo** su contenido y pégalo en el editor de Apps Script.
5. Guarda (ícono de disquete o `Ctrl/Cmd + S`). Ponle un nombre al proyecto, por
   ejemplo `ayuda-viva-backend`.
6. En la barra de funciones (arriba, donde dice `Seleccionar función`), elige
   **`setupSheet`** y presiona **▶ Ejecutar**.
   - La primera vez te pedirá autorización: elige tu cuenta, luego
     "Configuración avanzada" → "Ir a ayuda-viva-backend (no seguro)" → Permitir.
     (Es normal el aviso: es tu propio script, en tu propia cuenta.)
   - Esto crea la pestaña `reportes` con los encabezados correctos.

## Parte 2 — Publicar el backend como aplicación web

1. Arriba a la derecha, clic en **Implementar → Nueva implementación**.
2. En "Selecciona el tipo", elige el ícono de engranaje → **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** **Cualquier usuario** (importante: si no, el mapa no
     podrá leer ni escribir datos).
4. Clic en **Implementar** y autoriza de nuevo si te lo pide.
5. Copia la **URL de la aplicación web** que aparece (termina en `/exec`). La vas a
   necesitar en el siguiente paso.

> Si más adelante actualizas el código `Code.gs`, debes crear **"Nueva
> implementación"** otra vez (o gestionar implementaciones existentes) para que los
> cambios queden publicados con la misma URL.

## Parte 3 — Conectar el sitio con tu hoja

1. Abre [`config.js`](./config.js) en este repositorio.
2. Pega la URL copiada en `SHEET_API_URL`:
   ```js
   window.AYUDA_CONFIG = {
     SHEET_API_URL: "https://script.google.com/macros/s/AKfycb.../exec",
     ...
   };
   ```
3. Guarda y sube el cambio (commit + push) a la rama del proyecto.

Desde este momento, `index.html` deja el "modo demo local" y pasa a leer/escribir
directamente en tu hoja de Google — **en vivo**, compartido entre todas las personas
que visiten el sitio.

## Parte 4 — Publicar el sitio en internet (GitHub Pages, gratis)

1. En GitHub, entra al repositorio → **Settings → Pages**.
2. En "Source", elige la rama donde está `index.html` (por ejemplo `main`) y la
   carpeta raíz (`/`).
3. Guarda. En un par de minutos, GitHub te dará una URL pública, algo como:
   `https://<tu-usuario>.github.io/ayudar_gente/`
4. Comparte ese enlace por WhatsApp, redes sociales, líderes comunitarios, etc.

## Parte 5 — Mejorar el mapa con Mapbox (opcional)

Por defecto el sitio usa OpenStreetMap (gratis, sin cuenta). Si tienes un token de
[Mapbox](https://www.mapbox.com/), puedes activar tiles más claros y un buscador de
dirección/barrio dentro del formulario de reportes:

1. En tu cuenta de Mapbox, ve a **Tokens** y usa tu **token público** (empieza con
   `pk.`) — nunca un token secreto (`sk.`), ese no debe usarse en un sitio público.
2. Por seguridad, edita el token (o crea uno nuevo) y en **URL restrictions** agrega
   la URL de tu sitio (por ejemplo `https://<tu-usuario>.github.io/*`), así nadie más
   puede usarlo desde otro sitio aunque lo vea en el código fuente.
3. Pega el token en [`config.js`](./config.js):
   ```js
   MAPBOX_TOKEN: "pk.eyJ1Ijoi...",
   ```
4. Guarda y sube el cambio. El mapa pasa a usar tiles de Mapbox y aparece el campo
   "Buscar dirección o barrio" en el formulario de reportes.

El plan gratuito de Mapbox incluye una cuota mensual amplia (tiles y geocodificación).
Activa las alertas de uso en tu cuenta de Mapbox para enterarte si alguna vez se
acerca al límite.

## Parte 6 — Moderación (recomendado)

Como cualquier persona puede publicar reportes (para que sea rápido en medio de una
emergencia), designa 1-2 personas de confianza que revisen la hoja de cálculo
periódicamente:

- **Cuando un punto ya no necesita más ayuda** (ya quedó bien surtido), cambia la
  columna `estado` de `activo` a `resuelto` en la hoja. En el mapa pasa a verse como
  un ✅ verde — sigue visible, pero como "ya cubierto", para que nadie lleve más
  ayuda innecesaria ahí. Si prefieres que directamente desaparezca del mapa, la
  gente puede desmarcar la casilla "Mostrar puntos ya cubiertos" en Filtros.
- Para eliminar spam o información falsa, borra la fila completa en la hoja.

## Preguntas frecuentes

**¿Tiene algún costo?** No. Google Sheets, Apps Script y GitHub Pages son gratuitos
para este volumen de uso.

**¿Necesito saber programar?** No, solo copiar/pegar los pasos de esta guía.

**¿Qué pasa si no configuro `SHEET_API_URL`?** El sitio sigue funcionando, pero cada
persona solo ve los reportes que ella misma publicó en su navegador (modo demo, no
compartido). Es útil para revisar el diseño antes de publicarlo.

**El formulario da error de CORS al publicar un reporte.** Revisa que en el paso 2.3
hayas elegido "Cualquier usuario" (no "Cualquier usuario con cuenta de Google"), y
que hayas creado una *nueva* implementación después de cualquier cambio al código.
