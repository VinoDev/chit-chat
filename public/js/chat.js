const socket = io()

const msgForm = document.querySelector('.msg-form');
const msgInput = document.querySelector('.msg-input');
const msgBtn = msgForm.querySelector('button');
const shareLocationBtn = document.querySelector('.share-location-btn');

socket.on("message", (message) => {
    console.log(message);
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    msgBtn.setAttribute("disabled", "disabled");

    socket.emit("sendMessage", msgInput.value, (error) => {

        msgBtn.removeAttribute("disabled");
        msgInput.focus();
        msgInput.value = "";

        if (error)
            return console.log(error);

        console.log("Message delivered!");
    });

})

shareLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation)
        return alert("Geolocation is not supported by your browser")

    shareLocationBtn.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sentLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            shareLocationBtn.removeAttribute("disabled");

            console.log("Location shared!");
        })
    })
})