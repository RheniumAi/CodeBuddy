import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";
import { viewFriend, getUserProfile } from "../../services/UserApi";
import { io } from "socket.io-client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Ai from "./Ai";

const socket = io("http://localhost:5000");

const Webeditor = () => {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("// start code here");
  const [inputRoomId, setInputRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [username, setUsername] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [invite, setInvite] = useState(null); 

  const openAiPopup = () => setIsAiOpen(true);
  const closeAiPopup = () => setIsAiOpen(false);

  // Fetch user's profile for default username
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUsername(profile.username);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

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

  // Generate or get room ID and join room (once username is loaded)
  useEffect(() => {
    if (!username) return;
    let existingRoomId = localStorage.getItem("roomId");
    if (!existingRoomId) {
      existingRoomId = uuidv4();
      localStorage.setItem("roomId", existingRoomId);
    }
    setRoomId(existingRoomId);
    socket.emit("joinRoom", { roomId: existingRoomId, username });
  }, [username]);

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("userJoinedToast", (joinedUsername) => {
      toast.success(`${joinedUsername} has joined the room`);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    // Set typing state to the username; UI displays "[username] is typing..."
    socket.on("userTyping", (typingUsername) => {
      setTyping(typingUsername);
      setTimeout(() => setTyping(""), 1000);
    });

    socket.on("receiveInvite", ({ roomId: invitedRoomId, sender }) => {
      // Set invite state to display the popup modal
      setInvite({ roomId: invitedRoomId, sender });
    });

    return () => {
      socket.off("userJoined");
      socket.off("userJoinedToast");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("receiveInvite");
    };
  }, [username]);

  // Emit code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", { roomId, code: newCode });
  };

  // Emit user typing event on key press
  const handleEditorKeyDown = () => {
    socket.emit("userTyping", { roomId, username });
  };

  // Emit room join event when joining manually
  const joinRoomById = () => {
    if (inputRoomId) {
      setRoomId(inputRoomId);
      localStorage.setItem("roomId", inputRoomId);
      socket.emit("joinRoom", { roomId: inputRoomId, username });
    }
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Invite friend with username and room info
  const inviteFriend = (friendUsername) => {
    if (!friendUsername) return;
    socket.emit("inviteUser", { invitedUser: friendUsername, roomId, sender: username });
    toast.success(`Invitation sent to ${friendUsername}`);
  };

  // Leave room: emit event, clear room data, and navigate to /profile
  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId });
    localStorage.removeItem("roomId");
    setRoomId("");
    setUsers([]);
    toast.success("You left the room.");
    navigate("/profile");
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Invite Modal */}
      {invite && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{invite.sender} invited you to collaborate!</h3>
            <p className="py-4">Room ID: {invite.roomId}</p>
            <div className="modal-action">
              <button
                onClick={() => {
                  setRoomId(invite.roomId);
                  localStorage.setItem("roomId", invite.roomId);
                  socket.emit("joinRoom", { roomId: invite.roomId, username });
                  toast.success("You joined the room!");
                  setInvite(null);
                }}
                className="btn btn-primary"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  toast.error("Invitation rejected.");
                  setInvite(null);
                }}
                className="btn"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Group for Resizable Layout */}
      <PanelGroup direction="horizontal">
        {/* Left Side: Room Info & Friends */}
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          {/* Drawer for room info and invite friends */}
          <div className="drawer z-50">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
                Room Info
              </label>
            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Room ID */}
                <div className="mb-4 p-2 bg-gray-700 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">Room ID:</h3>
                  <p className="text-sm break-all">{roomId || "Not in a room"}</p>
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
                {/* Leave Room Button */}
                <button
                  className="mt-2 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
                  onClick={leaveRoom}
                >
                  Leave Room
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
                        <button
                          className="bg-blue-600 py-1 px-2 text-sm rounded-lg hover:bg-blue-700"
                          onClick={() => inviteFriend(friend.username)}
                        >
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
          <div className="bg-gray-800 p-4 text-white h-full overflow-y-auto">
            {/* Ask AI */}
            <div className="p-4">
              <button onClick={openAiPopup} className="btn btn-primary">
                Ask AI
              </button>
              {isAiOpen && (
                <dialog className="modal modal-open" onClick={closeAiPopup}>
                  <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex items-center justify-between p-2 bg-[#1F2937] text-white">
              <div className="text-sm">
                {typing ? `${typing} is typing...` : "Ready"}
              </div>
              <div className="flex items-center gap-2">
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
                {/* Leave Room Button in top bar */}
                <button
                  className="bg-red-600 py-1 px-3 text-sm rounded-lg hover:bg-red-700"
                  onClick={leaveRoom}
                >
                  Leave Room
                </button>
              </div>
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
              onKeyDown={handleEditorKeyDown}
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
