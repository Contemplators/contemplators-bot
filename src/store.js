// -----------------------------------------------------------
// store.js
// Almacen minimo en disco para no responder dos veces al mismo cast.
// -----------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "seen-casts.json");

let seen = new Set();

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(FILE)) {
    try {
      const arr = JSON.parse(fs.readFileSync(FILE, "utf8"));
      seen = new Set(arr);
    } catch {
      seen = new Set();
    }
  }
}
ensure();

export function alreadySeen(hash) {
  return seen.has(hash);
}

export function markSeen(hash) {
  seen.add(hash);
  // Guardamos solo los ultimos 5000 para que el archivo no crezca sin fin.
  const arr = Array.from(seen).slice(-5000);
  seen = new Set(arr);
  try {
    fs.writeFileSync(FILE, JSON.stringify(arr));
  } catch (err) {
    console.error("No se pudo guardar seen-casts.json:", err?.message);
  }
}
