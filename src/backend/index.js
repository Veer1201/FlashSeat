const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to FlashSeat API!, Server is running');
});

app.get('/status', (req, res) => {
    res.json({message: 'System is operational', time: new Date()});
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost: ${PORT}'); 
});