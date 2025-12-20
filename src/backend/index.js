const express = require('express'); // Imports express library

const { Pool } = require('pg'); // Imports postgresql

const pool = require('./db');

const app = express(); // Instantiate an object named app of type express

const PORT = 3000;

app.use(express.json()); //intercepts every request and 
            //checks if it containd JSON data and them parses into new JavaScript object req.body

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