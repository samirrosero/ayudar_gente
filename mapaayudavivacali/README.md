# 🆘 Mapa de Ayuda Viva — Valle del Cauca

Herramienta comunitaria y gratuita para **coordinar ayuda en tiempo real** durante la
emergencia en el Valle del Cauca (Cali, Buenaventura, Palmira, Tuluá, y los demás
municipios del departamento): personas que necesitan que les ayuden a **retirar
escombros**, lugares donde llevar **alimentos no perecederos**, **medicamentos**,
**agua**, **herramientas**, **ropa y cobijas**, **refugio** o **voluntarios**, y
personas/organizaciones que **ofrecen** esa ayuda.

No reemplaza a los organismos oficiales (Línea 123, Bomberos, Cruz Roja, alcaldías
municipales / Gestión del Riesgo departamental). Es un complemento ciudadano para que
la ayuda vecinal llegue más rápido a quien la necesita.

## ¿Qué incluye?

- **`index.html`** — la aplicación completa (mapa + formulario + lista de reportes).
  Un solo archivo, sin necesidad de instalar nada, funciona en celular y computador.
- **`config.js`** — configuración (zona del mapa, URL del backend).
- **`apps-script/Code.gs`** — backend gratuito sobre Google Sheets para que el mapa
  sea **en vivo y compartido** entre todas las personas que lo visitan.
- **`SETUP.md`** — guía paso a paso (10 minutos, sin saber programar) para dejarlo
  funcionando en vivo y publicado en internet.

## Cómo funciona

1. Cualquier persona abre el sitio y ve el mapa de todo el Valle del Cauca con los
   reportes activos, agrupados por categoría (escombros, alimentos, medicamentos,
   agua, refugio, voluntarios, ropa y cobijas, herramientas, otro) y por tipo
   (necesita / ofrece). La barra lateral muestra los reportes en vivo, sin tener que
   ir marcador por marcador en el mapa.
2. Con el botón **"Reportar en el mapa"**, comparte tu ubicación en vivo (o marca
   el punto en el mapa), elige la categoría y escribe un título. Para medicamentos,
   herramientas, ropa/cobijas, alimentos y "otro", el formulario pide además el
   detalle exacto (ej. "acetaminofén y suero oral", "pala y carretilla") para que
   quien va a ayudar sepa justo qué llevar — no solo la categoría general.
3. El reporte se guarda en una hoja de Google Sheets compartida y aparece en el mapa
   de **todas las personas** que lo estén viendo en menos de 30 segundos.
4. Cuando un punto ya está bien surtido (no le falta nada), un moderador (quien
   administra la hoja) lo marca como "resuelto" — pasa a verse en el mapa con un
   check verde, en vez de desaparecer, para que nadie lleve ayuda de más ahí.

## Puesta en marcha rápida

👉 Sigue **[SETUP.md](./SETUP.md)** para:
1. Crear la hoja de Google que sirve como base de datos (gratis, con cualquier
   cuenta de Google).
2. Conectar `config.js` con esa hoja.
3. Publicar el sitio gratis con GitHub Pages (o cualquier hosting estático).
4. (Opcional) Conectar un token de Mapbox para tiles más claros y buscador de
   dirección/barrio en el formulario de reportes.

Mientras no se complete el paso 1, el sitio funciona en **modo demo local**: cada
persona solo ve lo que reporta en su propio navegador (útil para probar el diseño,
pero no está compartido con nadie).

## Seguridad y buen uso

- No se pide ni almacena información sensible; el contacto es opcional y lo decide
  quien publica el reporte.
- Cualquiera puede publicar un reporte (para que sea rápido en medio de una
  emergencia) — por eso es clave tener 1 o 2 personas moderando la hoja de cálculo
  para quitar spam o información falsa.
- Recomienda siempre verificar la información antes de movilizarse, y usar las
  líneas oficiales (123, 119 Bomberos, 132 Cruz Roja) para emergencias de riesgo vital.

## Licencia

Uso libre para fines comunitarios y de respuesta a emergencias.
