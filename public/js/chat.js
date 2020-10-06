const socket = io()

const msgForm = document.querySelector('.msg-form');
const msgInput = document.querySelector('.msg-input');

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    socket.emit("msgFromClient", msgInput.value);

    msgInput.value = "";
})

socket.on("message", (message) => {
    console.log(message);
})