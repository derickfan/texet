let socket = io.connect('https://morning-beyond-78477.herokuapp.com/')
// let socket = io.connect('http://localhost:5000')
document.getElementById('global-input').disabled = true

let username
let activeChat

// retrieve the list of current users for the user-container
socket.on('current-users', (users) => {
    for (index in users) {
        userJoined(users[index])
    }
})

// when receiving a message request will add the message
// to text history
socket.on('message', (messageObj) => {
    console.log(messageObj)
    if(messageObj['recipient'] === 'global') {
        concatMessage(messageObj, messageObj['recipient'])
    } else {
        newMessageWindow(messageObj['name'])
        concatMessage(messageObj, messageObj['name'])
    }
})

// when receiving a join or leave request will update user-container
socket.on('join', (name) => {
    userJoined(name)
})
socket.on('leave', (name) => {
    userLeave(name)
})

function newMessageWindow(name) {
    let chatbox = document.getElementById(`${name}-chatbox`)
    if (chatbox === null) {
        let chatboxNav = document.getElementById('chatbox-nav')
        let button = document.createElement('button')
        button.setAttribute('onclick', `switchMessageWindow('${name}')`)
        button.innerHTML = name
        chatboxNav.appendChild(button)
        
        chatbox = document.createElement('div')
        chatbox.setAttribute('class', 'chatbox')
        chatbox.setAttribute('id', `${name}-chatbox`)
        
        let textHistory = document.createElement('div')
        textHistory.setAttribute('class', 'message-container')
        textHistory.setAttribute('id', `${name}-history`)
        chatbox.appendChild(textHistory)
    
        let inputContainer = document.createElement('div')
        chatbox.appendChild(inputContainer)
    
        let textInput = document.createElement('input')
        textInput.setAttribute('type', 'text')
        textInput.setAttribute('id', `${name}-input`)
        textInput.setAttribute('class', 'text-input')
        textInput.setAttribute('onchange', 'sendMessage()')
        textInput.setAttribute('autocomplete', 'off')
        inputContainer.appendChild(textInput)
        
        document.getElementById('chatbox-container').appendChild(chatbox)
        chatbox.style.display = 'none'
    }
    return chatbox
}

function switchMessageWindow(name) {
    hideActiveChatbox()
    activeChat = name
    let chatbox = newMessageWindow(name)
    chatbox.style.display = 'flex'
}

function hideActiveChatbox() {
    let chatbox = document.getElementById(`${activeChat}-chatbox`)
    chatbox.style.display = 'none'
}

function userJoined(name) {
    let users = document.getElementById('users')
    let button = document.createElement('button')
    button.innerHTML = name
    button.setAttribute('class', 'user')
    button.setAttribute('id', name)
    button.setAttribute('onclick', `switchMessageWindow(\'${name}\')`)
    users.appendChild(button)
}

function sayHello() {
    console.log('Hello')
}

function userLeave(name) {
    document.getElementById(name).remove()
}


function sendMessage() {
    let messageObj = {}
    messageObj['name'] = username
    messageObj['message'] = document.getElementById(`${activeChat}-input`).value
    messageObj['recipient'] = activeChat
    socket.emit('message', messageObj)

    concatMessage(messageObj, activeChat)
    document.getElementById(`${activeChat}-input`).value = ''
}

function concatMessage(messageObj, chatbox) {
    let textHistory = document.getElementById(`${chatbox}-history`)
    let newDiv = document.createElement('div')
    let newContent = document.createTextNode(`${messageObj['name']}: ${messageObj['message']}`)
    newDiv.appendChild(newContent)
    textHistory.appendChild(newDiv)
}

function login() {
    username = document.getElementById('username-input').value
    document.getElementById('username').innerHTML = username
    document.getElementById('global-input').disabled = false
    socket.emit('login', username)
    activeChat = 'global'
    // every 25 seconds client will ping the server
    // due to deployment on heroku if inactive for 30 seconds
    // server will believe the client has d/c even if it hasn't
    const requestLoop = setInterval(() => {
        socket.emit('checking-connection')
    }, 25000)
}

