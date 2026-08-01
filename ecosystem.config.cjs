// Configuracion de PM2 para mantener el bot vivo en un servidor.
//   pm2 start ecosystem.config.cjs
//   pm2 logs contemplators-bot
//   pm2 restart contemplators-bot
module.exports = {
  apps: [
    {
      name: "contemplators-bot",
      script: "src/index.js",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
