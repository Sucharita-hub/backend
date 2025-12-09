const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Theater = require('../models/Theater');
const SeatLock = require('../models/SeatLock');
const Booking = require('../models/Booking');
const { seatLockQueue } = require('../bullmq/seatLockQueue');

exports.chatbotReply = async (req, res) => {
    try {
        const { message } = req.body;
        const text = message.toLowerCase();

        // Greetings
        if (/(hi|hello|hey)/.test(text)) {
            return res.json({
                reply: "Hello! How can I assist you with movies or ticket bookings?"
            });
        }
        //Asking for movies list
        if (/movies|film|show list/.test(text)) {
            const movies = await Movie.find({}).select("title genre language");
            if (movies.length === 0) {
                return res.json({ reply: "No movies are available right now" });
            }
            const list = movies.map(m => `${m.title} (${m.language})`).join("\n");
            res.json({
                reply: `Here are the movies running now:\n\n${list}\n\nYou can ask: "Showtime for <movie name>"`
            });
        }
        // Showtime for a movie
        if (text.includes("showtime")) {
            const movieName = text.replace("showtime", "").trim();
            const movie = await Movie.findOne({
                title: { $regex: movieName, $options: "i" }
            });
            if (!movie) {
                return res.json({ reply: "I can't find that movie.  please check the spelling." });
            }
            const showtimes = await Showtime.find({ movie: movie._id }).populate("theater", "name city");
            if (showtimes.length === 0) {
                return res.json({ reply: "No showtime available for this movie" });
            }
            const formatted = showtimes.map(s => `${s.startTime} at ${s.theater.name} (${s.theater.city})`).join("\n");
            return res.json({
                reply: `Showtime for *${movie.title}*:\n\n${formatted}\n\nYou can ask: "Seat status for <showtimeId>"`
            });
        }
        // 4.seat availability
        if (/seat|availability/.test(text)) {
            const parts = text.split(" ");
            const showtimeId = parts[parts.length - 1].trim();
            const showtime = await Showtime.findById(showtimeId);
            if (!showtime) {
                return res.json({ reply: "Invalid showtime ID." });
            }
            const confirmed = await Booking.find({
                showtime: showtimeId,
                bookingStatus: "Confirmed"
            });

            const locked = await seatLockQueue.find({
                showtime: showtimeId,
                expiresAt: { $gt: new Date() }
            });
            const confirmedSeats = confirmed.flatMap(b => b.seats);
            const lockedSeats = locked.flatMap(l => l.seats);
            return res.json({
                reply: `Seat Status: \n Available Seats: Many available\n Locked: ${lockedSeats.join(", ") || "None"} \n Booked: ${confirmedSeats.join(", ") || "None"}`
           });
        }
        // How to book tickets
        if (text.includes("how to book") || text.includes("book tickets")) {
            return res.json({
                reply: `Here's how you can book tickets: 
                1.Choose a movie
                2. Select a showtime
                3.Pick your seats
              4.Complete the payment
              5.Get your E-ticket
              Ask me: "Showtime for piku" or "Seats status for <showtimeId>`});
        }
            //6.payment issues
            if (text.includes("payment")) {
                return res.json({
                    reply: "If your payment failed, your seats will be released automatically. \nTry booking again."
                });
            }
            // 7. cancel booking
            if (text.includes("cancel")) {
                return res.json({
                    reply: "To cancel a booking, go to 'My bookoings' and click Cancel.\nRefund depends on cancellation policy."
                });
            }
            //Default feedback
            res.json({
                reply: "Sorry, I didn't understand that .\nTry  asking: \nMovies list\n Showtime for piku\n Seat status <id>\n How to book tickets"
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ reply: "server error in chatbot." });
        }
    };