// -----------------------------------------------------------
// webhook.js — respuestas a menciones (@) y empujoncito a respuestas sin @
// -----------------------------------------------------------
import express from "express";
import crypto from "node:crypto";
import { config } from "./config.js";
import { publishCast } from "./neynar.js";
import { buildReply } from "./replies.js";
import { detectLang } from "./contemplators.js";
import { alreadySeen, markSeen } from "./store.js";

const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

function isValidSignature(req) {
  if (!config.webhookSecret) {
    console.warn("⚠️  NEYNAR_WEBHOOK_SECRET no definido: firma NO verificada.");
    return true;
  }
  const sig = req.get("X-Neynar-Signature");
  if (!sig || !req.rawBody) return false;
  const hmac = crypto
    .createHmac("sha512", config.webhookSecret)
    .update(req.rawBody)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(hmac);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** ¿El cast menciona EXPLICITAMENTE al bot (@username en el texto o fid en mentions)? */
function mentionsBot(cast) {
  const profs = cast.mentioned_profiles || cast.mentionedProfiles || [];
  const fids = profs.map((p) => Number(p?.fid)).filter(Boolean);
  if (config.botFid && fids.includes(config.botFid)) return true;
  const text = (cast.text || "").toLowerCase();
  const handle = (config.botUsername || "").toLowerCase();
  return handle ? text.includes(`@${handle}`) : false;
}

/** Empujoncito bilingue para respuestas SIN @. */
function buildNudge(rawText) {
  const lang = detectLang(rawText);
  const L = config.links[lang] || config.links.es;
  if (lang === "en") {
    return (
      `Mention me with @${config.botUsername} and your 5 answers ` +
      `(obsession, blind spot, gesture, food, crack) and I'll tell you which Contemplator you are 👁️\n\n` +
      `Or go to the atlas: ${L.atlas}`
    );
  }
  return (
    `Mencióname con @${config.botUsername} y tus 5 respuestas ` +
    `(obsesión, punto ciego, gesto, alimento, grieta) y te digo qué Contemplator eres 👁️\n\n` +
    `O ve al atlas: ${L.atlas}`
  );
}

app.get("/", (_req, res) => res.send("Contemplators bot: webhook activo 👁️"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/webhook", async (req, res) => {
  if (!isValidSignature(req)) {
    console.warn("❌ Firma invalida. Peticion rechazada.");
    return res.status(401).send("invalid signature");
  }
  res.status(200).send("ok");

  try {
    const body = req.body;
    if (body?.type !== "cast.created") return;

    const cast = body.data;
    if (!cast) return;

    if (Number(cast.author?.fid) === config.botFid) return;

    if (alreadySeen(cast.hash)) return;
    markSeen(cast.hash);

    const text = cast.text ?? "";
    const author = cast.author?.username ?? "?";
    const parentAuthorFid = Number(cast.author?.fid) || undefined;

    if (mentionsBot(cast)) {
      console.log(`📥 Mencion de @${author}: "${text}"`);
      const reply = buildReply(text);
      await publishCast({
        text: reply.text,
        embeds: reply.embeds,
        parent: cast.hash,
        parentAuthorFid,
        idem: `reply-${cast.hash}`,
      });
    } else {
      console.log(`💬 Respuesta sin @ de @${author}: envio empujoncito`);
      await publishCast({
        text: buildNudge(text),
        parent: cast.hash,
        parentAuthorFid,
        idem: `nudge-${cast.hash}`,
      });
    }
  } catch (err) {
    console.error("❌ Error procesando webhook:", err?.message ?? err);
  }
});

export function startWebhookServer() {
  app.listen(config.port, () => {
    console.log(
      `🌐 Webhook escuchando en http://localhost:${config.port}/webhook` +
        (config.dryRun ? " (DRY_RUN: no publica de verdad)" : "")
    );
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWebhookServer();
}

export { app };
