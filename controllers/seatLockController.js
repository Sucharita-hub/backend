const SeatLock = require("../models/SeatLock");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");
const { Queue } = require("bullmq");
//create bullmq queue
const seatLockQueue = new Queue("seat-lock-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
//lockSeats
exports.lockedSeats = async (req, res, next) => {
    try {
        const { showtimeId, seats, lockMinutes } = req.body;
        const userId = req.user._id;

        if (!showtimeId || !seats || seats.length === 0) {
            return res.status(400).json({ message: "showtime ID and seats are required" });
        }
        // 1. Reads the showtimeid and selectedSeats from request body 
        const existingLock = await SeatLock.findOne({
            showtime: showtimeId,
            seats: { $in: seats },//select documents where the value of a field equals any value in the specified array
            status: 'Locked',
            expiresAt: { $gt: new Date() }// gt-greater than
        });
        if (existingLock) {
            return res.status(409).json({ message: "some seats are already locked or booked" });
        }
        // 2. remove expired locks automatically before checking
        const expiresAt = new Date(Date.now() + lockMinutes * 60 * 1000);
        const newLocks = await SeatLock.create({
            showtime: showtimeId,
            user: userId,
            seats,
            expiresAt
        });
        //add bullMQ delayed job
        await seatLockQueue.add(
            'releaseLock',
            { lockId: newLocks._id },
            { delay: lockMinutes * 60 * 1000 }
        );
        res.status(201).json({
            message: "Seats locked successfully",
            lockId: newLocks._id,
            expiresAt
        });
    } catch (err) {
        console.error("error locking seats:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
//manually release seats
exports.releaseSeats = async (req, res) => {
    try {
        const { lockId } = req.body;
        const lock = await SeatLock.findById(lockId);
        if (!lock) return res.status(404).json({ message: "lock not found" });

        lock.status = 'Released';
        await lock.save();
        res.json({ message: "Lock released successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSeatStatus = async (req, res) => {
    try {
        const showtimeId = req.params.id;
        const now = Date();
        if (!showtimeId) {
            res.status(400).json({ message: 'showtimeId required' })
        }
        //confirm seats
        const confirmBookings = await Booking.find({
            showtime: showtimeId,
            booking_status: "confirmed",
        });
        const confirmSeats = confirmBookings.flatMap((b) => b.seats); //provide all bookings
        //Active locked seats
        const activeLocks = await SeatLock.find({
            showtime: showtimeId,
            status: "Locked",
            expiresAt: { $gt: now },
        });

        const lockedSeats = activeLocks.flatMap(l => l.seats); //l:- lock record, l.seats:- extracts seat array 
        return res.status(200).json({
            showtimeId,
            lockedSeats,
            confirmSeats
        });
    } catch (err) {
        console.error("Error fetching seat status", err);
        res.status(500).json({ message: 'Server error' });
    }
};