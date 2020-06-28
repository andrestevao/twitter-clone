require('dotenv').config()
const { promisify } = require("util");

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
    get: promisify(client.get).bind(client),
    del: promisify(client.del).bind(client),
    del: promisify(client.del).bind(client),
    set: promisify(client.set).bind(client),
    expire: promisify(client.expire).bind(client),
}