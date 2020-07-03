const userModel = require("../models/userModel");
const uuid = require("node-uuid");
const redisService = require("./redisService");
const bcrypt = require("bcrypt");

async function login(username, password) {
  let user = await userModel.getUser(username).then((user) => {
    if (!bcrypt.compareSync(password, user.password)) {
      return false;
    }

    return user;
  });

  if (user === false) {
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

function logout(token) {
  return redisService
    .getToken(token)
    .then((session) => {
      if (!session) {
        return Promise.reject(["Session doesn't exists"]);
      }
      return session;
    })
    .then(async (session) => {
      let user = session.username;
      let data = await redisService.logoutSession(token);
      if (data > 0) {
        return [true, user];
      }
    })
    .catch((e) => [false, e]);
}

async function register(userInfo) {
  let saltRounds = 15;
  let hash = await bcrypt.hashSync(userInfo.password, saltRounds);
  userInfo.password = hash;
  return userModel
    .createUser(userInfo)
    .then((data) => [true, data])
    .catch((e) => {
      switch (e.code) {
        //code for duplicate value, constraint 'unique_username' on table 'users'
        case "23505":
          return [false, "User " + userInfo.username + " already exists!"];
        default:
          return [false, e.stack];
      }
    });
}

module.exports = {
  login,
  logout,
  register,
};
