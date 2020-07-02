const express = require("express");
const router = express.Router();
const utils = require("../utils");
const db = require("../db");
const bcrypt = require("bcrypt");

const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");

router.post("/register", (req, res) => {
  console.log("Received /register");
  let params = {
    username: utils.nullToString(req.body.username),
    password: utils.nullToString(req.body.password),
    name: utils.nullToString(req.body.name),
    email: utils.nullToString(req.body.email),
    birth: utils.nullToString(req.body.birth),
  };

  let paramsMissing = utils.checkParams(params);

  if (paramsMissing.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  let saltRounds = 15;
  let hash = bcrypt.hashSync(params.password, saltRounds);
  let query =
    "INSERT INTO users(id, username, password, name, email, birth) VALUES (nextval('user_id'), $1, $2, $3, $4, $5)";
  let queryParams = [
    params.username,
    hash,
    params.name,
    params.email,
    params.birth,
  ];
  db.query(query, queryParams)
    .then(() => {
      res
        .status(201)
        .send("User " + params["username"] + " created successfully!");
    })
    .catch((e) => {
      let error = e.stack;
      //code for duplicate value, constraint 'unique_username' on table 'users'
      if (e.code == "23505") {
        error = "User " + params["username"] + " already exists!";
        res.status(401).send("Error while creating user: " + error);
        return;
      }
      res.status(500).send("Error while creating user: " + error);
    });
});

router.post("/login", (req, res) => userController.login(req, res));

router.post("/logout", (req, res) => userController.logout(req, res));

router.post("/tweet", (req, res) => tweetController.tweet(req, res));

module.exports = router;
