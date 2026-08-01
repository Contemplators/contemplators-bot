// -----------------------------------------------------------
// webhook.js
// Servidor HTTP que recibe eventos de Neynar (cast.created con mencion al bot)
// y responde asignando un contemplator.
//
// Seguridad: verifica la firma HMAC-SHA512 del header X-Neynar-Signature
// usando NEYNAR_WEBHOOK_SECRET.
// -----------------------------------------------------------
import express from "express";
import crypto from "node:crypto";
import { config } from "./config.js";
import { publishCast } from "./neynar.js";
import { buildReply } from "./replies.js";
import { alreadySeen, markSeen } from "./store.js";

const app = express();

// Necesitamos el cuerpo CRUDO para verificar la firma, ademas del JSON parseado.
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

/** Verifica la firma del webhook de Neynar (HMAC-SHA512). */
function isValidSignature(req) {
  if (!config.webhookSecret) {
    // Sin secreto configurado no podemos verificar; avisamos y dejamos pasar.
    console.warn("⚠️  NEYNAR_WEBHOOK_SECRET no definido: firma NO verificada.");
    return true;
  }
  const sig = req.get("X-Neynar-Signature");
  if (!sig || !req.rawBody) return false;
  const hmac = crypto
    .createHmac("sha512", config.webhookSecret)
    .update(req.rawBody)
    .digest("hex");
  // Comparacion en tiempo constante.
  const a = Buffer.from(sig);
  const b = Buffer.from(hmac);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.get("/", (_req, res) => res.send("Contemplators bot: webhook activo 👁️"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/webhook", async (req, res) => {
  // Respondemos 200 rapido; procesamos despues para no forzar reintentos.
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

    // Evitar bucles: ignorar nuestros propios casts.
    if (Number(cast.author?.fid) === config.botFid) return;

    // Evitar responder dos veces al mismo cast.
    if (alreadySeen(cast.hash)) return;
    markSeen(cast.hash);

    const text = cast.text ?? "";
    console.log(`📥 Mencion de @${cast.author?.username ?? "?"}: "${text}"`);

    const reply = buildReply(text);
    await publishCast({
      text: reply.text,
      embeds: reply.embeds,
      parent: cast.hash,
      parentAuthorFid: Number(cast.author?.fid) || undefined,
      idem: `reply-${cast.hash}`,
    });
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

// Ejecutable directo: node src/webhook.js
if (import.meta.url === `file://${process.argv[1]}`) {
  startWebhookServer();
}

export { app };
