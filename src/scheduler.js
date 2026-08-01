// -----------------------------------------------------------
// scheduler.js
// Programa los casts automaticos con node-cron.
// 2 casts/dia (p.ej. 10:00 y 19:00): manana y tarde son piezas distintas.
// -----------------------------------------------------------
import cron from "node-cron";
import { config } from "./config.js";
import { publishCast } from "./neynar.js";
import { pickDailyCast, dayOfYear } from "./casts.js";

export async function postScheduledCast() {
  const now = new Date();
  const slot = now.getUTCHours() < 14 ? 0 : 1;
  const index = dayOfYear(now) * 2 + slot;
  const { text, embeds } = pickDailyCast(index);
  const idem = `cast-${now.toISOString().slice(0, 10)}-${slot}`;
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

if (import.meta.url === `file://${process.argv[1]}`) {
  startScheduler();
}
