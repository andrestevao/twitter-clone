const authService = require('../../services/authService');
const userModel = require('../../models/userModel');

const express = require('express');
const request = require('supertest');
const router = express.Router();
const bodyParser = require("body-parser");
const tweetController = require('../../controllers/tweetController');
const Chance = require('chance');
const chance = new Chance;

router.post("/tweet", (req, res) => tweetController.tweet(req, res));
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

let testUserInfo = [];

//create sample user, log into the system with it and get the session token
beforeAll(async () => {
    let name = chance.name();
    let sampleUser = {
        username: name.split(" ").join("").toLowerCase(),
        password: chance.string(),
        name: name,
        email: chance.email(),
        birth: chance.birthday().toLocaleString(),
    };

    let userCreated = await authService.register(sampleUser);
    if(userCreated[0] !== true && userCreated[1] !== { rowCount: 1}){
        throw new Error("failed to create sample user");
    }

    testUserInfo.push(sampleUser);

    let sessionCreated = await authService.login(
        sampleUser.username,
        sampleUser.password
    );

    if(sessionCreated.ok !== true){
        throw new Error("failed login with sample user");
    };

    testUserInfo.push(sessionCreated);
});

test("should properly return that the tweet was created", () => {

    let sendData = {
        sessionToken: testUserInfo[1].sessionToken, 
        content: chance.string(), 
    };

    return request(app)
        .post('/api/tweet')
        .send(sendData)
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.response).toBe("Tweet created successfully!");
            expect(response.body.tweetInfo.content).toBe(sendData.content);
            expect(response.body.tweetInfo.username).toBe(testUserInfo[0].username);
        });
});

//delete the user and the session created in beforeAll() above
afterAll(async () => {

    let sessionDeleted = await authService.logout(testUserInfo[1].sessionToken);
    if(sessionDeleted[0] !== true){
        throw new Error("failed to delete session: "+sessionToken);
    }

    await userModel.deleteUser(testUserInfo[0].username);
});
