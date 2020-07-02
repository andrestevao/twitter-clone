const tweetModel = require("../models/tweetModel");

async function tweet(session, content) {
  let user = session.id;

  return await tweetModel
    .createTweet(user, content)
    .then((tweetInfo) => {
      if (tweetInfo[0] === true) {
        let response = {
          response: "Tweet created successfully!",
          tweetInfo: {
            username: session.username,
            content: content,
            date: new Date().toLocaleString(),
          },
        };

        return [true, response];
      }
    })
    .catch((e) => [false, e.stack]);
}

module.exports = {
  tweet,
};
