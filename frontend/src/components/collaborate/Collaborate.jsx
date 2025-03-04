import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";
import { viewFriend } from "../../services/UserApi";
import { io } from "socket.io-client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Messaging from "./Messaging";
import {toast} from "react-hot-toast"

import Ai from "./Ai";

const socket = io("http://localhost:5000"); 

const Webeditor = () => {
  const [friends, setFriends] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("// start code here");
  const [inputRoomId, setInputRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [language, setlanguage] = useState("javascript");

  const [isAiOpen, setIsAiOpen] = useState(false);

  const openAiPopup = () => setIsAiOpen(true);
  const closeAiPopup = () => setIsAiOpen(false);

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
      if (users.length > 0) {
        const newUser = users[users.length - 1]; 
      }
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

  // Language change
  const handleLanguageChange = (e) => {
    setlanguage(e.target.value);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Panel Group for Resizable Layout */}
      <PanelGroup direction="horizontal">
        
        {/* Left Side: Room ID & Friends */}
        <Panel defaultSize={25} minSize={15} maxSize={40}>

          {/* Drawer for room info and invite friends*/}
          <div className="drawer z-50 ">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content ">
              {/* Page content here */}
              <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Room Info</label>
            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Room ID */}
                <div className="mb-4 p-2 bg-gray-700 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">Room ID:</h3>
                  <p className="text-sm break-all">{roomId}</p>
                </div>
                {/* Join Room */}
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
                        <button className="bg-blue-600 py-1 px-2 text-sm rounded-lg hover:bg-blue-700">
                          Invite
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No friends available</p>
                  )}
                </div>
              </ul>
            </div>
          </div>

          {/* Messaging */}

          <div className="bg-gray-800 p-4 text-white h-full overflow-y-auto">  
            {/* Ask AI */}
            <div className="p-4">
              <button onClick={openAiPopup} className="btn btn-primary">
                Ask AI
              </button>
  
              {isAiOpen && (
                <dialog className="modal modal-open" onClick={closeAiPopup}>
                  <div
                    className="modal-box"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={closeAiPopup}
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </button>
                    <Ai code={code} />
                  </div>
                </dialog>
              )}
            </div>
          </div>
        </Panel>
  
        {/* Resizable Handle */}
        <PanelResizeHandle className="w-1 bg-gray-700 cursor-col-resize" />
  
        {/* Right Side: Code Editor */}
        <Panel defaultSize={75} minSize={60}>
          <div className="flex flex-col h-full bg-transparent">
            <div className="flex items-center justify-between p-2 bg-#1F2937 text-white">
              <div className="text-sm">{typing ? `Typing: ${typing}` : "Ready"}</div>
              
              <select
                className="select select-bordered bg-gray-800 text-white text-sm"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>

            {/* Code Editor */}
            <Editor
              height="100%"
              width="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              language={language}
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
              }}
            />
          </div>
        </Panel>

      </PanelGroup>
    </div>
  );
};

export default Webeditor;
