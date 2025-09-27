// server.js
import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

const roomCounts = new Map();

io.on("connection", (socket) => {
  let room = "global";
  let name = "Guest";

  const broadcastOnline = () => {
    const n = roomCounts.get(room) || 0;
    io.to(room).emit("online", n);
  };

  socket.on("join", ({ room: r, name: nm }) => {
    room = r || "global";
    name = nm || "Guest";
    socket.join(room);
    roomCounts.set(room, (roomCounts.get(room) || 0) + 1);
    broadcastOnline();
  });

  socket.on("setName", ({ name: nm }) => { name = nm || name; });
  socket.on("typing", ({ room: r }) => io.to(r || room).emit("typing", { name }));

  socket.on("message", (msg) => {
    socket.to(msg.room || room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    roomCounts.set(room, Math.max(0, (roomCounts.get(room) || 1) - 1));
    broadcastOnline();
  });
});

server.listen(3001, "0.0.0.0", () => console.log("Socket.IO on :3001"));
