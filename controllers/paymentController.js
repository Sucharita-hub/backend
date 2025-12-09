const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const SeatLock = require("../models/SeatLock");
//const { default: orders } = require("razorpay/dist/types/orders");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// create razorpay order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "rcpt_" + Date.now(),
        });
        return res.json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID
        });
        
    } catch (err) {
        console.log("Order error", err);
        res.status(500).json({ message: "Failed to create an order" });
        
    }
};
exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId, orderId, signature, lockId, amount } = req.body;
        const body = orderId + "|" + paymentId;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature !== signature) {
            return res.status(400).json({ message: "payment signature mismatch" });
        }
        if (new Date() > lock.expiresAt) {
            return res.status(410).json({ message: "Seat lock expired" });
        }
        //create booking
        const booking = await Booking.create({
            user: lock.user,
            movie: lock.movie,
            showtime: lock.showtime,
            seats: lock.seats,
            totalAmount: amount,
            paymentId,
            paymentStatus: "success",
            bookingStatus: "confirmed"
        });
        await SeatLock.deleteMany({ _id: lockId });
        return res.json({
            message: "Payment successful & booking confirmed",
            bookingId: booking._id,
            booking
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Verification failed" });
    }
};