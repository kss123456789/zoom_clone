const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(ev) {
    ev.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_m", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
}

function handleNameSubmit(ev) {
    ev.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgform = room.querySelector("#msg");
    const nameform = room.querySelector("#name");
    msgform.addEventListener("submit", handleMessageSubmit);
    nameform.addEventListener("submit", handleNameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;

    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("Welcome", (user, count) => {
    addMessage(`${user} joined`);
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${count})`;
})

socket.on("bye", (user, count) => {
    addMessage(`${user} left`);
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${count})`;
})
socket.on("new_m", (msg) => {
    addMessage(msg);
})
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});