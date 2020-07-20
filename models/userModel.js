const db = require("../db");

async function getUser(username) {
  let query = "select * from users where username = $1";
  return await db.query(query, [username]).then((data) => {
    if (data.rows[0]) {
      return data.rows[0];
    }

    return false;
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
    .then((data) => [true, data])
    .catch((e) => [false, e]);
}

async function deleteUser(username) {
  let query = "DELETE FROM users WHERE username = $1";

  let result = await db.query(query, [username]);

  return result;
}

module.exports = {
  getUser,
  createUser,
  deleteUser,
};
