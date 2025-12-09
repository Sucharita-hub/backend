const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const SeatLock = require('../models/SeatLock');
//const Movie = require('../models/Movie');
//const { seatLockQueue } = require('../bullmq/seatLockQueue');

exports.confirmBooking = async (req, res) => {
    try {
        const { lockId, amount, paymentInfo } = req.body;
        const userId = req.user._id;

        if (!lockId) {
            return res.status(400).json({ message: "lockId is required " });
        }

        //fetch lock details
        const lock = await SeatLock.findById(lockId).populate("showtime");
        if (!lock) {
            return res.status(404).json({ message: "seat lock not found" });
        }

        //check if lock expired
        if (new Date() > lock.expiresAt) {
            return res.status(410).json({ message: "Seat lock expired" });
        }
        //Required data from lock
        const showtimeId = lock.showtime._id;
        const movieId = lock.showtime.movie;
        const seats = lock.seats;
        //check if seats are already booked
        const alreadyBooked = await Booking.findOne({
            showtime: showtimeId, 
            seats: { $in: seats },
        });
        if (alreadyBooked) {
            return res.status(409).json({ message: "seats are already booked", seats: alreadyBooked.seats });
        }
 
        // Mock payment
        const paymentSuccessful = paymentInfo?.mock === "ok" || paymentInfo?.status === "success";
        if (!paymentSuccessful) {
            lock.status = "Failed";
            await lock.save();
            return res.status(402).json({ message: "Payment failed" });
        }
            // create booking
            const booking = await Booking.create({
                user: userId,
                showtime: showtimeId,
                movie: movieId,
                seats,
                totalAmount: amount,
                paymentStatus: "Success",
                bookingStatus: "Confirmed"
            });
            //Release lock
            lock.status = "Released";
            await lock.save();

            return res.status(201).json({
                message: "Booking successful!",
                bookingId: booking._id,
                booking,
            });
        } catch (err) {
            console.error("Error confirming bookind:", err);
            res.status(500).json({ message: "Server error" });
        }
};

//Get booking deatils
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("showtime").populate("user", "name email");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

//user bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("showtime");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};