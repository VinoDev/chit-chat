const socket = io()

const messageForm = document.querySelector('.message-form');
const messageInput = document.querySelector('.message-input');
const messageButton = messageForm.querySelector('button');
const shareLocationButton = document.querySelector('.share-location-button');
const messages = document.querySelector('.messages');

const messageTemplate = document.querySelector('.message-template').innerHTML;
const locationMessageTemplate = document.querySelector('.location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('.sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });

    messages.insertAdjacentHTML('beforeend', html);
})

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    })

    messages.insertAdjacentHTML('beforeend', html);
})

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector("#sidebar").innerHTML = html
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    messageButton.setAttribute("disabled", "disabled");

    socket.emit("sendMessage", messageInput.value, (error) => {

        messageButton.removeAttribute("disabled");
        messageInput.focus();
        messageInput.value = "";

        if (error)
            return console.log(error);

        console.log("Message delivered!");
    });

})

shareLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation)
        return alert("Geolocation is not supported by your browser")

    shareLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sentLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            shareLocationButton.removeAttribute("disabled");

            console.log("Location shared!");
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
})