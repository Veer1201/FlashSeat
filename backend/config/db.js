const {Pool} = require('pg'); // Imports the node postgres library

// {Pool} destructures the pg library as we needed the specific tool named Pool 
//When a request comes in, a taxi (connection) takes the job, finishes it, 
//  and returns to the stand to wait for the next passenger

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT // default radio frequency that PostgreSQL listens on
});

module.exports = pool;  // When other files ask for this file (using require), give them this pool object we just created.