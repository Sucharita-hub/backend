const mongoose = require('mongoose');
const Showtime = require("../models/Showtime");

const seatLockMiddleware = async (req, res, next) => {
    try {
        const { ShowtimeId, selectedSeats } = req.body;
        const userId = req.user._id;

        if (!ShowtimeId || !selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ message: "showtime ID and seats are required" });
        }
   // 1. Reads the showtimeid and selectedSeats from request body
        const showtime = await Showtime.findbyId(ShowtimeId);
        if (!showtime) {
            return res.status(404).json({ message: "showtime not found" });
        }
        // 2. remove expired locks automatically before checking
        const now = new Date();
        showtime.lockedSeats = showtime.lockedSeats.filter(
            lock => lock.expiresAt > now);
        // 3. checks if any selected seats are already booked
        const alreadybooked = showtime.bookedSeats.filter((seat) =>
            selectedSeats.includes(seat.seatId)
        );
        if (alreadybooked.length > 0) {
            return res.status(409).json({ message: "some seats are already booked", seats: alreadybooked });
        }
        // 4. checks if any seats are currently locked(not expired)
        const alreadyLocked = showtime.lockedSeats.filter((lock) =>
            selectedSeats.includes(lock.seatId)
        );
        if (alreadyLocked.length > 0) {
            return res.status(409).json({ message: "some seats are already locked", seats: alreadyLocked });
        }
      // 5. locks the selected seats for the logged-in user for 10 min

        const newLocks = selectedSeats.map((seatId) => ({
            seatId,
            user: userId,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }));

        showtime.lockedSeats.push(...newLocks);
        await showtime.save();
    // 6. save locks in showtime.lockedSeats array and moves to next handler
        req.lockedSeats = newLocks;
        next();
    } catch (err) {
        console.error("Seat lock middleware error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = seatLockMiddleware;