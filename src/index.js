// -----------------------------------------------------------
// index.js
// Punto de entrada: arranca a la vez el scheduler (casts automaticos)
// y el servidor de webhook (respuesta a menciones).
// -----------------------------------------------------------
import { config } from "./config.js";
import { startScheduler } from "./scheduler.js";
import { startWebhookServer } from "./webhook.js";

console.log("👁️  Contemplators bot iniciando…");
console.log(`   cuenta: @${config.botUsername} (fid ${config.botFid || "?"})`);
console.log(`   DRY_RUN: ${config.dryRun}`);

startScheduler();
startWebhookServer();
