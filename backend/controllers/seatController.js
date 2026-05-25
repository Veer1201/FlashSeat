const pool = require('../config/db');
const { client: redisClient } = require('../config/redis');
const { sendError, sendSuccess } = require('../utils/responseHelper');

// 1. The Logic for Booking (The "Zombie" logic goes here)
const bookSeat = async (req, res, next) => {
    try {
        const {seatId} = req.body;
        const userId = req.user.id

        if (!seatId) {
            return sendError(res, 400, "Select a seat before proceeding")
        }

        // The Actual Update Attempt
        const result = await pool.query(
            "UPDATE seats SET status = 'held', user_id = $1 WHERE seat_id = $2 AND status = 'available'", 
            [userId, seatId]
        );

        console.log("------------------------------------------------");

        if (result.rowCount === 1) {
            await redisClient.setEx("seat_hold:" + seatId, 30, userId.toString());
            return sendSuccess(res, 200, {seatId, status: "held"})
        } else {
            const currentSeat = await pool.query("SELECT status from seats WHERE seat_id = $1 ", [seatId]);

            // Seat does not exist
            if (currentSeat.rows.length === 0) {
                return sendError(res, 404, "invalid seat ID")
            }            

            const status = currentSeat.rows[0].status;
            if (status === 'sold') {
                return sendError(res, 409, "Ticket sold already")
            }
            if (status === 'held') {
                const holder = await redisClient.GET("seat_hold:" + seatId);

                // If Data shows held but redis shows null, zombie seat detected
                if (!holder) {
                    console.log("Zombie seat found !!!");

                    await pool.query("UPDATE seats SET user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);

                    // reset timer for new user
                    await redisClient.setEx("seat_hold:" + seatId, 30, userId.toString());
                    return sendSuccess(res, 200, {seatId, status: "available", message: "Recovered from expired hold"})
                }
                return sendError(res, 409, "Currently held by another user")
            }
        }
    } catch (err) {
        next(err)
    }
};

// 2. The Logic for Paying
const payForSeat = async (req, res, next) => {
    try {
        const {seatId} = req.body;
        const userId = req.user.id
        
        if (!seatId) {
            return sendError(res, 400, "Select a seat before proceeding")
        }

        const holder = await redisClient.GET("seat_hold:" + seatId);
        if (!holder || holder !== userId.toString()) {
            return sendError(res, 409, "Reservation Expired")
        }

        const updateSeat = await pool.query("UPDATE seats SET status = 'sold', user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);
        if (updateSeat.rowCount === 0) {
            return sendError(res, 500, "Database Error: seat state mismatch")
        }

        await redisClient.DEL("seat_hold:" + seatId);

        return sendSuccess(res, 200, {User: userId, Seat: seatId, status: "sold", message: "Payment Successful! Ticket is yours"})
    }
    catch (err){
        next(err)
    }
};

module.exports = { bookSeat, payForSeat };