const db = require("../db");

async function getUser(username) {
  let query = "select * from users where username = $1";
  return await db
    .query(query, [username])
    .then((data) => {
      return data.rows[0];
    })
    .catch((e) => e);
}

module.exports = {
  getUser,
};
