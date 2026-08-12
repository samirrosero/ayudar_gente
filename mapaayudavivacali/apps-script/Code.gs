/**
 * Mapa de Ayuda Viva — Valle del Cauca
 * Backend gratuito sobre Google Sheets + Apps Script.
 *
 * Qué hace:
 *  - doGet(?action=list)  -> devuelve todos los reportes en JSON (lectura pública).
 *  - doPost(JSON body)    -> agrega un nuevo reporte a la hoja (escritura pública).
 *
 * Instalación: ver SETUP.md en la raíz del repositorio. Resumen rápido:
 *  1. Crea una hoja de cálculo de Google nueva.
 *  2. Extensiones > Apps Script, borra el contenido y pega este archivo completo.
 *  3. Ejecuta la función `setupSheet` una vez (menú Ejecutar) para crear encabezados.
 *  4. Implementar > Nueva implementación > Aplicación web.
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquier usuario
 *  5. Copia la URL que termina en /exec y pégala en config.js (SHEET_API_URL).
 */

var SHEET_NAME = "reportes";
var HEADERS = ["id", "ts", "tipo", "categoria", "titulo", "descripcion", "zona", "lat", "lon", "contacto", "urgencia", "estado"];

// Límite anti-spam: máximo de reportes por usuario (fingerprint) en una ventana de tiempo.
var SPAM_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
var SPAM_MAX = 5;                      // máximo 5 reportes en esa ventana

// Bounds del Valle del Cauca (holgados para incluir zonas de borde del departamento)
var BOUNDS = { latMin: 2.8, latMax: 5.2, lonMin: -77.8, lonMax: -75.5 };

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

/** Ejecuta esta función UNA VEZ desde el editor de Apps Script para preparar la hoja. */
function setupSheet() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === "list") {
    return jsonResponse_(listRecords_());
  }
  return jsonResponse_({ ok: true, service: "Mapa de Ayuda Viva - Valle del Cauca", usage: "?action=list" });
}

function doPost(e) {
  try {
    var body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    // Marcar reporte como resuelto (cubierto)
    if (body.action === "resolve") {
      return resolveRecord_(body.id);
    }

    // Honeypot: el campo "website" debe llegar vacío desde el formulario real
    if (body.website && String(body.website).trim() !== "") {
      return jsonResponse_({ ok: true, id: "ignored" }); // respuesta silenciosa al bot
    }

    if (!checkRateLimit_(body.fp)) {
      return jsonResponse_({ ok: false, error: "Demasiados reportes en poco tiempo. Espera unos minutos." });
    }

    var record = validateAndNormalize_(body);
    appendRecord_(record);
    return jsonResponse_({ ok: true, id: record.id });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function resolveRecord_(id) {
  if (!id) return jsonResponse_({ ok: false, error: "id requerido" });
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonResponse_({ ok: false, error: "registro no encontrado" });
  var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var idIdx = HEADERS.indexOf("id");
  var estadoIdx = HEADERS.indexOf("estado");
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(id)) {
      sheet.getRange(i + 2, estadoIdx + 1).setValue("resuelto");
      return jsonResponse_({ ok: true });
    }
  }
  return jsonResponse_({ ok: false, error: "registro no encontrado" });
}

function checkRateLimit_(fp) {
  if (!fp) return true; // sin fingerprint, dejamos pasar (el campo es opcional)
  var key = "rl_" + String(fp).replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
  var cache = CacheService.getScriptCache();
  var raw = cache.get(key);
  var entry = raw ? JSON.parse(raw) : { count: 0, since: Date.now() };
  var now = Date.now();
  if (now - entry.since > SPAM_WINDOW_MS) { entry = { count: 0, since: now }; }
  entry.count++;
  cache.put(key, JSON.stringify(entry), Math.ceil(SPAM_WINDOW_MS / 1000));
  return entry.count <= SPAM_MAX;
}

function validateAndNormalize_(body) {
  var tipo = String(body.tipo || "").trim();
  var categoria = String(body.categoria || "").trim();
  var titulo = String(body.titulo || "").trim();
  var lat = Number(body.lat);
  var lon = Number(body.lon);

  if (["necesita", "ofrece"].indexOf(tipo) === -1) throw new Error("tipo inválido");
  if (!categoria) throw new Error("categoria requerida");
  if (!titulo) throw new Error("titulo requerido");
  if (isNaN(lat) || isNaN(lon)) throw new Error("ubicación (lat/lon) requerida");
  if (lat < BOUNDS.latMin || lat > BOUNDS.latMax || lon < BOUNDS.lonMin || lon > BOUNDS.lonMax) {
    throw new Error("ubicación fuera del Valle del Cauca");
  }

  return {
    id: String(body.id || ("r" + new Date().getTime())),
    ts: new Date().toISOString(),
    tipo: tipo,
    categoria: categoria,
    titulo: titulo.slice(0, 200),
    descripcion: String(body.descripcion || "").slice(0, 1000),
    zona: String(body.zona || "").slice(0, 200),
    lat: lat,
    lon: lon,
    contacto: String(body.contacto || "").slice(0, 200),
    urgencia: String(body.urgencia || "normal") === "critico" ? "critico" : "normal",
    estado: "activo"
  };
}

function appendRecord_(record) {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.appendRow(HEADERS.map(function (h) { return record[h]; }));
}

function listRecords_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return values
    .filter(function (row) { return row[0] !== ""; }) // ignora filas vacías
    .map(function (row) {
      var obj = {};
      HEADERS.forEach(function (h, i) { obj[h] = row[i]; });
      obj.lat = Number(obj.lat);
      obj.lon = Number(obj.lon);
      return obj;
    });
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * NOTA sobre moderación: para marcar un reporte como "ya cubierto" (aparece en
 * verde con ✅ en el mapa) o eliminar spam, edita directamente la hoja de
 * cálculo: cambia la columna "estado" a "resuelto", o borra la fila.
 */
