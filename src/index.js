const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {

    socket.on("join", ({ username, room }, callback) => {

        const { user, error } = addUser({ id: socket.id, username, room })
        
        if (error) {
            return callback(error);
        }

        socket.join(user.room)
        socket.emit("message", generateMessage("admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", generateMessage("admin", `${user.username} has joined!`));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        console.log(`${user.username} joined to room ${user.room}`);
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter();

        if (filter.isProfane(message))
            return callback("Profanity is not allowed");
        
        io.to(user.room).emit("message", generateMessage(user.username, message));

        console.log(`[${user.room}] ${user.username}: ${message}`);
        callback()
    })

    socket.on("sentLocation", (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", generateMessage("admin", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
            console.log(`${user.username} left room ${user.room}`);
        }
    })
})



server.listen(port, () => {
    console.log("Server is running on port " + port);
})