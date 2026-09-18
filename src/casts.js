// -----------------------------------------------------------
// casts.js
// Contenido de los casts automaticos, BILINGE y ALTERNO (ES/EN).
// Plantillas intercaladas ES, EN, ES, EN... -> dias consecutivos alternan idioma.
// Enlaces por idioma (ES en la raiz, EN en /en/). Sin World ni mint:
// la difusion de la coleccion apunta a Collections (/contemplators).
//
// 👉 Edita libremente. Manten cada texto por debajo de 320 caracteres.
// -----------------------------------------------------------
import { config } from "./config.js";
import { DATA } from "./contemplators.js";

const es = config.links.es;
const en = config.links.en;

/** Plantillas intercaladas ES/EN. Cada una devuelve { text, embeds }. */
export const CAST_TEMPLATES = [
  // Concepto
  () => ({ text: `El acto radical hoy no es hacer. Es detenerse.\n\nContemplators: una colección sobre el acto radical de mirar.\n\n${es.home}` }),
  () => ({ text: `The radical act today isn't doing. It's stopping.\n\nContemplators: a collection about the radical act of looking.\n\n${en.home}` }),

  // Manifiesto V (punto ciego)
  () => ({ text: `«Vemos lo que queremos ver. No somos conscientes de lo que no queremos ver.»\n\nEl punto ciego. El ángulo neutro.\n\n${es.about}` }),
  () => ({ text: `"We see what we want to see. We are not aware of what we do not want to see."\n\nThe blind spot. The neutral angle.\n\n${en.about}` }),

  // Atlas
  () => ({ text: `¿Cómo contestas? ¿Qué enseñas de ti? ¿A quién miras? ¿Qué haces con lo que te gusta? ¿Qué abrirías en su móvil?\n\n5 preguntas. 1 Contemplator 👁️\n${es.atlas}` }),
  () => ({ text: `How do you reply? What do you show of yourself? Who do you watch? What do you do with what you like? What would you open on their phone?\n\n5 questions. 1 Contemplator 👁️\n${en.atlas}` }),

  // "Nadie ve el cuadro entero"
  () => ({ text: `Ninguno ve el cuadro entero. Ninguno ve lo mismo que otro.\n\nTú ves lo que el otro no ve. Un Contemplator ve lo que tú no ves.\n\n${es.about}` }),
  () => ({ text: `No one sees the whole picture. No one sees the same as another.\n\nYou see what the other doesn't. A Contemplator sees what you don't.\n\n${en.about}` }),

  // Manifiesto X (cierre)
  () => ({ text: `«No pensamos. Y derrochamos sabiduría.»\n\nSomos contemplators.\n\n${es.home}` }),
  () => ({ text: `"We do not think. And we waste wisdom."\n\nWe are contemplators.\n\n${en.home}` }),

  // Ediciones / coleccion
  () => ({ text: `Dos ediciones para mirar lo mismo de otra manera: la Original y los Clorofílicos 🌱\n\nDescubre la colección:\n${es.collections}` }),
  () => ({ text: `Two editions to look at the same thing differently: the Original and the Chlorophyllics 🌱\n\nExplore the collection:\n${en.collections}` }),

  // Llamada al bot
  () => ({ text: `Mencióname con tus 5 respuestas (conversación, exposición, vigilancia, gesto, tentación) y te digo qué Contemplator eres.\n\nO ve al atlas: ${es.atlas}` }),
  () => ({ text: `Mention me with your 5 answers (conversation, exposure, watching, gesture, temptation) and I'll tell you which Contemplator you are.\n\nOr go to the atlas: ${en.atlas}` }),
];

/**
 * Cast del dia: texto rotatorio + imagen de un contemplator (tambien rotatoria).
 * Asi cada post lleva una pieza distinta de la coleccion.
 */
export function pickDailyCast(dayIndex) {
  const tpl = CAST_TEMPLATES[dayIndex % CAST_TEMPLATES.length]();
  const c = DATA[dayIndex % DATA.length];
  const embeds = c?.image ? [{ url: c.image }] : [];
  return { text: tpl.text, embeds };
}

/** Numero de dia del ano (1..366). */
export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
