// -----------------------------------------------------------
// scheduler.js
// Programa los casts automaticos con node-cron.
// Se puede ejecutar suelto (npm run scheduler) o desde index.js.
// -----------------------------------------------------------
import cron from "node-cron";
import { config } from "./config.js";
import { publishCast } from "./neynar.js";
import { pickDailyCast, dayOfYear } from "./casts.js";

export async function postScheduledCast() {
  const { text, embeds } = pickDailyCast(dayOfYear());
  const idem = `daily-${new Date().toISOString().slice(0, 10)}`; // 1 por dia como maximo
  try {
    await publishCast({ text, embeds, idem });
  } catch (err) {
    console.error("❌ Error publicando cast programado:", err?.message ?? err);
  }
}

export function startScheduler() {
  if (!cron.validate(config.castCron)) {
    throw new Error(`CAST_CRON invalido: "${config.castCron}"`);
  }
  cron.schedule(config.castCron, postScheduledCast, {
    timezone: config.timeZone,
  });
  console.log(
    `⏰ Scheduler activo. Cron="${config.castCron}" TZ="${config.timeZone}"` +
      (config.dryRun ? " (DRY_RUN: no publica de verdad)" : "")
  );
}

// Permite ejecutar este archivo directamente: node src/scheduler.js
if (import.meta.url === `file://${process.argv[1]}`) {
  startScheduler();
}
