const pool = require('../config/db');
const { client: redisClient } = require('../config/redis');

// 1. The Logic for Booking (The "Zombie" logic goes here)
const bookSeat = async (req, res) => {
    try {
        const {seatId} = req.body;
        const userId = req.user.id

        console.log("------------------------------------------------");
        console.log("1. Incoming Request Body:", req.body); 
        console.log(`2. Inputs detected -> Seat: ${seatId}, User: ${userId}`);

        // DEBUG 2: What is the ACTUAL status in the database right now?
        const check = await pool.query("SELECT * FROM seats WHERE seat_id = $1", [seatId]);
        
        if (check.rows.length === 0) {
            console.log("3. CRITICAL: Seat ID does not exist in DB!");
        } else {
            console.log("3. Database Status:", check.rows[0].status);
            console.log("4. Database Owner:", check.rows[0].user_id);
        }

        // The Actual Update Attempt
        const result = await pool.query(
            "UPDATE seats SET status = 'held', user_id = $1 WHERE seat_id = $2 AND status = 'available'", 
            [userId, seatId]
        );

        console.log("5. Rows Updated:", result.rowCount);
        console.log("------------------------------------------------");

        if (result.rowCount === 1) {
            await redisClient.setEx("seat_hold:" + seatId, 30, userId.toString());
            return res.status(200).send("OK");
        } else {
            const currentSeat = await pool.query("SELECT status from seats WHERE seat_id = $1 ", [seatId]);

            // Seat does not exist
            if (currentSeat.rows.length === 0) {
                return res.status(404).send("invalid seat ID");
            }            

            const status = currentSeat.rows[0].status;
            if (status === 'sold') {
                return res.status(409).send("Ticket is sold already");
            }
            if (status === 'held') {
                const holder = await redisClient.GET("seat_hold:" + seatId);

                // If Data shows held but redis shows null, zombie seat detected
                if (!holder) {
                    console.log("Zombie seat found !!!");

                    await pool.query("UPDATE seats SET user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);

                    // reset timer for new user
                    await redisClient.setEx("seat_hold:" + seatId, 30, userId.toString());

                    return res.status(200).send("Recovered from expired hold");
                }
            }
            else {
                res.status(409).send("Currently held by another user");
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// 2. The Logic for Paying
const payForSeat = async (req, res) => {
    try {
        const {seatId} = req.body;
        const userId = req.user.id
        const holder = await redisClient.GET("seat_hold:" + seatId);
        if (!holder || holder !== userId.toString()) {
            return res.status(409).send("Reservation Expired");
        }

        const updateSeat = await pool.query("UPDATE seats SET status = 'sold', user_id = $1 WHERE seat_id = $2 AND status = 'held'", [userId, seatId]);
        if (updateSeat.rowCount === 0) {
            return res.status(500).send("Database Error: seat state mismatch");
        }

        await redisClient.DEL("seat_hold:" + seatId);
        console.log(`Seat ${seatId} successfully sold to User ${userId}`);
        res.status(200).send("Payment Successful! Ticket is yours");
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

module.exports = { bookSeat, payForSeat };