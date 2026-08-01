// -----------------------------------------------------------
// contemplators.js
// El "atlas" oficial de Contemplators, cargado desde src/data/contemplators.json
// (generado a partir del Google Sheet). 200 piezas: #001-#100 Original,
// #101-#200 Clorofílico. Cada una con su combinación única de 5 variables,
// nombre, imagen y enlace de OpenSea.
//
// Emparejamiento:
//  - Coincidencia EXACTA de la combinación -> ese contemplator (1:1 con la web).
//  - Si no hay exacta -> el más cercano (más variables en común), determinista.
// -----------------------------------------------------------
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DATA = JSON.parse(
  readFileSync(join(__dirname, "data", "contemplators.json"), "utf8")
);
export const TOTAL_CONTEMPLATORS = DATA.length; // 200

// Indice por clave de combinación para busqueda exacta O(1).
const BY_KEY = new Map(DATA.map((c) => [c.key, c]));

// -----------------------------------------------------------
// Las 5 variables (ES + EN). Los labels ES coinciden EXACTAMENTE con el sheet.
// -----------------------------------------------------------
export const VARIABLES = [
  {
    key: "obsesion",
    label: "Obsesión",
    labelEn: "Obsession",
    question: "¿A qué vas?",
    questionEn: "What are you going for?",
    options: [
      { value: "la_raiz", label: "La raíz", labelEn: "The root", aliases: ["la raiz", "raiz", "the root", "root"] },
      { value: "el_loop", label: "El loop", labelEn: "The loop", aliases: ["el loop", "loop", "the loop", "bucle"] },
      { value: "el_glitch", label: "El glitch", labelEn: "The glitch", aliases: ["el glitch", "glitch", "the glitch"] },
      { value: "la_senal", label: "La señal", labelEn: "The signal", aliases: ["la senal", "senal", "the signal", "signal"] },
      { value: "la_cripta", label: "La cripta", labelEn: "The crypt", aliases: ["la cripta", "cripta", "the crypt", "crypt"] },
    ],
  },
  {
    key: "punto_ciego",
    label: "Punto ciego",
    labelEn: "Blind spot",
    question: "¿Qué no pillas?",
    questionEn: "What don't you get?",
    options: [
      { value: "el_que_reparte", label: "El que reparte", labelEn: "The dealer", aliases: ["el que reparte", "reparte", "the dealer", "dealer"] },
      { value: "su_reflejo", label: "Su reflejo", labelEn: "The reflection", aliases: ["su reflejo", "reflejo", "the reflection", "reflection"] },
      { value: "la_hora", label: "La hora", labelEn: "The time", aliases: ["la hora", "the time"] },
      { value: "la_fuente", label: "La fuente", labelEn: "The source", aliases: ["la fuente", "fuente", "the source", "source"] },
      { value: "el_de_al_lado", label: "El de al lado", labelEn: "The one next to you", aliases: ["el de al lado", "de al lado", "al lado", "the one next to you", "next to you"] },
    ],
  },
  {
    key: "gesto",
    label: "Gesto",
    labelEn: "Gesture",
    question: "¿Qué le haces a la pantalla?",
    questionEn: "What are you doing to the screen?",
    options: [
      { value: "scroll", label: "Scroll", labelEn: "Scroll", aliases: ["scroll", "scrollear", "scrolling"] },
      { value: "zoom", label: "Zoom", labelEn: "Zoom", aliases: ["zoom", "zooming"] },
      { value: "pausa", label: "Pausa", labelEn: "Pause", aliases: ["pausa", "pausar", "pause"] },
      { value: "remix", label: "Remix", labelEn: "Remix", aliases: ["remix", "remezcla"] },
      { value: "save", label: "Save", labelEn: "Save", aliases: ["save", "guardar", "saving"] },
    ],
  },
  {
    key: "alimento",
    label: "Alimento",
    labelEn: "Food",
    question: "¿De qué comes?",
    questionEn: "What do you eat?",
    options: [
      { value: "luz", label: "Luz", labelEn: "Light", aliases: ["luz", "light"] },
      { value: "ruido", label: "Ruido", labelEn: "Noise", aliases: ["ruido", "noise"] },
      { value: "data", label: "Data", labelEn: "Data", aliases: ["data", "datos"] },
      { value: "silencio", label: "Silencio", labelEn: "Silence", aliases: ["silencio", "silence"] },
      { value: "carne_ajena", label: "Carne ajena", labelEn: "Someone else's flesh", aliases: ["carne ajena", "carne", "someone elses flesh", "someone else's flesh", "flesh"] },
    ],
  },
  {
    key: "grieta",
    label: "Grieta",
    labelEn: "Crack",
    question: "¿Por dónde te rompes?",
    questionEn: "Where do you break?",
    options: [
      { value: "postureo", label: "Postureo", labelEn: "Posturing", aliases: ["postureo", "postureos", "posturing", "posing"] },
      { value: "ansia", label: "Ansia", labelEn: "Craving", aliases: ["ansia", "ansias", "craving", "crave"] },
      { value: "envidia", label: "Envidia", labelEn: "Envy", aliases: ["envidia", "envy"] },
      { value: "rayada", label: "Rayada", labelEn: "Overthinking", aliases: ["rayada", "rayado", "rayarse", "overthinking", "overthink", "spiraling"] },
      { value: "enganche", label: "Enganche", labelEn: "Hooked", aliases: ["enganche", "enganchado", "enganchada", "hooked", "addiction", "addicted"] },
    ],
  },
];
const VAR_KEYS = VARIABLES.map((v) => v.key); // orden = orden de la clave

