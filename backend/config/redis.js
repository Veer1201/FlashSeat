const redis = require('redis');
const pool = require('./db');
const { getIO } = require('./socket');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

const subscriber = redis.createClient({
    url: process.env.REDIS_URL
})

client.on('error', (err) => console.log("Redis client error, err"));

async function connectRedis() {
    await client.connect();
    await subscriber.connect();

    await client.configSet('notify-keyspace-events', 'Ex')
    await subscriber.subscribe('__keyevent@0__:expired', async (key) => {
        if (!key.startsWith("seat_hold:")) {
            return
        }
        const seatId = key.split(':')[1]
        await pool.query("UPDATE seats SET status = 'available' WHERE seat_id = $1", [seatId])
        getIO().emit('seat:available', {"seatId": seatId, "status": "available"})
        console.log("Released a zombie seat:", {seatId})
    })

    console.log("Redis client connected from config");
    console.log("Redis subscriber client connected from config");
}

module.exports = {client, subscriber, connectRedis};