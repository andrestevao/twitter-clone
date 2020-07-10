require("dotenv").config();
const { promisify } = require("util");

const redis = require("redis");
function newClient() {
  let newClient = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  newClient.get = promisify(newClient.get).bind(newClient);
  newClient.set = promisify(newClient.set).bind(newClient);
  newClient.del = promisify(newClient.del).bind(newClient);
  newClient.ttl = promisify(newClient.ttl).bind(newClient);
  newClient.expire = promisify(newClient.expire).bind(newClient);
  newClient.quit = promisify(newClient.quit).bind(newClient);

  return newClient;
}

module.exports = {
  newClient: newClient,
};
