const { Worker } = require('bullmq');
const { redisConnection } = require('../bullmq/redisConnection');
const SeatLock = require('../models/SeatLock');
const Booking = require('../models/Booking');

const worker = new Worker('seatLockQueue', async (job) => {
    if (job.name === 'autoRelease') {
        const { lockId, bookingId } = job.data;
        const lock = await SeatLock.findById(lockId);

        if (lock && lock.status === 'Locked') {
            lock.status = 'Expired';
            await lock.save();

            await Booking.findByIdAndUpdate(bookingId, {
                bookingStatus: 'Cancelled',
                paymentStatus: 'Failed'
            });
            console.log(`Expired lock auto-released for booking  ${bookingId}`);
        }
    }
},
    {
        connection: {
            host: "127.0.0.1",
            port: 6379,
            maxRetriesPerRequest: null,
            enableReadyCheck: false
        }
    }
);
worker.on('completed', job => console.log(`job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`job ${job.id} failed`, err)
);

module.exports = worker;

