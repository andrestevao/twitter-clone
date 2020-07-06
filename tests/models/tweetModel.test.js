const tweetModel = require("../../models/tweetModel");
const db = require("../../db");

test("should create tweet properly", async () => {
  let createTweet = await tweetModel.createTweet(-1, "test tweet");
  expect(createTweet[0]).toBe(true);

  db.query(
    "SELECT author, content, active FROM tweets WHERE author=-1",
    []
  ).then((data) => {
    expect(data.rows[0]).toEqual(
      expect.objectContaining({
        author: -1,
        content: "test tweet",
        active: true,
      })
    );
  });
});

afterAll(async () => {
  await db.query("DELETE FROM tweets WHERE author=-1", []);
  await db.end();
});
