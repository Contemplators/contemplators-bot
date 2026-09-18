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
// v2 (sept 2026): Conversación · Exposición · Vigilancia · Gesto · Tentación.
// -----------------------------------------------------------
export const VARIABLES = [
  {
    key: "conversacion",
    label: "Conversación",
    labelEn: "Conversation",
    question: "¿Cómo contestas?",
    questionEn: "How do you reply?",
    options: [
      { value: "al_segundo", label: "Al segundo", labelEn: "Straight away", aliases: ["al segundo", "al instante", "al momento", "straight away", "right away", "instantly"] },
      { value: "en_visto", label: "En visto", labelEn: "Left on read", aliases: ["dejar en visto", "en visto", "visto", "left on read", "on read"] },
      { value: "audio_3min", label: "Audio de 3 minutos", labelEn: "Three-minute voice note", aliases: ["audio de 3 minutos", "nota de voz", "voice note", "voice notes", "audios", "audio"] },
      { value: "escribe_borra", label: "Escribe y borra", labelEn: "Types and deletes", aliases: ["escribe y borra", "escribo y borro", "types and deletes", "escribiendo", "typing"] },
      { value: "sticker", label: "Con un sticker", labelEn: "With a sticker", aliases: ["con un sticker", "stickers", "sticker", "gif"] },
    ],
  },
  {
    key: "exposicion",
    label: "Exposición",
    labelEn: "Exposure",
    question: "¿Qué enseñas de ti?",
    questionEn: "What do you show of yourself?",
    options: [
      { value: "todo", label: "Todo", labelEn: "Everything", aliases: ["lo publico todo", "publico todo", "post everything", "publish everything"] },
      { value: "stories_24h", label: "Stories de 24 horas", labelEn: "24-hour stories", aliases: ["stories de 24 horas", "24 hour stories", "solo stories", "24 horas", "stories", "story"] },
      { value: "cuenta_privada", label: "Cuenta privada", labelEn: "Private account", aliases: ["cuenta privada", "private account", "privada", "private"] },
      { value: "solo_mira", label: "Nada, solo mira", labelEn: "Nothing, just watches", aliases: ["nada solo mira", "nada solo miro", "solo miro", "no publico nada", "no publico", "nothing just watch", "just watch", "lurker"] },
      { value: "anonimo", label: "Anónimo, siempre", labelEn: "Always unseen", aliases: ["anonimo siempre", "nunca salgo en mis fotos", "always unseen", "anonimo", "anonima", "anonymous"] },
    ],
  },
  {
    key: "vigilancia",
    label: "Vigilancia",
    labelEn: "Watching",
    question: "¿A quién miras?",
    questionEn: "Who do you watch?",
    options: [
      { value: "al_ex", label: "Al ex", labelEn: "The ex", aliases: ["al ex", "mi ex", "el ex", "the ex", "my ex"] },
      { value: "desconocidos", label: "A desconocidos", labelEn: "Strangers", aliases: ["a desconocidos", "desconocidos", "desconocido", "strangers", "stranger"] },
      { value: "amigos", label: "A amigos", labelEn: "Friends", aliases: ["a amigos", "mis amigos", "amigos", "friends"] },
      { value: "si_mismo", label: "A sí mismo", labelEn: "Themselves", aliases: ["a si mismo", "a mi mismo", "me miro a mi", "myself", "themselves"] },
      { value: "lo_que_le_echen", label: "Lo que le echen", labelEn: "Whatever comes up", aliases: ["lo que le echen", "lo que me echen", "lo que salga", "whatever comes up", "autoplay"] },
    ],
  },
  {
    key: "gesto",
    label: "Gesto",
    labelEn: "Gesture",
    question: "¿Qué haces con lo que te gusta?",
    questionEn: "What do you do with what you like?",
    options: [
      { value: "like_y_sigue", label: "Like y sigue", labelEn: "Likes and scrolls on", aliases: ["like y sigue", "doy like", "likes and scrolls on", "like", "likes"] },
      { value: "guarda", label: "Lo guarda y no vuelve", labelEn: "Saves it, never returns", aliases: ["lo guardo y no vuelvo", "lo guardo", "guardados", "guardar", "saves it", "saved", "save"] },
      { value: "captura", label: "Captura", labelEn: "Screenshots it", aliases: ["captura de pantalla", "pantallazo", "pantallazos", "screenshots", "screenshot", "capturas", "captura"] },
      { value: "a_una_persona", label: "Se lo manda a una persona", labelEn: "Sends it to one person", aliases: ["se lo mando a una persona", "a una persona", "al mismo chat", "se lo mando", "sends it to one person", "to one person"] },
      { value: "comenta", label: "Lo comenta", labelEn: "Comments on it", aliases: ["lo comento", "comentarios", "comentario", "comentar", "comments on it", "comment"] },
    ],
  },
  {
    key: "tentacion",
    label: "Tentación",
    labelEn: "Temptation",
    question: "¿Qué abrirías en su móvil?",
    questionEn: "What would you open on their phone?",
    options: [
      { value: "whatsapp", label: "WhatsApp", labelEn: "WhatsApp", aliases: ["whatsapp", "wasap", "wsp"] },
      { value: "instagram", label: "Instagram", labelEn: "Instagram", aliases: ["instagram", "insta", "ig"] },
      { value: "tiktok", label: "TikTok", labelEn: "TikTok", aliases: ["tiktok", "tik tok"] },
      { value: "sus_apps", label: "Sus apps", labelEn: "Their apps", aliases: ["sus apps", "las apps", "their apps", "apps"] },
      { value: "ninguna", label: "Ninguna", labelEn: "None", aliases: ["no abriria nada", "no abro nada", "ninguna", "ninguno", "none"] },
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
 * @param {object} selections  {conversacion:'en_visto', ...} (parcial o completo)
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
