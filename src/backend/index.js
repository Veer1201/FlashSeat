const express = require('express'); // Imports express library

const { Pool } = require('pg'); // Imports postgresql

const pool = require('./db');

const app = express(); // Instantiate an object named app of type express

const PORT = 3000;

// When a user visits on the page
// req = gets data from user
// res = sends data back to user
app.get('/', (req, res) => {
    res.send('Welcome to FlashSeat API!, Server is running');
});


//an endpoint at localhost://3000/status
app.get('/status', (req, res) => {
    res.json({message: 'System is operational', time: new Date()});
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