// Configuración del Mapa de Ayuda Viva — Valle del Cauca
//
// Mientras SHEET_API_URL esté vacío, el sitio funciona en "modo demo local":
// cada persona ve solo lo que reporta en su propio navegador (no se comparte
// con nadie más). Para que el mapa sea EN VIVO y compartido entre todas las
// personas que lo visitan, sigue los pasos de SETUP.md y pega aquí la URL
// de tu Google Apps Script Web App (termina en "/exec").
//
// MAPBOX_TOKEN es opcional. Vacío -> el mapa usa OpenStreetMap (gratis, sin
// cuenta). Si pegas tu token público de Mapbox (empieza por "pk."), el mapa
// usa tiles de Mapbox y se activa un buscador de dirección/barrio. Usa un
// token público restringido a tu dominio (ver SETUP.md) — nunca un token
// secreto ("sk.").
window.AYUDA_CONFIG = {
  SHEET_API_URL: "https://script.google.com/macros/s/AKfycbxOMHq1SWWl6-2Bvf9--cTaj0BgFWT6_qitzm_h8cMxS5lAwaEw_9Z_8Z6iGCU1dOoRvA/exec", // Ej: "https://script.google.com/macros/s/AKfycb.../exec"
  MAPBOX_TOKEN: "", // Ej: "pk.eyJ1Ijoi..." — pega tu token público aquí SOLO en tu copia local, nunca lo subas a git
  REFRESH_MS: 30000, // cada cuánto se refresca el mapa (milisegundos)
  CITY_CENTER: [3.9, -76.6], // centro del Valle del Cauca (no solo Cali)
  CITY_ZOOM: 9,
  // Encuadre inicial del mapa: todo el departamento del Valle del Cauca
  // (Buenaventura al oeste, Cartago al norte, Jamundí al sur). Si prefieres
  // que el mapa arranque enfocado solo en una ciudad, borra DEPT_BOUNDS y el
  // mapa usará CITY_CENTER + CITY_ZOOM en su lugar.
  DEPT_BOUNDS: [[3.0, -77.6], [5.05, -75.7]]
};
