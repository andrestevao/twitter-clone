const express = require("express");
const router = express.Router();

const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");

router.post("/register", (req, res) => userController.register(req, res));

router.post("/login", (req, res) => userController.login(req, res));

router.post("/logout", (req, res) => userController.logout(req, res));

router.post("/tweet", (req, res) => tweetController.tweet(req, res));

module.exports = router;
