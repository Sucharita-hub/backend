const { Queue } = require('bullmq');
const { redisconnection } = require('./redisConnection');

const seatLockQueue = new Queue('seatLockQueue', {
    connection: {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
    }
});

module.exports = { seatLockQueue }; 