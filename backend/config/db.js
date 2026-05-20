const {Pool} = require('pg'); // Imports the node postgres library

// {Pool} destructures the pg library as we needed the specific tool named Pool 
//When a request comes in, a taxi (connection) takes the job, finishes it, 
//  and returns to the stand to wait for the next passenger

const pool = new Pool({
    user: 'veer',
    host: 'localhost',
    database: 'flashseat',
    password: '',
    port: 5432 // default radio frequency that PostgreSQL listens on
});

module.exports = pool;  // When other files ask for this file (using require), give them this pool object we just created.