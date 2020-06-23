const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => console.log(req,res))
app.post('/login', (req,res) => {
        let password = req.body.password
        let username = req.body.username

        console.log('User: "'+username+'" trying to log in with password: "'+password+'"')
    })

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
