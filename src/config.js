// -----------------------------------------------------------
// config.js
// Carga variables de entorno e inicializa el cliente de Neynar (SDK v2).
// -----------------------------------------------------------
import "dotenv/config";
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

function required(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Falta la variable de entorno ${name}. Revisa tu archivo .env (usa .env.example como plantilla).`
    );
  }
  return value.trim();
}

function optional(name, fallback = "") {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : fallback;
}

export const config = {
  neynarApiKey: optional("NEYNAR_API_KEY"),
  signerUuid: optional("NEYNAR_SIGNER_UUID"),
  webhookSecret: optional("NEYNAR_WEBHOOK_SECRET"),
  botFid: Number(optional("BOT_FID", "0")),
  botUsername: optional("BOT_USERNAME", "contemplators"),
  port: Number(optional("PORT", "3000")),
  timeZone: optional("TIME_ZONE", "Europe/Madrid"),
  castCron: optional("CAST_CRON", "0 10 * * *"),
  // Enlaces por idioma. Estructura de la web: ES en la raiz, EN en /en/.
  // Secciones actuales: home, atlas, about, collections (/contemplators).
  // (Ya NO existe "world" ni pagina de "mint".)
  links: buildLinks(optional("SITE_URL", "https://www.contemplators.art")),
  dryRun: optional("DRY_RUN", "true").toLowerCase() === "true",
};

function buildLinks(base) {
  const b = base.replace(/\/+$/, ""); // sin barra final
  return {
    es: {
      home: `${b}/`,
      atlas: `${b}/atlas`,
      about: `${b}/about`,
      collections: `${b}/contemplators`,
    },
    en: {
      home: `${b}/en/`,
      atlas: `${b}/en/atlas`,
      about: `${b}/en/about`,
      collections: `${b}/en/contemplators`,
    },
  };
}

// Cliente Neynar (solo si hay API key; en DRY_RUN puro se puede probar sin ella).
let _client = null;
export function getClient() {
  if (_client) return _client;
  const apiKey = required("NEYNAR_API_KEY");
  const configuration = new Configuration({
    apiKey,
    baseOptions: {
      headers: {
        "x-neynar-experimental": true,
      },
    },
  });
  _client = new NeynarAPIClient(configuration);
  return _client;
}

export { required };
