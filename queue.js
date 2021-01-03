require('dotenv').config();

const Queue = require('bee-queue');
const Redis = require('ioredis');
const { DateTime } = require('luxon');
const config = require('./config');
const RedisService = require('./services/redis-service');
const jobs = require('./jobs.json');

const { getHeaders } = require('./utils/curl');
const { sendMessage } = require('./utils/discord');

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
};

const queueConfig = {
  redis: redisConfig,
  removeOnSuccess: true,
  removeOnFailure: true,
  activateDelayedJobs: true,
};

const redis = new RedisService(new Redis(redisConfig));
const queue = new Queue('health_checker', queueConfig);

const errors = {};

(async () => {
  await redis.deleteKeysByPattern('bq:health_checker:*');

  await Promise.all(jobs.map(
    (job) => queue
      .createJob({ ...job })
      .save(),
  ));

  queue.process(config.workers, async (job) => {
    const result = {
      id: job.id,
      url: job.data.url,
      iso: DateTime.local().toString(),
      target_status: String(job.data.target_status),
    };

    try {
      const { status } = await getHeaders(job.data.url);

      result.response_status = status;
    } catch (error) {
      result.error_message = error.message;
    }

    return result;
  });

  queue.on('succeeded', async (job, result) => {
    console.log(result);

    const ok = result.response_status === result.target_status;
    const webhookUrl = job.data.discord_webhook_url || config.discord.webhookUrl;

    await queue.createJob({ ...job.data })
      .delayUntil(DateTime.local().plus({ seconds: config.frequency }).toMillis())
      .save();

    if (!webhookUrl) {
      return;
    }

    if (!ok && !errors[result.url]) {
      errors[result.url] = result.iso;

      await sendMessage(webhookUrl, {
        content: `Health check failed for ${result.url}`,
        fields: result,
      });
    }

    if (ok && errors[result.url]) {
      const diff = DateTime.fromISO(result.iso) - DateTime.fromISO(errors[result.url]);
      const down = DateTime.local().minus({ milliseconds: diff }).toRelative();

      delete errors[result.url];

      await sendMessage(webhookUrl, {
        content: `Health check success for ${result.url}`,
        fields: {
          ...result,
          failed: down,
        },
        color: '65280',
      });
    }
  });
})();
