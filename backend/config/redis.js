const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log("Redis client error, err"));

async function connectRedis() {
    await client.connect();
    console.log("Redis client connected from config");
}

module.exports = {client, connectRedis};