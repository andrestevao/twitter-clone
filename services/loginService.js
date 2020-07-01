const userModel = require("../models/userModel");
const uuid = require("node-uuid");

function login(username, password) {
  let user = userModel.getUser(username);

  if (!bcrypt.compareSync(password, user.password)) {
    return false;
  }

  let end = new Date();
  end.setDate(end.getDate() + 30);

  let randomToken = uuid.v4();
  let session = {
    username: username,
    id: user.id,
    sessionStart: new Date().toLocaleString(),
    sessionEnd: end.toLocaleString(),
  };

  redisService.newSession(randomToken, session);

  let dataResponse = {
    ok: true,
    sessionToken: randomToken,
    sessionData: session,
  };

  return dataResponse;
}

module.exports = login;
