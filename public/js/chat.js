const socket = io()

const msgForm = document.querySelector('.msg-form');
const msgInput = document.querySelector('.msg-input');
const shareLocationBtn = document.querySelector('.share-location-btn');

socket.on("message", (message) => {
    console.log(message);
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    socket.emit("message", msgInput.value);

    msgInput.value = "";
})

shareLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation)
        return alert("Geolocation is not supported by your browser")

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sentLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})