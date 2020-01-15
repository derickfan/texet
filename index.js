const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 8080
const http = require('http').Server(app)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/scripts.js'))
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/style.css'))
})

const server = http.listen(port, function() {
    console.log(`listening on *: ${port}`);
});