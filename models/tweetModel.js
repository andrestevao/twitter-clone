const db = require("../db");

function createTweet(userId, content, response_to = null) {
  let query =
    "INSERT INTO tweets(author,response_to,content) VALUES ($1, $2, $3)";

  return db
    .query(query, [userId, response_to, content])
    .then((data) => [true, data])
    .catch((e) => [false, e]);
}

module.exports = {
  createTweet,
};
