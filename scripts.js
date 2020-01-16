// let person = prompt("Please enter your name", "");
let socket = io.connect('https://morning-beyond-78477.herokuapp.com/')
// let socket = io.connect('http://localhost:5000')
document.getElementById('text-input').disabled = true
// let socket = io.connect('http://localhost:5000', {query: `name=Derick`})
// socket.emit('join')

let username

// retrieve the list of current users for the user-container
socket.on('current-users', (data) => {
    for (s in data) {
        console.log(s)
        userJoined(s)
    }
})

// when receiving a message request will add the message
// to text history
socket.on('message', (msg) => {
    concatMessage(msg)
})

// when receiving a join or leave request will update user-container
socket.on('join', (name) => {
    userJoined(name)
})
socket.on('leave', (name) => {
    userLeave(name)
})

function userJoined(name) {
    let users = document.getElementById('users')
    let button = document.createElement('button')
    button.innerHTML = name
    button.setAttribute('class', 'user')
    button.setAttribute('id', name)
    users.appendChild(button)
}

function userLeave(name) {
    document.getElementById(name).remove()
}


function sendMessage() {
    let textInput = document.getElementById('text-input')
    let message = textInput.value
    socket.emit('message', message)
    message = processMessage(message)
    concatMessage(message)
    textInput.value = ''
}

function processMessage(message) {
    message = `${username}: ${message}`
    return message
}

function concatMessage(message) {
    let textHistory = document.getElementById('text-history')
    let newDiv = document.createElement('div')
    let newContent = document.createTextNode(message)
    newDiv.appendChild(newContent)
    textHistory.appendChild(newDiv)
}

function login() {
    username = document.getElementById('username-input').value
    document.getElementById('username').innerHTML = username
    document.getElementById('text-input').disabled = false
    socket.emit('login', username)
    // every 25 seconds client will ping the server
    // due to deployment on heroku if inactive for 30 seconds
    // server will believe the client has d/c even if it hasn't
    const requestLoop = setInterval(() => {
        socket.emit('checking-connection')
    }, 25000)
}

