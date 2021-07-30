const express = require('express')
const route = express.Router();
const access_token = require('../app/access_token')

route.get('/', (req, res) => {
    res.send("Hello World")
})

route.get('/access_token', access_token)

module.exports = route;