# Contemplators Bot 👁️

Bot de [Farcaster](https://www.farcaster.xyz/) para el proyecto **Contemplators** (www.contemplators.art). Actúa desde **tu cuenta personal** de Farcaster mediante [Neynar](https://neynar.com) y hace cuatro cosas:

1. **Casts automáticos** — publica contenido programado (manifiesto, concepto, atlas, colección) con **imagen** de una pieza de la colección.
2. **Responde a menciones** — cuando te mencionan, contesta automáticamente.
3. **Asigna un contemplator** — lee las 5 variables del atlas y hace el **emparejamiento oficial 1:1** con la web (datos del Google Sheet en `src/data/contemplators.json`): devuelve el contemplator exacto (#001–#200), su **nombre**, su **edición** (Original / Clorofílico), su **imagen** y su enlace de **OpenSea**. Si el usuario no da las 5 variables, devuelve el más cercano.
4. **Difunde la colección** — imágenes y enlaces (web + OpenSea) en casts y respuestas.

**Concepto actual** (según www.contemplators.art): una colección sobre *el arte de detenerse* / el acto radical de mirar. Cada Contemplator tiene una obsesión que persigue, un punto ciego que no ve, algo que desprecia y una contradicción que no resuelve. La colección son **200 piezas en dos ediciones** (Original y Clorofílicos / *Chlorophyllics*), y en crecimiento. El bot recoge el manifiesto ("Somos scrollers. Buscamos buscar… No pensamos. Y derrochamos sabiduría. Somos contemplators.") en su contenido.

**Bilingüe (ES/EN)**: los casts automáticos alternan español e inglés (día a día), y el bot **responde en el idioma** de quien le menciona (detección automática). Los términos del atlas se guardan en español con su traducción al inglés. Ver `casts.js`, `replies.js` y `detectLang()` en `contemplators.js`.

Las **5 variables del atlas**: Obsesión (¿a qué vas?), Punto ciego (¿qué no pillas?), Gesto (¿qué le haces a la pantalla?), Alimento (¿de qué comes?) y Grieta (¿por dónde te rompes?), con 5 opciones cada una.

---

## Cómo funciona (arquitectura)

```
              ┌──────────────────────┐
   cron  ───► │  scheduler.js        │ ──► publica casts automáticos
              └──────────────────────┘
                        │
              ┌──────────────────────┐
 Neynar ────► │  webhook.js (Express)│ ──► detecta menciones
 (webhook)    └──────────────────────┘        │
                        │                      ▼
                        │             replies.js + contemplators.js
                        │             (empareja variables → contemplator)
                        ▼
                   neynar.js  ──►  API de Neynar  ──►  Farcaster
```

- `src/contemplators.js` — el "atlas": las 5 variables, las 100 variantes y el emparejamiento **determinista** (una misma combinación siempre da el mismo contemplator).
- `src/casts.js` — los textos de los casts automáticos (edítalos a tu gusto).
- `src/neynar.js` — publica/responde vía Neynar. Respeta `DRY_RUN`.

---

## Requisitos previos

- **Node.js 18 o superior** (`node --version`).
- Una **cuenta de Farcaster** (la tuya) y tu **FID**.
- Una cuenta en **Neynar** (https://dev.neynar.com). Publicar casts requiere un plan de pago; hay tier de inicio.
- Para producción: un servidor con IP/dominio público **o** [ngrok](https://ngrok.com) para exponer el webhook.

---

## Instalación

```bash
cd contemplators-bot
npm install
cp .env.example .env
```

Luego edita `.env` (ver siguiente sección).

---

## Configuración paso a paso

### 1) API key de Neynar
1. Entra en https://dev.neynar.com y crea una app.
2. Copia la **API key** a `NEYNAR_API_KEY` en tu `.env`.

### 2) Aprobar el signer (para castear desde TU cuenta)
Neynar necesita un *signer* que tu cuenta autorice para poder castear en tu nombre **sin** darle tu frase semilla:

1. En https://dev.neynar.com abre tu app → **"Agents and bots"** → **"use existing account"**.
2. Pulsa **"Sign in With Neynar"** y aprueba desde la cuenta con la que quieres castear (la tuya).
3. Copia el **signer UUID** resultante a `NEYNAR_SIGNER_UUID`.

> El signer permite publicar en tu nombre. Guárdalo como un secreto.

### 3) Tu FID y username
- Pon tu FID en `BOT_FID` (lo ves en dev.neynar.com o en tu perfil).
- Pon tu username (sin @) en `BOT_USERNAME`.

### 4) Crear el webhook de menciones
1. En https://dev.neynar.com/webhook crea un webhook nuevo.
2. Filtro: evento **`cast.created`** con **`mentioned_fids`** = tu FID.
   (Así el bot se entera cada vez que te mencionan.)
3. Como URL de destino pon la de tu servidor: `https://TU-DOMINIO/webhook`
   (o la URL de ngrok, ver más abajo).
4. Copia el **webhook secret** a `NEYNAR_WEBHOOK_SECRET` (sirve para verificar la firma).

### 5) Enlaces y horario
Ajusta en `.env`: `SITE_URL` (solo la base; las secciones por idioma se derivan solas), `CAST_CRON` y `TIME_ZONE`.

---

## Probar SIN publicar (recomendado primero)

Con `DRY_RUN=true` (por defecto) nada se publica de verdad: solo se imprime en consola.

Probar la lógica de asignación de contemplator:
```bash
node src/scripts/testAssign.js "voy al glitch, no pillo la hora, hago zoom, como ruido, me rompo por ansia"
```

Probar cómo se vería un cast automático:
```bash
npm run cast:test
```

Levantar el webhook en local y mandarle una mención de prueba (ver sección ngrok):
```bash
npm run webhook
```

Cuando estés conforme, pon `DRY_RUN=false` en `.env` para publicar de verdad.

---

## Exponer el webhook con ngrok (para desarrollo)

```bash
npm run webhook          # arranca en el puerto 3000
ngrok http 3000          # en otra terminal; copia la URL https que te da
```
Pon esa URL (`https://xxxx.ngrok-free.app/webhook`) como destino del webhook en dev.neynar.com.

---

## Arrancar en producción (con PM2)

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 logs contemplators-bot     # ver actividad
pm2 restart contemplators-bot  # reiniciar tras cambios
pm2 save && pm2 startup        # que sobreviva a reinicios del servidor
```

`index.js` arranca a la vez el scheduler y el webhook. Si prefieres separarlos:
- `npm run scheduler` — solo casts automáticos.
- `npm run webhook` — solo respuestas a menciones.

---

## Personalizar

- **Las 5 variables del atlas**: ya están cargadas en `VARIABLES` (`src/contemplators.js`) según el atlas actual — Obsesión (¿a qué vas?), Punto ciego (¿qué no pillas?), Gesto (¿qué le haces a la pantalla?), Alimento (¿de qué comes?) y Grieta (¿por dónde te rompes?), con 5 opciones cada una. Puedes ampliar los `aliases` para que el parser reconozca más formas de escribir cada opción.
- **Emparejamiento oficial (importante)**: por defecto el bot usa un hash determinista variables→#001..#100. Esto **no** coincide con la web. Para que empareje 1:1 con www.contemplators.art, rellena `OFFICIAL_MAP` en `src/contemplators.js` con la tabla real (la del Google Sheet): cada clave canónica (`obsesion:...|punto_ciego:...|gesto:...|alimento:...|grieta:...`) apunta a su número de contemplator.
- **Textos de los casts**: `src/casts.js`.
- **Respuestas a menciones**: `src/replies.js`.
- **Frecuencia**: `CAST_CRON` en `.env` (formato cron; por defecto `0 10 * * *` = 10:00 cada día).

---

## Notas de seguridad

- No subas tu `.env` a git (ya está en `.gitignore`).
- El `signer_uuid` y el `webhook_secret` son secretos: quien los tenga puede castear en tu nombre o falsificar eventos.
- El webhook verifica la firma HMAC-SHA512 de Neynar antes de procesar nada.

---

## Estructura

```
contemplators-bot/
├── package.json
├── .env.example
├── ecosystem.config.cjs        # PM2
├── README.md
└── src/
    ├── config.js               # env + cliente Neynar v2
    ├── neynar.js               # publicar / responder (respeta DRY_RUN)
    ├── contemplators.js        # atlas: 5 variables, 100 variantes, matching
    ├── casts.js                # contenido de casts automáticos
    ├── scheduler.js            # cron
    ├── replies.js              # lógica de respuesta a menciones
    ├── webhook.js              # servidor Express + verificación de firma
    ├── store.js                # anti-duplicados
    ├── index.js                # arranca todo
    └── scripts/
        ├── testAssign.js       # prueba offline de asignación
        └── testCast.js         # prueba de cast (DRY_RUN)
```
