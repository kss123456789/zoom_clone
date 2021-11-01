import express from "express";
import http from "http";
import SocketIo from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + '/public'));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:5000`);

const server = http.createServer(app);
const wsServer = SocketIo(server);

function publicRooms() {
    const {
        sockets: {
          adapter: { sids, rooms },
        },
      } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
    
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Non";
    socket.onAny((ev) => {
        console.log(`event: ${ev}`);
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        console.log(socket.rooms);
        done();
        socket.to(roomName).emit("Welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    })
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_m", (msg, roomName, check) => {
        socket.to(roomName).emit("new_m", `${socket.nickname}: ${msg}`);
        check();
    })
    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname;
    })
})

/*
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
*/
server.listen(5000, handleListen);