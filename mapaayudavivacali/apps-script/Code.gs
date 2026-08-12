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
var HEADERS = ["id", "ts", "tipo", "categoria", "titulo", "descripcion", "zona", "lat", "lon", "contacto", "estado"];

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
    var record = validateAndNormalize_(body);
    appendRecord_(record);
    return jsonResponse_({ ok: true, id: record.id });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
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
