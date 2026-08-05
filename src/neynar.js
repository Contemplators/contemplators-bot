// -----------------------------------------------------------
// neynar.js
// Envoltorio fino sobre el SDK de Neynar para publicar casts y responder.
// Respeta DRY_RUN: si esta activo, solo imprime lo que haria.
// -----------------------------------------------------------
import { config, getClient } from "./config.js";

/**
 * Publica un cast nuevo (o una respuesta si se pasa `parent`).
 * @param {object} opts
 * @param {string} opts.text Texto del cast (max ~320 bytes en Farcaster).
 * @param {string} [opts.parent] Hash del cast padre (para responder).
 * @param {number} [opts.parentAuthorFid] FID del autor del cast padre.
 * @param {Array<{url:string}>} [opts.embeds] Embeds (imagenes, enlaces, frames).
 * @param {string} [opts.idem] Clave de idempotencia para evitar duplicados.
 * @param {string} [opts.channelId] Slug del canal donde publicar (p.ej. "art").
 */
export async function publishCast({ text, parent, parentAuthorFid, embeds, idem, channelId }) {
  const safeText = truncateCast(text);

  if (config.dryRun) {
    console.log("🧪 [DRY_RUN] Cast NO publicado. Contenido:");
    console.log("  texto:", safeText);
    if (parent) console.log("  respuesta a:", parent);
    if (channelId) console.log("  canal:", channelId);
    if (embeds?.length) console.log("  embeds:", JSON.stringify(embeds));
    return { dryRun: true, cast: { text: safeText } };
  }

  if (!config.signerUuid) {
    throw new Error(
      "Falta NEYNAR_SIGNER_UUID. Aprueba el signer con 'Sign In With Neynar' en dev.neynar.com."
    );
  }

  const client = getClient();
  const payload = {
    signerUuid: config.signerUuid,
    text: safeText,
  };
  if (parent) payload.parent = parent;
  if (parentAuthorFid) payload.parentAuthorFid = parentAuthorFid;
  if (embeds?.length) payload.embeds = embeds;
  if (idem) payload.idem = idem;
  if (channelId) payload.channelId = channelId;

  const response = await client.publishCast(payload);
  console.log(
    "✅ Cast publicado:",
    response?.cast?.hash ?? "(sin hash)",
    channelId ? `(canal: ${channelId})` : ""
  );
  return response;
}

/**
 * Farcaster limita los casts a 320 bytes. Cortamos de forma segura.
 */
export function truncateCast(text) {
  const enc = new TextEncoder();
  if (enc.encode(text).length <= 320) return text;
  let out = text;
  while (enc.encode(out + "…").length > 320 && out.length > 0) {
    out = out.slice(0, -1);
  }
  return out.trimEnd() + "…";
}
