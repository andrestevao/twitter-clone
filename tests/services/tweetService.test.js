const tweetService = require("../../services/tweetService");
const Chance = require("chance");
const chance = new Chance();

let end = new Date();
end.setDate(end.getDate() + 30);

let testSession = {
  username: chance.name().split(" ").join(),
  id: chance.integer({ min: 1, max: 99999 }),
  sessionStart: new Date().toLocaleString(),
  sessionEnd: end.toLocaleString(),
};

let content = "TEST_" + chance.string();

test("should tweet properly", () => {
  return tweetService.tweet(testSession, content).then((result) => {
    expect(result[0]).toEqual(true);
    expect(result[1].response).toEqual("Tweet created successfully!");
    expect(result[1].tweetInfo).toEqual(
      expect.objectContaining({
        username: testSession.username,
        content: content,
      })
    );
  });
});

test("should fail to tweet (empty content)", () => {
  return tweetService.tweet(testSession, null).then((result) => {
    expect(result).toEqual([
      false,
      Error('null value in column "content" violates not-null constraint'),
    ]);
  });
});
