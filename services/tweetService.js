const tweetModel = require("../models/tweetModel");

async function tweet(session, content) {
  let user = session.id;

  return await tweetModel
    .createTweet(user, content)
    .then((createTweetResult) => {
      if (createTweetResult[0] === false) {
        return [false, createTweetResult[1]];
      }
      let response = {
        response: "Tweet created successfully!",
        tweetInfo: {
          username: session.username,
          content: content,
          date: new Date().toLocaleString(),
        },
      };

      return [true, response];
    });
}

module.exports = {
  tweet,
};
