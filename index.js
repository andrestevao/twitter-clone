const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const db = require('./db');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => console.log(req,res));
app.post('/register', (req,res) => {
    console.log('Received /register')
    let params = {
        username: nullToString(req.body.username),
        password: nullToString(req.body.password),
        name: nullToString(req.body.name),
        email: nullToString(req.body.email),
        birth: nullToString(req.body.birth)
    };
    
    let paramsMissing = checkParams(params);
    
    if(paramsMissing.length > 0){
        res.status(400).send('Parameters missing: '+paramsMissing.join(", "));
        return;
    }
    
    let saltRounds = 15;
    let hash = bcrypt.hashSync(params.password, saltRounds);
    let query = "INSERT INTO users(id, username, password, name, email, birth) VALUES (nextval('user_id'), $1, $2, $3, $4, $5)"
    let queryParams = [params.username, hash, params.name, params.email, params.birth]
    db.query(query, queryParams)
    .then(() => {
        res.status(201).send('User '+params['username']+' created successfully!');
    })
    .catch(e => {
        let error = e.stack
        if(e.code == "23505"){ //code for duplicate value, constraint 'unique_username' on table 'users'
            error = "User "+params['username']+" already exists!";
            res.status(401).send('Error while creating user: '+error);
            return;
        } 
        res.status(500).send('Error while creating user: '+error);
    })
    
});

app.post('/login', (req,res) => {
    let params = {
        username: nullToString(req.body.username),
        password: nullToString(req.body.password)
    };

    let missingParams = checkParams(params);
    if(missingParams.length > 0){
        res.status(400).send('Parameters missing: '+paramsMissing.join(", "));
        return;
    }

    let query = 'select * from users where username = $1';
    db.query(query, [params.username])
    .then(data => {
        let user = data.rows[0];
        if(!bcrypt.compareSync(params.password, user.password)){
            res.status(401).send('Access denied, user or password are wrong!');
            return
        }

        res.status(200).send('Correct password. Logged in');
        return;

    })
    .catch(e => {
        res.status(500).send('Error while logging in: '+e.stack);
        return;
    })
    
});

const checkParams = (params) => {
    let paramsMissing = [];
    let paramsArray = Object.entries(params);
    
    paramsArray.map((param) => {
        if(param[1].length == 0){
            paramsMissing.push(param[0]);
        }
    });

    return paramsMissing;
}

const nullToString = (value) => {
    if(value == null || typeof(value) != 'string'){
        return "";
    }else{
        return value.trim();
    }
}

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
