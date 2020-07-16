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

//logout(token)

afterAll(async () => {
  //remove sample user created
  await userModel.deleteUser(sampleUserInfo.username);
});
