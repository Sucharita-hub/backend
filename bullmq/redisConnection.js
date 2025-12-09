const IORedis = require('ioredis');

const redisConnection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

module.exports = { redisConnection };