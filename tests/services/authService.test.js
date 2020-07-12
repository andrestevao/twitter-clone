const authService = require("../../services/authService");
const userModel = require("../../models/userModel");

const Chance = require("chance");
const chance = new Chance();

let name = chance.name();
let sampleUserInfo = {
    username: name.split(" ").join("").toLowerCase(),
    password: chance.string(),
    name: name,
    email: chance.email(),
    birth: chance.birthday().toLocaleString(),
};

//register(userInfo)
test("should register sample user properly", async () => {
    let registerUser = await authService.register(sampleUserInfo);
    expect(registerUser[0]).toEqual(true);
    expect(registerUser[1]).toEqual(expect.objectContaining({rowCount: 1}));
});

//login(username, password)

//logout(token)

afterAll(async () => {
    //remove sample user created
    await userModel.deleteUser(sampleUserInfo.username);
});
