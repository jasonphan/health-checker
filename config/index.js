module.exports = {
  workers: Number(process.env.WORKERS) || 1,
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
};
