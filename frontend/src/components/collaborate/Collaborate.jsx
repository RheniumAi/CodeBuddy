import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";
import { viewFriend } from "../../services/UserApi";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); 

const Webeditor = () => {
  const [friends, setFriends] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("// start code here");
  const [inputRoomId, setInputRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");

  // Fetch friends on mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await viewFriend();
        setFriends(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  // Generate or get room ID
  useEffect(() => {
    let existingRoomId = localStorage.getItem("roomId");
    if (!existingRoomId) {
      existingRoomId = uuidv4();
      localStorage.setItem("roomId", existingRoomId);
    }
    setRoomId(existingRoomId);
    socket.emit("joinRoom", { roomId: existingRoomId });
  }, []);

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (username) => {
      setTyping(`${username} is typing...`);
      setTimeout(() => setTyping(""), 1000);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
    };
  }, []);

  // Emit code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", { roomId, code: newCode });
  };

  // Emit room join event when joining manually
  const joinRoomById = () => {
    if (inputRoomId) {
      setRoomId(inputRoomId);
      localStorage.setItem("roomId", inputRoomId);
      socket.emit("joinRoom", { roomId: inputRoomId });
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Side: Room ID & Friends */}
      <div className="w-1/4 bg-gray-800 p-4 text-white overflow-y-auto">
        {/* Room ID */}
        <div className="mb-4 p-2 bg-gray-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Room ID:</h3>
          <p className="text-sm break-all">{roomId}</p>
        </div>

        {/* Join Room */}
        <div className="mb-4 p-2 bg-gray-700 rounded-lg text-center">
          <input
            type="text"
            className="w-full p-2 bg-gray-600 rounded-lg text-white"
            placeholder="Enter Room ID"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
          />
          <button
            className="mt-2 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
            onClick={joinRoomById}
          >
            Join Room
          </button>
        </div>

        {/* Invite Friends */}
        <h2 className="text-xl font-semibold mb-4">Invite Friends</h2>
        <div className="space-y-2">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex justify-between items-center p-2 bg-gray-700 rounded-lg"
              >
                <span>{friend.username}</span>
                <button
                  className="bg-blue-600 py-1 px-2 text-sm rounded-lg hover:bg-blue-700"
                >
                  Invite
                </button>
              </div>
            ))
          ) : (
            <p>No friends available</p>
          )}
        </div>
      </div>

      {/* Right Side: Code Editor */}
      <div className="w-3/4 bg-black">
        <Editor
          height="100vh"
          width="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
          }}
        />
        {typing && <div className="text-white p-2">{typing}</div>}
      </div>
    </div>
  );
};

export default Webeditor;
