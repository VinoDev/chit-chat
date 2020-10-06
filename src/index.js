const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log("New WebSocket connection");
    socket.emit("message", "Welcome to the chat app, this is a test message!");

    socket.on("msgFromClient", (message) => {
        console.log(message);
        io.emit("message", message);
    })
})



server.listen(port, () => {
    console.log("Server is running on port " + port);
})