import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + '/public'));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:5000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets=[];


wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Non";
    console.log("connect ed to browser✅✔");
    socket.on("close", () => console.log("closed"));
    socket.on("message", (message) => {
        const s_message = JSON.parse(message)
        switch (s_message.type) {
            case "b-message":
                sockets.forEach((socket1) => socket1.send(`${socket.nickname} :${s_message.payload}`));
            case "nickname":
                socket["nickname"] = s_message.payload;
        }
        // socket.send(message.toString());
    });
})

server.listen(5000, handleListen);