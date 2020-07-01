const redisService = require("../services/redisService");
const utils = require("../utils");

function tweet(req, res) {
  let params = {
    sessionToken: utils.nullToString(req.body.sessionToken),
    content: utils.nullToString(req.body.content),
  };

  let missingParams = utils.checkParams(params);

  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  redisService
    .getToken(params.sessionToken)
    .then((session) => {
      if (!session) {
        res
          .status(401)
          .send(
            'Token not valid: "' +
              params.sessionToken +
              '". Please log in to get a new token.'
          );
        return;
      }

      return session;
    })
    .then((session) => {
      let query = "INSERT INTO tweets(author, content) VALUES($1, $2)";
      let queryParams = [session.id, params.content];

      return [db.query(query, queryParams), session];
    })
    .then((result) => {
      let response = {
        response: "Tweet created successfully!",
        tweetInfo: {
          username: result[1].username,
          content: params.content,
          date: new Date().toLocaleString(),
        },
      };

      res.status(201).send(response);
    })
    .catch((e) => {
      res.status(500).send("Error while creating tweet: " + e);
    });
}

module.exports = tweet;
