const ul = document.querySelector("ul");
const nameForm = document.querySelector("#nick")
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("connected to server✔✅");
});
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    ul.append(li);
});

socket.addEventListener("close", () => {
    console.log("closed");
})

function handleName(ev) {
    ev.preventDefault();
    const input = nameForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));//socket 을 통해 입력값 (nickname)을 서버로 보냄
}

function handleSubmit(ev) {
    ev.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("b-message", input.value));//socket 을 통해 입력값 (채팅 입력내용)을 서버로 보냄
    input.value = "";
}

nameForm.addEventListener("submit", handleName);
messageForm.addEventListener("submit", handleSubmit)