// Ediciones -> etiqueta visible (ES/EN).
export const EDITIONS = {
  original: { label: "Original", labelEn: "Original" },
  clorofilicos: { label: "Clorofílico", labelEn: "Chlorophyllic" },
};

export function editionLabel(edition, lang = "es") {
  const e = EDITIONS[edition];
  if (!e) return edition;
  return lang === "en" ? e.labelEn : e.label;
}

// -----------------------------------------------------------
// Utilidades
// -----------------------------------------------------------
export function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function idOf(number) {
  return `#${String(number).padStart(3, "0")}`;
}

/** slug -> label (ES o EN) de una opcion. */
function labelFor(variableKey, value, lang = "es") {
  const v = VARIABLES.find((x) => x.key === variableKey);
  const o = v?.options.find((x) => x.value === value);
  if (!o) return value;
  return lang === "en" ? o.labelEn ?? o.label : o.label;
}

/** label ES -> opcion (para traducir los datos del sheet a EN). */
function optionByEsLabel(variableKey, esLabel) {
  const v = VARIABLES.find((x) => x.key === variableKey);
  return v?.options.find((o) => o.label === esLabel);
}

/** Detecta idioma: "es" o "en". */
export function detectLang(rawText) {
  const t = " " + (rawText || "").toLowerCase() + " ";
  if (/[ñ¿¡áéíóú]/.test(t)) return "es";
  const esWords = [
    " el ", " la ", " los ", " las ", " que ", " no ", " con ", " de ",
    " por ", " soy ", " voy ", " eres ", " tu ", " mi ", " y ", " un ",
    " una ", " pillas ", " rompes ", " hago ", " como ", " menciona ",
  ];
  return esWords.some((w) => t.includes(w)) ? "es" : "en";
}

/**
 * Parser: extrae selecciones (slugs) de las 5 variables desde texto libre.
 * Prioriza aliases mas largos para evitar falsos positivos.
 */
export function parseSelections(rawText) {
  const text = normalize(rawText);
  const selections = {};
  for (const variable of VARIABLES) {
    const candidates = variable.options
      .flatMap((opt) => opt.aliases.map((a) => ({ value: opt.value, alias: normalize(a) })))
      .sort((a, b) => b.alias.length - a.alias.length);
    for (const c of candidates) {
      const escaped = c.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`).test(text)) {
        selections[variable.key] = c.value;
        break;
      }
    }
  }
  const missing = VAR_KEYS.filter((k) => !(k in selections));
  return { selections, matched: Object.keys(selections).length, missing };
}

/**
 * Asigna un contemplator a partir de las selecciones (slugs) del usuario.
 * @param {object} selections  {obsesion:'la_cripta', ...} (parcial o completo)
 * @param {string} rawText     texto original (para desempate determinista)
 * @returns el registro del contemplator + {matchType, requested}
 */
export function assignContemplator(selections, rawText = "") {
  // Convertir slugs -> labels ES (las claves del sheet estan en ES).
  const provided = {};
  for (const k of VAR_KEYS) {
    if (selections[k]) provided[k] = labelFor(k, selections[k], "es");
  }
  const providedKeys = Object.keys(provided);

  // 1) Coincidencia exacta (las 5 variables) -> 1:1 con la web.
  if (providedKeys.length === 5) {
    const key = VAR_KEYS.map((k) => provided[k]).join("|");
    const rec = BY_KEY.get(key);
    if (rec) return { ...rec, matchType: "exact", requested: provided };
  }

  // 2) Mas cercano: mayor numero de variables provistas que coinciden.
  let best = [];
  let bestScore = -1;
  for (const rec of DATA) {
    let s = 0;
    for (const k of providedKeys) if (rec[k] === provided[k]) s++;
    if (s > bestScore) {
      bestScore = s;
      best = [rec];
    } else if (s === bestScore) {
      best.push(rec);
    }
  }
  // Desempate determinista (mismo input -> mismo resultado).
  const seed = fnv1a((rawText || "") + "|" + providedKeys.map((k) => provided[k]).join("|"));
  const rec = best[seed % best.length];
  // La coincidencia exacta (5/5) ya se devolvio arriba; aqui siempre es aproximada.
  return { ...rec, matchType: "nearest", requested: provided };
}

/** Devuelve el contemplator por numero (1..200) o null. */
export function getByNumber(number) {
  return DATA.find((c) => c.number === number) || null;
}

/**
 * Describe los 5 rasgos de un contemplator (segun idioma).
 * es -> "Obsesión: El glitch · ..."   en -> "Obsession: The glitch · ..."
 */
export function describeRecord(rec, lang = "es") {
  return VARIABLES.map((v) => {
    const vLabel = lang === "en" ? v.labelEn : v.label;
    const opt = optionByEsLabel(v.key, rec[v.key]);
    const oLabel = opt ? (lang === "en" ? opt.labelEn : opt.label) : rec[v.key];
    return `${vLabel}: ${oLabel}`;
  }).join(" · ");
}
