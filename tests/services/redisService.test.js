const redisService = require("../../services/redisService");
const Chance = require("chance");
const chance = new Chance();

let end = new Date();
end.setDate(end.getDate() + 30);

let randomToken = chance.guid();
let session = {
  username: chance.name(),
  id: "-1",
  sessionStart: new Date().toLocaleString(),
  sessionEnd: end.toLocaleString(),
};

//newSession(token,sessionData)
test("should properly create new session", () => {
  return redisService.newSession(randomToken, session).then((result) => {
    expect(result).toBe(1);
  });
});

//getToken(token)
test("should get token created earlier", () => {
  return redisService.getToken(randomToken).then((result) => {
    expect(result.id).toBe("-1");
    expect(result.username).toBe(session.username);
  });
});

//logoutSession(session)
test("should delete created earlier", () => {
  return redisService.logoutSession(randomToken).then((result) => {
    expect(result).toBe(1);
  });
});
