// -----------------------------------------------------------
// replies.js
// Respuesta a una mencion, EN EL IDIOMA de quien escribe.
// Incluye imagen real del contemplator + enlace a OpenSea (embeds).
// -----------------------------------------------------------
import { config } from "./config.js";
import {
  parseSelections,
  assignContemplator,
  describeRecord,
  detectLang,
  editionLabel,
  idOf,
} from "./contemplators.js";

/**
 * Construye la respuesta a una mencion.
 * @returns {{ text: string, embeds: Array }}
 */
export function buildReply(mentionText) {
  const lang = detectLang(mentionText);
  const L = config.links[lang] || config.links.es;
  const { selections, matched } = parseSelections(mentionText);
  const c = assignContemplator(selections, mentionText);

  const id = idOf(c.number);
  const edLabel = editionLabel(c.edition, lang);
  const traits = describeRecord(c, lang);

  // Embeds: imagen del contemplator + su ficha en OpenSea.
  const embeds = [];
  if (c.image) embeds.push({ url: c.image });
  if (c.opensea) embeds.push({ url: c.opensea });

  // Sin variables detectadas -> respuesta guiada al atlas.
  if (matched === 0) {
    if (lang === "es") {
      return {
        text:
          `Tu forma de mirar es Contemplator ${id} · ${c.name} · ${edLabel} 👁️\n\n` +
          `Afínalo respondiendo a las 5 (conversación, exposición, vigilancia, gesto, tentación) o entra al atlas:\n${L.atlas}`,
        embeds,
      };
    }
    return {
      text:
        `Your way of looking is Contemplator ${id} · ${c.name} · ${edLabel} 👁️\n\n` +
        `Refine it by answering the 5 (conversation, exposure, watching, gesture, temptation) or open the atlas:\n${L.atlas}`,
      embeds,
    };
  }

  // Con variables -> asignacion (nota si es el mas cercano, no exacto).
  if (lang === "es") {
    const note = c.matchType === "nearest" ? "\nEl más cercano a tu mirada." : "";
    return {
      text:
        `Eres el Contemplator ${id} · ${c.name} · ${edLabel} 👁️\n\n` +
        `${traits}${note}`,
      embeds,
    };
  }
  const note = c.matchType === "nearest" ? "\nThe closest to your gaze." : "";
  return {
    text:
      `You are Contemplator ${id} · ${c.name} · ${edLabel} 👁️\n\n` +
      `${traits}${note}`,
    embeds,
  };
}
