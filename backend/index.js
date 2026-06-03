require('dotenv').config()

const express = require('express'); // Imports express library
const app = express(); // Instantiate an object named app of type express
const pool = require('./config/db');
const seatRoutes = require('./routes/seatRoutes');
const userRoutes = require('./routes/userRoutes');
const errorRoute = require('./middleware/errorHandler')
const helmet = require('helmet')
const cors = require('cors')

app.use(express.json()); //intercepts every request and 
//checks if it containd JSON data and them parses into new JavaScript object req.body

app.use(cors({
    origin: ['http://localhost:5173', 'https://flash-seat.vercel.app'],
    credentials: true
  }))

const {client: redisClient, connectRedis} = require('./config/redis');
const { sendSuccess } = require('./utils/responseHelper');
connectRedis();

const PORT = 3000;

app.use(helmet())

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

//GET Endpoint for displaying seats to user
// :id - express extracts the id variable(denoted by :) to check for which event you want to display seats
app.get('/events/:id/seats', async(req, res, next) => {
    try {
        const eventId = req.params.id;  //Express extracts the id variable into req object
        const result = await pool.query(
            "SELECT * FROM seats WHERE event_id = $1 ORDER BY(row_number, seat_number)", [eventId]
        );
        return sendSuccess(res, 200, result.rows)
    }
    catch (err) {
        next(err)
    }
})

app.get('/events/:id/seats', async(req, res, next) => {
    try {
        const eventId = req.params.id
        const result = await pool.query("SELECT * FROM seats WHERE event_id = $1 ORDER BY(row_number, seat_number)", [eventId])
        return sendSuccess(res, 200, result.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/events', async (req, res, next) => {
    try {
      const result = await pool.query("SELECT * FROM events ORDER BY id");
      return sendSuccess(res, 200, result.rows)
    } catch (err) {
      next(err)
    }
  })
  

app.get('/events/:id', async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const result = await pool.query("SELECT * FROM events WHERE id = $1", [eventId]);
      if (result.rows.length === 0) {
        return next(new AppError("Event not found", 404))
      }
      return sendSuccess(res, 200, result.rows[0])
    } catch (err) {
      next(err)
    }
  })
  

// Import the routes


// Tell Express to use them
// This means any URL starting with /seats will go to seatRoutes

app.use('/seats', seatRoutes);
app.use('/user', userRoutes);
app.use(errorRoute)

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
    console.log(`Server is running on http://localhost: ${PORT}`); 
});