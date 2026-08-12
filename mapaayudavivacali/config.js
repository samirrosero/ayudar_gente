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
  SHEET_API_URL: "https://quiet-base-ba8b.samir-armero16.workers.dev", // Ej: "https://script.google.com/macros/s/AKfycb.../exec"
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2hyb3Nlcm8iLCJhIjoiY21zcW12azAyMHJlMzMwcHd1MXkwbG5jMSJ9.YjU_XhypnDQH9LdXEJijJg",
  REFRESH_MS: 30000, // cada cuánto se refresca el mapa (milisegundos)
  CITY_CENTER: [3.4516, -76.5320], // Cali, Valle del Cauca
  CITY_ZOOM: 12
};
