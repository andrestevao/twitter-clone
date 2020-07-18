const authService = require("../../services/authService");
const userModel = require("../../models/userModel");

const Chance = require("chance");
const chance = new Chance();

let name = chance.name();
let sampleUserInfo = {
  username: name.split(" ").join("").toLowerCase().substring(0, 14),
  password: chance.string().substring(0, 59),
  name: name,
  email: chance.email(),
  birth: chance.birthday().toLocaleString(),
};

//register(userInfo) -> login -> logout
test("should register sample user properly and use its info to authorize and provide a random token, then, logout with the token provided", async () => {
  //longer time since this is more of an integration test than an unit test
  jest.setTimeout(15000);
  //REGISTER
  let registerUser = await authService.register(sampleUserInfo);
  expect(registerUser[0]).toEqual(true);
  expect(registerUser[1]).toEqual(expect.objectContaining({ rowCount: 1 }));

  //LOGIN
  let dataResponse = await authService.login(
    sampleUserInfo.username,
    sampleUserInfo.password
  );
  //expect to be object with following keys and expect all to be populated
  let expected = ["ok", "sessionToken", "sessionData"];
  expect(Object.keys(dataResponse)).toEqual(expect.arrayContaining(expected));
  let hasNullValue = Object.values(dataResponse).some(
    (value) => value === null
  );
  expect(hasNullValue).toBe(false);

  //expect following values
  expect(dataResponse.ok).toBe(true);
  expect(typeof dataResponse.sessionToken).toBe("string");
  expect(typeof dataResponse.sessionData).toBe("object");

  //expect to be object with following keys and expect all to be populated
  let sessionData = dataResponse.sessionData;
  expected = ["username", "id", "sessionStart", "sessionEnd"];
  expect(Object.keys(sessionData)).toEqual(expect.arrayContaining(expected));
  hasNullValue = Object.values(sessionData).some((value) => value === null);
  expect(hasNullValue).toBe(false);

  //expect following values
  expect(sessionData.username).toBe(sampleUserInfo.username);
  expect(typeof sessionData.id).toBe("number");
  expect(
    Object.prototype.toString.call(new Date(sessionData.sessionStart))
  ).toBe("[object Date]");
  expect(Object.prototype.toString.call(new Date(sessionData.sessionEnd))).toBe(
    "[object Date]"
  );

  //LOGOUT
  let logout = await authService.logout(dataResponse.sessionToken);
  expected = [true, sampleUserInfo.username];
  expect(logout).toEqual(expect.arrayContaining(expected));
});

test("should fail trying to register same user twice", async () => {
  let registerResult = await authService.register(sampleUserInfo);
  let expected = [
    false,
    "User " + sampleUserInfo.username + " already exists!",
  ];
  expect(registerResult).toEqual(expect.arrayContaining(expected));
});

test("should fail trying to register user with empty properties", async () => {
  let brokenUser = Object.create(sampleUserInfo);
  for (property of Object.entries(brokenUser)) {
    brokenUser.property = null;
  }
  let registerResult = await authService.register(brokenUser);
  let expected = [
    false,
    "Missing parameters: username, password, name, email, birth",
  ];
  expect(registerResult).toEqual(expect.arrayContaining(expected));
});

test("should fail properly (failing to find user)", async () => {
  let fakeUsername = chance.string();
  let fakePassword = chance.string();

  let loginResult = await authService.login(fakeUsername, fakePassword);
  expect(loginResult).toEqual(false);
});

test("should fail properly (wrong password)", async () => {
  let fakePassword = chance.string();
  let loginResult = await authService.login(
    sampleUserInfo.username,
    fakePassword
  );
  expect(loginResult).toEqual(false);
});

test("should fail to logout (session doest exists)", async () => {
  let fakeSession = chance.string();

  let logoutResult = await authService.logout(fakeSession);
  let expected = [false, "Session does not exists."];
  expect(logoutResult).toEqual(expect.arrayContaining(expected));
});

test("should fail to logout (wrong parameter)", async () => {
  let fakeParameter = {
    wrongParameter: chance.string(),
  };
});
afterAll(async () => {
  //remove sample user created
  await userModel.deleteUser(sampleUserInfo.username);
});
