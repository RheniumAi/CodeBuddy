import { Server } from "socket.io";
import http from "http";
import express from "express";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";  

const app = express();
const server = http.createServer(app);

// WebSocket server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Store Yjs Docs for each room
const rooms = {};  // { roomId: ydoc }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    if (!rooms[roomId]) {
      rooms[roomId] = new Y.Doc();
    }

    // Create a WebSocket provider for Yjs collaboration
    const provider = new WebsocketProvider(
      "ws://localhost:5000/ws/",
      roomId,
      rooms[roomId]
    );

    provider.awareness.setLocalStateField("user", {
      userId: socket.id,
      name: `User ${socket.id}`,
    });

    socket.emit("connected", { status: "connected" });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected from room: ${roomId}`);
      provider.destroy();
    });
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});


export { io, app, server };
