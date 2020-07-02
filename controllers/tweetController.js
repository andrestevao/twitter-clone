const redisService = require("../services/redisService");
const tweetService = require("../services/tweetService");
const utils = require("../utils");

async function tweet(req, res) {
  let params = {
    sessionToken: utils.nullToString(req.body.sessionToken),
    content: utils.nullToString(req.body.content),
  };

  let missingParams = utils.checkParams(params);

  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  let session = await redisService.getToken(params.sessionToken);

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

  let tweetInfo = await tweetService.tweet(session, params.content);

  if (tweetInfo[0] === true) {
    res.status(200).send(tweetInfo[1]);
    return;
  }

  res.status(500).send(tweetInfo[1]);
}

module.exports = {
  tweet,
};
