const db = require("../db");

async function getUser(username) {
  let query = "select * from users where username = $1";
  return await db.query(query, [username]).then((data) => {
    return data.rows[0];
  });
}

function createUser(userInfo) {
  let query =
    "INSERT INTO users(id, username, password, name, email, birth) VALUES (nextval('user_id'), $1, $2, $3, $4, $5)";
  let queryParams = [
    userInfo.username,
    userInfo.password,
    userInfo.name,
    userInfo.email,
    userInfo.birth,
  ];

  return db
    .query(query, queryParams)
    .then((data) => data)
    .catch((e) => Promise.reject(e));
}

async function deleteUser(username) {
  let query = "DELETE FROM users WHERE username = $1";

  return await db
    .query(query, [username])
    .then((data) => data)
    .catch((e) => Promise.reject(e));
}

module.exports = {
  getUser,
  createUser,
  deleteUser,
};
