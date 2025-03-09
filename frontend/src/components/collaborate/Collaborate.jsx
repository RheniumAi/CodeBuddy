import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";
import { viewFriend, getUserProfile } from "../../services/UserApi";
import { io } from "socket.io-client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Ai from "./Ai";
import { ClipboardCopyIcon } from "lucide-react";


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
  const [showText, setShowText] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const openAiPopup = () => setIsAiOpen(true);
  const closeAiPopup = () => setIsAiOpen(false);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setShowText(false);
    }, 4000);

    return () => clearTimeout(timer); 
  }, []);
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

   
    socket.on("userTyping", (typingUsername) => {
      setTyping(typingUsername);
      setTimeout(() => setTyping(""), 1000);
    });

    socket.on("receiveInvite", ({ roomId: invitedRoomId, sender }) => {
      
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
      <Panel defaultSize={25} minSize={20} maxSize={35} className="bg-gray-900">
        <div className="h-full flex flex-col border-r border-gray-700">
          {/* Room Header */}
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Collaborate</h2>
              <button
                onClick={leaveRoom}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2 transition-colors"
              >
                <span></span> Leave
              </button>
            </div>
          </div>
  
          {/* Room Details */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Room ID Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Room ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm font-mono text-blue-400 break-all">
                    {roomId || "Not connected"}
                  </p>
                </div>
                {roomId && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(roomId);
                      toast.success("Copied to clipboard!");
                    }}
                    className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    <ClipboardCopyIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Room ID"
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value)}
                />
                <button
                  onClick={joinRoomById}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-md transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
  
            {/* Participants */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">Participants ({users.length})</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center px-3 py-2 bg-gray-800 rounded-md">
                    <span className="text-sm text-gray-200">{user.username}</span>
                    {user.id === socket.id && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 rounded-full">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
  
            {/* Friends List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Friends List</h3>
              </div>
              <div className="space-y-2">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex items-center justify-between px-3 py-2 bg-gray-800 hover:bg-gray-750 rounded-md transition-colors"
                    >
                      <span className="text-sm text-gray-200">{friend.username}</span>
                      <button
                        onClick={() => inviteFriend(friend.username)}
                        className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        Invite
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No friends available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Panel>
  
      {/* Resizable Handle */}
      <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-500 transition-colors cursor-col-resize" />
  
      {/* Right Side: Code Editor */}
      <Panel defaultSize={75} minSize={65}>
        <div className="h-full flex flex-col bg-gray-900">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {typing ? `✍️ ${typing} is typing...` : "🟢 Connected"}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                className="select select-bordered w-full max-w-xs bg-base-100 text-base-content"
                value={language}
                onChange={handleLanguageChange}
              >
                <option disabled value="">Select Language</option>
                <option className="text-base-content" value="javascript">JavaScript</option>
                <option className="text-base-content" value="python">Python</option>
                <option className="text-base-content" value="html">HTML</option>
                <option className="text-base-content" value="css">CSS</option>
                <option className="text-base-content" value="cpp">C++</option>
                <option className="text-base-content" value="java">Java</option>
                <option className="text-base-content" value="typescript">TypeScript</option>
              </select>
            </div>
          </div>
  
          {/* Code Editor with Floating AI Button */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              width="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleEditorKeyDown}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
            
            {/* Floating AI Assist Button */}
            <button
      onClick={openAiPopup}
      onMouseEnter={() => setIsHovered(true)}  
      onMouseLeave={() => setIsHovered(false)} 
      className="absolute bottom-6 right-6 p-4 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 group z-10"
      title="AI Assist"
    >
      {/* Icon */}
      <svg
        className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>

      
      {(showText || isHovered) && (
        <span className="text-sm font-semibold text-white animate-blink">
          Ask AI
        </span>
      )}
    </button>


          </div>
        </div>
      </Panel>
    </PanelGroup>
  
    {/* AI Modal */}
    {isAiOpen && <Ai code={code} isAiOpen={isAiOpen} closeAiPopup={closeAiPopup} />}
  </div>
  );
};

export default Webeditor;
