const redis = require("../db/redis");

const getToken = async (token) => {
  let client = redis.newClient();
  let session = await client.get(token).then((data) => {
    let session = JSON.parse(data);
    if (!session) {
      return false;
    }
    return session;
  });

  client.quit();
  return session;
};

const newSession = async (token, sessionData) => {
  client = redis.newClient();
  return client
    .set(token, JSON.stringify(sessionData))
    .then((result) => {
      return client.expire(token, 60 * 60 * 30);
    })
    .then((result) => {
      client.quit();
      return result;
    });
};

const logoutSession = async (token) => {
  let didDelete = await redis.del(token);
  redis.quit();
  return didDelete;
};

module.exports = {
  getToken,
  newSession,
  logoutSession,
};
