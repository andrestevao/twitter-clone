function getUser(username) {
  let query = "select * from users where username = $1";
  return db
    .query(query, [params.username])
    .then((data) => {
      return data.rows[0];
    })
    .catch((e) => e);
}
