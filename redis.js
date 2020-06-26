require('dotenv').config()

const redis = require("redis");
const client = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

client.on('connect', () => {
    console.log('[Redis] Client connected!');
});

client.on('error', (err) => {
    console.log('[Redis] Something went wrong: '+err);
});

module.exports = {
    redisClient: client
}