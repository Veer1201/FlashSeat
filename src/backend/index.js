const express = require('express'); // Imports express library
const { createClient } = require('redis');

const app = express(); // Instantiate an object named app of type express
app.use(express.json()); //intercepts every request and 
//checks if it containd JSON data and them parses into new JavaScript object req.body

const redisClient = createClient();

// 2. Handle Errors (This MUST be before connect)
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// 3. Connect (Async)
(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis successfully!");
    } catch (err) {
        console.error("❌ Redis Connection Error:", err);
    }
})();

const { Pool } = require('pg'); // Imports postgresql

const pool = require('./db');

const PORT = 3000;

// When a user visits on the page
// req = gets data from user
// res = sends data back to user
app.get('/', (req, res) => {
    res.send('Welcome to FlashSeat API!, Server is running');
});


//an GET endpoint at localhost://3000/status
app.get('/status', (req, res) => {
    res.json({message: 'System is operational', time: new Date()});
})

app.post('/register', async (req, res) => {
    try {
        const {email, phone_number, password_hash} = req.body;
        const newEntry = await pool.query(
            "INSERT INTO flashseat_data (email, phone, pass_hash) VALUES ($1, $2, $3) RETURNING *",
            [email, phone_number, password_hash]
        );

        res.json(newEntry.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//GET Endpoint for displaying seats to user
// :id - express extracts the id variable(denoted by :) to check for which event you want to display seats
app.get('/events/:id/seats', async(req, res) => {
    try {
        const eventId = req.params.id;  //Express extracts the id variable into req object
        const result = await pool.query(
            "SELECT * FROM seats WHERE event_id = $1 ORDER BY(row_number, seat_number)", [eventId]
        );
        res.json(result.rows);  //send back the user list of seats as arrays
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

//POST Endpoint to book the seats
app.post('/seats/book', async (req, res) => {
    try {
        const { seatId, userId } = req.body;

        // DEBUG 1: Did the inputs arrive?
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
            res.status(200).send("OK");
        } else {
            res.status(409).send("Seat not available");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Testing the connection with Database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Error connecting to Database: ", err);
    }
    else {
        console.log('Connection to Database established successfully! Time is:', res.rows[0].now);
    }
});

//server listening at port 3000
app.listen(PORT, () => {
    console.log('Server is running on http://localhost: ${PORT}'); 
});