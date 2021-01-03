module.exports = {
  workers: Number(process.env.WORKERS) || 1,
  frequency: Number(process.env.FREQUENCY) || 60,
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
};
