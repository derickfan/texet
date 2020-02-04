// let socket = io.connect('https://morning-beyond-78477.herokuapp.com/')
let socket = io.connect('http://localhost:5000')
document.getElementById('text-input').disabled = true


// retrieve the list of current users for the user-container
socket.on('current-users', (users) => {
    for (index in users) {
        userJoined(users[index]);
    }
})

// when receiving a join or leave request will update user-container
socket.on('join', (name) => {
    userJoined(name)
})
socket.on('leave', (name) => {
    userLeave(name)
})

function userJoined(name) {
    let users = document.getElementById('user-container')
    let button = document.createElement('button')
    button.innerHTML = name
    button.setAttribute('class', 'user-button')
    button.setAttribute('id', name)
    button.setAttribute('onclick', `switchMessageWindow(\'${name}\')`)
    users.appendChild(button)
}

function attemptLogin(){
    socket.emit('login', document.getElementById('username-input').value)
}


socket.on('login', () => {
    login()
})

socket.on('name-taken', () => {
    let error = document.getElementById('name-error')
    if(error == undefined) {
        let element = document.getElementById('info-container')
        let error = document.createElement('p')
        error.innerHTML = 'Name already exists'
        error.setAttribute('id', 'name-error')
        error.setAttribute('style', 'color:red')
        element.appendChild(error)
    } 
})

function login() {
    username = document.getElementById('username-input').value
    document.getElementById('info-container').innerHTML = username
    document.getElementById('text-input').disabled = false
    activeChat = 'Global'
    // every 25 seconds client will ping the server
    // due to deployment on heroku if inactive for 30 seconds
    // server will believe the client has d/c even if it hasn't
    const requestLoop = setInterval(() => {
        socket.emit('checking-connection')
    }, 25000)
}

function switchMessageWindow(name) {
    hideActiveChatbox()
    activeChat = name
    let history = newMessageWindow(name)
    history.style.display = 'flex'
}

function hideActiveChatbox() {
    let history = document.getElementById(`${activeChat}-history`)
    history.style.display = 'none'
}

function newMessageWindow(name) {
    let history = document.getElementById(`${name}-history`)
    // console.log(history)
    if (history === null) {
        // adds a tab in the nav
        let chatboxNav = document.getElementById('chatbox-nav')
        let button = document.createElement('button')
        button.setAttribute('class', 'chat-button');
        button.setAttribute('onclick', `switchMessageWindow('${name}')`)
        let value = document.createElement('p')
        value.innerHTML = name
        button.innerHTML = value.outerHTML
        chatboxNav.appendChild(button)
        
        history = document.createElement('div')
        history.setAttribute('class', 'text-history')
        history.setAttribute('id', `${name}-history`)
        
        history.style.display = 'none'
        document.getElementById('chatbox').appendChild(history)
    }
    return history
}

let textarea = document.getElementById('text-input');
textarea.addEventListener('keyup', (e) => {
    if(e.keyCode === 13 && !e.shiftKey) {
        sendMessage()    
    }
});

function sendMessage() {
    let messageObj = {}
    messageObj['name'] = username
    messageObj['message'] = document.getElementById('text-input').value
    messageObj['recipient'] = activeChat
    socket.emit('message', messageObj)

    concatMessage(messageObj, activeChat)
    textarea.value = ''
}

function concatMessage(messageObj, chatbox) {
    let textHistory = document.getElementById(`${chatbox}-history`)
    let message = document.createElement('div')
    if(name === username) {
        message.setAttribute('class', 'message user-message')
        message.innerHTML = textarea.value
    } else {
        message.setAttribute('class', 'message')
        message.innerHTML = `${messageObj[name]}: ${messageObj[message]}`
    }   
    
    textHistory.appendChild(message)
}