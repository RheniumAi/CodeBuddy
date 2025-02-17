import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Backend socket server URL

// Connect socket with userId (Replace with actual user ID from auth)
export const connectSocket = (userId) => {
    if (!userId) return null; 

    const socket = io(SOCKET_SERVER_URL, {
        query: { userId },  // Send userId for mapping
        withCredentials: true,
    });

    // Handle connection success
    socket.on("connect", () => {
        console.log("Connected to socket server:", socket.id);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
    });

    return socket;
};
