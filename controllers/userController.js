const utils = require("../utils");
const loginService = require("../services/loginService");

function login(req, res) {
  let params = {
    username: utils.nullToString(req.body.username),
    password: utils.nullToString(req.body.password),
  };

  let missingParams = utils.checkParams(params);
  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  loginData = loginService.login(username, password);

  if (loginData === false) {
    res.status(401).send("Access denied, user or password are wrong!");
    return;
  }

  res.status(200).send(loginData);
}

module.exports = login;
