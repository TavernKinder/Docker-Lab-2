import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public"));
const HTTPserver = http.createServer(app);
const io = new Server(HTTPserver);

let users = {};

io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);

  socket.on("tryToVerifyUser", (username) => {
    if (users[username]) {
      socket.emit("verifyUser", false);
    } else {
      users[username] = socket.id;
      socket.emit("usernameSet", username);
      socket.emit("verifyUser", true);
      socket.emit("message", `Welcome ${username}!`);
      socket.broadcast.emit(
        "message",
        `${username} has joined the chat. everybody welcome them!`,
      );
    }
  });

  socket.on("clientMessage", (msg) => {
    console.log(`message from ${socket.id}: ${msg}`);
    let outputMsg = "";
    for (let username in users) {
      if (users[username] === socket.id) {
        outputMsg = {
          username: username,
          message: msg,
        };
        break;
      }
    }
    socket.broadcast.emit("message", outputMsg);
  });

  socket.on("disconnect", () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        console.log(
          "a user disconnected: " + socket.id + " (" + username + ")",
        );
        delete users[username];
        socket.broadcast.emit("message", `${username} has left the chat.`);
        break;
      }
    }
  });
});

HTTPserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
