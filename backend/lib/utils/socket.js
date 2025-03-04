import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const rooms = {}; 

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room joining
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);

    // Add user to the room
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push({ id: socket.id, username });

    // Notify others in the room
    io.to(roomId).emit("userJoined", username);
    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);
  });

  // Handle code updates
  socket.on("codeUpdate", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  // Handle user typing
  socket.on("userTyping", ({ roomId, username }) => {
    socket.to(roomId).emit("userTyping", username);
  });

  

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      io.to(roomId).emit("userJoined", rooms[roomId]);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { io, app, server };
