const utils = require("../utils");
const loginService = require("../services/loginService");

async function login(req, res) {
  let params = {
    username: utils.nullToString(req.body.username),
    password: utils.nullToString(req.body.password),
  };

  let missingParams = utils.checkParams(params);
  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  loginData = await loginService.login(params.username, params.password);

  if (loginData === false) {
    res.status(401).send("Access denied, user or password are wrong!");
    return;
  }

  res.status(200).send(loginData);
}

function logout(req, res) {
  let params = {
    sessionToken: utils.nullToString(req.body.sessionToken),
  };

  let missingParams = utils.checkParams(params);

  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  loginService.logout(params.sessionToken).then((logoutData) => {
    if (logoutData[0] !== true) {
      res.status(500).send("Error while logging out: " + logoutData[1]);
      return;
    }

    res.status(200).send("Succesfully logged out user: " + logoutData[1]);
  });
}

module.exports = {
  login,
  logout,
};
