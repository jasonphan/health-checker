class RedisService {
  constructor(redisClient) {
    this.client = redisClient;
  }

  /**
   * Delete keys in connected redis instance matching pattern provided.
   * @param {string} pattern
   * @returns {Promise<void>} Promise
   */
  deleteKeysByPattern(pattern) {
    return new Promise((resolve, reject) => {
      const stream = this.client.scanStream({
        match: pattern,
      });

      stream.on('data', (keys) => {
        if (keys.length) {
          const pipeline = this.client.pipeline();

          keys.forEach((key) => {
            pipeline.del(key);
          });

          pipeline.exec();
        }
      });

      stream.on('end', () => {
        resolve();
      });

      stream.on('error', (e) => {
        reject(e);
      });
    });
  }
}

module.exports = RedisService;
