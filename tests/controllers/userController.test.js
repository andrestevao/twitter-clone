const userController = require('../../controllers/userController');
const userModel = require('../../models/userModel');

const express = require('express');
const request = require('supertest');
const router = express.Router();
const bodyParser = require("body-parser");
const Chance = require('chance');
const chance = new Chance;

//setup express server
router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/logout", (req, res) => userController.logout(req, res));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

//login, logout, register
let name = chance.name();
let paramsSampleUser = {
    username: name.split(" ").join("").toLowerCase(),
    password: chance.string(),
    name: name,
    email: chance.email(),
    birth: chance.birthday().toLocaleString(),
};

test("should properly return register status, log in with registered user and logout after", async () => {
    await request(app)
        .post('/api/register')
        .send(paramsSampleUser)
        .then(response => {
            expect(response.statusCode).toBe(201);
            expect(response.text).toBe('User '+paramsSampleUser.username+' created successfully!');
        });

    let token = null;
    await request(app)
        .post('/api/login')
        .send({username: paramsSampleUser.username, password: paramsSampleUser.password})
        .then(response => {
            expect(response.statusCode).toBe(200);
            let data = JSON.parse(response.text);
            expect(data.ok).toBe(true);
            expect(typeof data.sessionToken).toBe('string');
            token = data.sessionToken;
            expect(data.sessionData.username).toBe(paramsSampleUser.username);
        });

    await request(app)
        .post('/api/logout')
        .send({sessionToken: token})
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBe("Succesfully logged out user: " + paramsSampleUser.username);
        });
    
});

test("should fail to logout (missing parameters)", () => {
    return request(app)
        .post('/api/logout')
        .send({})
        .then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Parameters missing: sessionToken");
        });

});

test("should fail to login (missing parameters)", () => {
    return request(app)
        .post('/api/login')
        .send({
            name: chance.name()
        })
        .then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Parameters missing: username, password");
        });
});

test("should fail to login (wrong username or password)", () => {
    return request(app)
        .post('/api/login')
        .send({
            username: chance.name(),
            password: chance.name()
        })
        .then(response => {
            expect(response.statusCode).toBe(401);
            expect(response.text).toBe("Access denied, user or password are wrong!");
        });
});
test("should fail to register (missing parameters)", () => {
    return request(app)
        .post('/api/register')
        .send({
            name: chance.name()
        })
        .then(response => {
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Parameters missing: username, password, email, birth");
        });
});

test("should fail to register (username too long)", () => {
    let usernameTooLong = Object.create(paramsSampleUser);
    usernameTooLong.username = chance.string({length: 100});
    return request(app)
        .post('/api/register')
        .send(usernameTooLong)
        .then(response => {
            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Username too long!');
        });
});

afterAll(async () => {
    await userModel.deleteUser(paramsSampleUser.username);
});
