import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
  transports: ["websocket", "polling"],
});

const rooms = {}; 

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room joining
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    const isNewUser = !rooms[roomId].find(user => user.id === socket.id);
    if (isNewUser) {
      rooms[roomId].push({ id: socket.id, username });
      // Emit a toast event to everyone in the room
      io.to(roomId).emit("userJoinedToast", username);
    }
    io.to(roomId).emit("userJoined", rooms[roomId]);
    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);
  });

  // Handle leaving room
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      io.to(roomId).emit("userJoined", rooms[roomId]);
    }
    console.log(`User left room ${roomId}: ${socket.id}`);
  });

  // Handle code updates
  socket.on("codeUpdate", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  // Handle user typing
  socket.on("userTyping", ({ roomId, username }) => {
    socket.to(roomId).emit("userTyping", username);
  });

  // Handle invitation
  socket.on("inviteUser", ({ invitedUser, roomId, sender }) => {
    const invitedSocket = Object.values(rooms)
      .flat()
      .find((user) => user.username === invitedUser);
  
    if (invitedSocket) {
      io.to(invitedSocket.id).emit("receiveInvite", { roomId, sender });
      console.log(`User ${sender} invited ${invitedUser} to room ${roomId}`);
    }
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      io.to(roomId).emit("userJoined", rooms[roomId]);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { io, app, server };
