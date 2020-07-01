const redisClient = require("../db/redis");

const getToken = (token) => {
  return redisClient.get(token).then((data) => {
    let session = JSON.parse(data);
    if (!session) {
      return false;
    }
    return session;
  });
};

const newSession = (token, sessionData) => {
  redisClient.set(token, JSON.stringify(sessionData));
  redisClient.expire(token, 60 * 60 * 30);
};

module.exports = getToken;
