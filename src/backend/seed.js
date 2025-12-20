const pool = require('./db'); //Tells JS it require database library

const seed = async () => {
    try {
        console.log("Cleaning from seats");
        await pool.query("DELETE FROM seats");  // Query to delete rows from seats table
        console.log("Cleaning from events");
        await pool.query("DELETE FROM events"); // Query to delete rows from events table
        console.log("Tables cleaned");
        
        // Query to insert an event details to events table and returns event id
        const newEntry = await pool.query("INSERT INTO events (name, date, venue) VALUES ($1, $2, $3) RETURNING id", ['The Eras Tour', '2025-12-31 19:00:00', 'Vancouver']);
        const newId = newEntry.rows[0].id;

        // Query to create 50 tickets/seats for the event, uses event_id of the event as reference 
        for (let i = 1; i <= 50; i++) {
            const seatEntry = await pool.query("INSERT INTO seats (event_id, row_number, seat_number, price) VALUES ($1, $2, $3, $4) RETURNING *", [newId, 'A', i, 100.00]);
        }
        console.log("Seeding complete");
        process.exit();
    
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();