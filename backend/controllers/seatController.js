const pool = require('../config/db');
const { client: redisClient } = require('../config/redis');
const { AppError } = require('../utils/AppError');
const { sendSuccess } = require('../utils/responseHelper');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { getIO } = require('../config/socket');

// 1. The Logic for Booking (The "Zombie" logic goes here)
const bookSeat = async (req, res, next) => {
    try {
        const {seatId} = req.body;
        const userId = req.user.id

        if (!seatId) {
            return next(new AppError("Select a seat before proceeding", 400))
        }

        // The Actual Update Attempt
        const result = await pool.query(
            "UPDATE seats SET status = 'held', user_id = $1 WHERE seat_id = $2 AND status = 'available'", 
            [userId, seatId]
        );

        console.log("------------------------------------------------");

        if (result.rowCount === 1) {
            await redisClient.setEx("seat_hold:" + seatId, 300, userId.toString());
            getIO().emit('seat:held', {"seatId": seatId, "status": "held" })
            return sendSuccess(res, 200, {seatId, status: "held"})
        } else {
            const currentSeat = await pool.query("SELECT status from seats WHERE seat_id = $1 ", [seatId]);

            // Seat does not exist
            if (currentSeat.rows.length === 0) {
                return next(new AppError("Invalid seat ID", 404))
            }            

            const status = currentSeat.rows[0].status;
            if (status === 'sold') {
                return next(new AppError("Ticket sold already", 409))
            }
            if (status === 'held') {
                const holder = await redisClient.GET("seat_hold:" + seatId);

                // If Data shows held but redis shows null, zombie seat detected
                if (!holder) {
                    console.log("Zombie seat found !!!");

                    await pool.query("UPDATE seats SET user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);

                    // reset timer for new user
                    await redisClient.setEx("seat_hold:" + seatId, 300, userId.toString());
                    return sendSuccess(res, 200, {seatId, status: "available", message: "Recovered from expired hold"})
                }
                return next(new AppError("Currently held by another user", 409))
            }
        }
    } catch (err) {
        next(err)
    }
};

// 2. The Logic for Paying
const payForSeat = async (req, res, next) => {
    try {
        const {seatId, paymentIntentId} = req.body;
        const userId = req.user.id
        
        if (!seatId) {
            return next(new AppError("Select a seat before proceeding", 400))
        }

        const holder = await redisClient.GET("seat_hold:" + seatId);
        if (!holder || holder !== userId.toString()) {
            return next(new AppError("Reservation Expired", 409))
        }
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        if (paymentIntent.status === "succeeded") {
            const updateSeat = await pool.query("UPDATE seats SET status = 'sold', user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);
            if (updateSeat.rowCount === 0) {
                return next(new AppError("Database Error: seat state mismatch", 500))
            }
        }
        else {
            return next(new AppError("Payment Failed", 401))
        }

        await redisClient.DEL("seat_hold:" + seatId);
        getIO().emit('seat:sold', {"seatId": seatId, "status": "sold" })
        return sendSuccess(res, 200, {User: userId, Seat: seatId, status: "sold", message: "Payment Successful! Ticket is yours"})
    }
    catch (err){
        next(err)
    }
};

const createPaymentIntent = async (req, res, next) => {
    try {
        const {seatId} = req.body

        if (!seatId) {
            return next(new AppError("Invalid seatId", 400))
        }
        const price = await pool.query("SELECT price FROM seats WHERE seat_id = $1", [seatId])

        if (price.rows.length === 0) {
            return next(new AppError("Seat not found", 404))
        }
        const price_in_cents = (price.rows[0].price) * 100

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price_in_cents,
            currency: 'cad',
            automatic_payment_methods: {enabled: true,
                allow_redirects: 'never'
            }
        })

        sendSuccess(res, 200, {clientSecret: paymentIntent.client_secret})
    } catch (err) {
        next(err)
    }
    
}

module.exports = { bookSeat, payForSeat, createPaymentIntent };