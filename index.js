const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const db = require("./db");
const redisClient = require("./redis");
const bcrypt = require("bcrypt");
const uuid = require("node-uuid");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => console.log(req, res));
app.post("/register", (req, res) => {
  console.log("Received /register");
  let params = {
    username: nullToString(req.body.username),
    password: nullToString(req.body.password),
    name: nullToString(req.body.name),
    email: nullToString(req.body.email),
    birth: nullToString(req.body.birth),
  };

  let paramsMissing = checkParams(params);

  if (paramsMissing.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  let saltRounds = 15;
  let hash = bcrypt.hashSync(params.password, saltRounds);
  let query =
    "INSERT INTO users(id, username, password, name, email, birth) VALUES (nextval('user_id'), $1, $2, $3, $4, $5)";
  let queryParams = [
    params.username,
    hash,
    params.name,
    params.email,
    params.birth,
  ];
  db.query(query, queryParams)
    .then(() => {
      res
        .status(201)
        .send("User " + params["username"] + " created successfully!");
    })
    .catch((e) => {
      let error = e.stack;
      //code for duplicate value, constraint 'unique_username' on table 'users'
      if (e.code == "23505") {
        error = "User " + params["username"] + " already exists!";
        res.status(401).send("Error while creating user: " + error);
        return;
      }
      res.status(500).send("Error while creating user: " + error);
    });
});

app.post("/login", (req, res) => {
  let params = {
    username: nullToString(req.body.username),
    password: nullToString(req.body.password),
  };

  let missingParams = checkParams(params);
  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  let query = "select * from users where username = $1";
  db.query(query, [params.username])
    .then((data) => {
      let user = data.rows[0];
      if (!bcrypt.compareSync(params.password, user.password)) {
        res.status(401).send("Access denied, user or password are wrong!");
        return;
      }

      let end = new Date();
      end.setDate(end.getDate() + 30);

      let randomToken = uuid.v4();
      let session = {
        username: params.username,
        id: user.id,
        sessionStart: new Date().toLocaleString(),
        sessionEnd: end.toLocaleString(),
      };

      redisClient.set(randomToken, JSON.stringify(session));
      redisClient.expire(randomToken, 60 * 60 * 30); //30 days

      let dataResponse = {
        ok: true,
        sessionToken: randomToken,
        sessionData: session,
      };
      res.status(200).send(JSON.stringify(dataResponse));
      return;
    })
    .catch((e) => {
      res.status(500).send("Error while logging in: " + e.stack);
      return;
    });
});

app.post("/logout", (req, res) => {
  let params = {
    sessionToken: nullToString(req.body.sessionToken),
  };

  let missingParams = checkParams(params);

  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  getToken(params.sessionToken)
    .then((session) => {
      if (!session) {
        res.status(401).send("Session does not exists!");
        return;
      }

      return redisClient.del(params.sessionToken);
    })
    .then((response) => {
      if (response != 1) {
        res.status(500).send("Error while logging session out");
        return;
      }

      res
        .status(200)
        .send("User " + session.username + " logged out succesfully!");
      return;
    })
    .catch((e) => {
      res.status(500).send("Error while logging session out: " + e);
      return;
    });
});

app.post("/tweet", (req, res) => {
  let params = {
    sessionToken: nullToString(req.body.sessionToken),
    content: nullToString(req.body.content),
  };

  let missingParams = checkParams(params);

  if (missingParams.length > 0) {
    res.status(400).send("Parameters missing: " + paramsMissing.join(", "));
    return;
  }

  getToken(params.sessionToken)
    .then((session) => {
      if (!session) {
        res
          .status(401)
          .send(
            'Token not valid: "' +
              params.sessionToken +
              '". Please log in to get a new token.'
          );
        return;
      }

      return session;
    })
    .then((session) => {
      let query = "INSERT INTO tweets(author, content) VALUES($1, $2)";
      let queryParams = [session.id, params.content];

      return [db.query(query, queryParams), session];
    })
    .then((result) => {
      let response = {
        response: "Tweet created successfully!",
        tweetInfo: {
          username: result[1].username,
          content: params.content,
          date: new Date().toLocaleString(),
        },
      };

      res.status(201).send(response);
    })
    .catch((e) => {
      res.status(500).send("Error while creating tweet: " + e);
    });
});

const checkParams = (params) => {
  let paramsMissing = [];
  let paramsArray = Object.entries(params);

  paramsArray.map((param) => {
    if (param[1].length == 0) {
      paramsMissing.push(param[0]);
    }
  });

  return paramsMissing;
};

const nullToString = (value) => {
  if (value == null || typeof value != "string") {
    return "";
  } else {
    return value.trim();
  }
};

const getToken = (token) => {
  return redisClient.get(token).then((data) => {
    let session = JSON.parse(data);
    if (!session) {
      return false;
    }
    return session;
  });
};

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
