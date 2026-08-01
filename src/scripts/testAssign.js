// -----------------------------------------------------------
// testAssign.js
// Prueba OFFLINE la asignacion oficial (sin tocar Neynar).
//   node src/scripts/testAssign.js "El glitch, El que reparte, Scroll, Luz, Enganche"
// -----------------------------------------------------------
import { parseSelections, assignContemplator, describeRecord, detectLang, idOf, editionLabel } from "../contemplators.js";
import { buildReply } from "../replies.js";

const input = process.argv.slice(2).join(" ") ||
  "El glitch, El que reparte, Scroll, Luz, Enganche";

const lang = detectLang(input);
console.log("Texto:", input);
console.log("Idioma detectado:", lang, "\n");

const parsed = parseSelections(input);
console.log("Variables detectadas:", parsed.matched, "de 5");

const c = assignContemplator(parsed.selections, input);
console.log("\n👉 Contemplator:", idOf(c.number), "·", c.name, "·", editionLabel(c.edition, lang));
console.log("   Tipo de match:", c.matchType);
console.log("   Rasgos:", describeRecord(c, lang));
console.log("   Imagen:", c.image);
console.log("   OpenSea:", c.opensea);

console.log("\n--- Respuesta que publicaria el bot ---");
const r = buildReply(input);
console.log(r.text);
console.log("\n[embeds]:", JSON.stringify(r.embeds));
