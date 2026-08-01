// -----------------------------------------------------------
// testCast.js
// Publica UN cast de prueba ahora mismo (respeta DRY_RUN).
//   node src/scripts/testCast.js
// -----------------------------------------------------------
import { pickDailyCast, dayOfYear } from "../casts.js";
import { publishCast } from "../neynar.js";

const { text, embeds } = pickDailyCast(dayOfYear());
console.log("Publicando cast de prueba…\n");
await publishCast({ text, embeds, idem: `test-${Date.now()}` });
console.log("\nHecho. (Si DRY_RUN=true, no se publico de verdad.)");
