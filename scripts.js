let person = prompt("Please enter your name", "");
let socket = io.connect('https://morning-beyond-78477.herokuapp.com/', {query: `name=${person}`})
// let socket = io.connect('http://localhost:5000', {query: `name=${person}`})
socket.emit('join')

socket.on('message', (data) => {
    concatMessage(data)
})

function sendMessage() {
    let textInput = document.getElementById('text-input')
    let message = textInput.value
    socket.emit('message', message)
    message = processMessage(message)
    concatMessage(message)
    textInput.value = ''
}

function processMessage(message) {
    message = `${person}: ${message}`
    return message
}

function concatMessage(message) {
    let textHistory = document.getElementById('text-history')
    let newDiv = document.createElement('div')
    let newContent = document.createTextNode(message)
    newDiv.appendChild(newContent)
    textHistory.appendChild(newDiv)
}

