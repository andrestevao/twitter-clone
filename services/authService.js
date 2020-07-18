const userModel = require("../models/userModel");
const uuid = require("node-uuid");
const redisService = require("./redisService");
const bcrypt = require("bcrypt");

async function login(username, password) {
  let user = await userModel.getUser(username).then((user) => user);

  if (!user) {
    return false;
  }

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

  await redisService.newSession(randomToken, session);

  let dataResponse = {
    ok: true,
    sessionToken: randomToken,
    sessionData: session,
  };

  return dataResponse;
}

async function logout(token) {
  let session = await redisService.getToken(token);
  if (!session) {
    return [false, "Session does not exists."];
  }

  await redisService.logoutSession(token);

  return [true, session.username];
}

async function register(userInfo) {
  let expectedParameters = ["username", "password", "name", "email", "birth"];
  let missing = [];

  expectedParameters.forEach((parameter) => {
    if (!userInfo.hasOwnProperty(parameter)) {
      missing.push(parameter);
    }
  });

  if (missing.length > 0) {
    return [false, "Missing parameters: " + missing.join(", ")];
  }

  let saltRounds = 15;
  let hash = await bcrypt.hashSync(userInfo.password, saltRounds);
  let userInfoClone = Object.create(userInfo);
  userInfoClone.password = hash;
  result = userModel
    .createUser(userInfoClone)
    .then((data) => [true, data])
    .catch((e) => {
      console.log(e.code);
      switch (e.code) {
        //code for duplicate value, constraint 'unique_username' on table 'users'
        case "23505":
          return [false, "User " + userInfo.username + " already exists!"];
      }
    });

  return result;
}

module.exports = {
  login,
  logout,
  register,
};
