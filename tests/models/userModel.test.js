const userModel = require("../../models/userModel");
const Chance = require("chance");
const chance = new Chance();
const db = require("../../db");

userInfo = {
  username: chance.string({ length: 15 }),
  password: chance.string(),
  name: chance.name(),
  email: chance.email(),
  birth: chance.birthday({ string: true }).replace(/\//g, "-"),
};

messedUpUserInfo = {
  username: null, //null username
  password: chance.string(),
  name: chance.name(),
  email: chance.email(),
  birth: chance.birthday({ string: true }).replace(/\//g, "-"),
};
test("should create user properly", async () => {
  await userModel.createUser(userInfo).then((result) => {
    expect(result.rowCount).toBe(1);
  });

  return db
    .query("SELECT name,username,email FROM users WHERE username=$1", [
      userInfo.username,
    ])
    .then((data) => {
      expect(data.rows[0]).toEqual(
        expect.objectContaining({
          name: userInfo.name,
          username: userInfo.username,
          email: userInfo.email,
        })
      );
    });
});

test("should fail creating user", () => {
  result = userModel.createUser(messedUpUserInfo).catch((error) => {
    expect(error).toEqual(
      Error('null value in column "username" violates not-null constraint')
    );
  });
});

test("should get user create before properly", () => {
  return userModel.getUser(userInfo.username).then((result) => {
    expect(result).toEqual(
      expect.objectContaining({
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
      })
    );
  });
});

test("should fail getting user", () => {
  return userModel.getUser(chance.string({ length: 15 })).catch((result) => {
    expect(result).toEqual(false);
  });
});

afterAll(async () => {
  await db.query("DELETE FROM users WHERE username=$1", [userInfo.username]);
  await db.end();
});
