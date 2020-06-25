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
        username: req.body.username.trim(),
        password: req.body.password.trim(),
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        birth: req.body.birth.trim()
    };
    
    let paramsMissing = [];
    let paramsArray = Object.entries(params);
    
    paramsArray.map((param) => {
        if(param[1].length == 0){
            paramsMissing.push(param[0]);
        }
    });
    
    if(paramsMissing.length > 0){
        res.status(400).send('Parameters missing: '+paramsMissing.join(", "));
        return;
    }
    
    let saltRounds = 15;
    let hash = bcrypt.hashSync(params.password, saltRounds);
    let query = 'INSERT INTO users(username, password, name, email, birth) VALUES ($1, $2, $3, $4, $5)'
    let queryParams = [params.username, hash, params.name, params.email, params.birth]
    db.query(query, queryParams)
    .then(() => {
        res.status(201).send('User '+params['username']+' created successfully!');
    })
    .catch(e => {
        res.status(500).send('Error while creating user: '+e.stack);
    })
    
    
    
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
