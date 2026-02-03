const redis = require('redis');
const client = redis.createClient({
    url: 'redis://localhost:6379'
});

client.on('error', (err) => console.log("Redis client error, err"));

async function connectRedis() {
    await client.connect();
    console.log("Redis client connected from config");
}

module.exports = {client, connectRedis};