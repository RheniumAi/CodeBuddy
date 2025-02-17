import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";
import { getUserProfile, viewFriend } from "../../services/UserApi";

const Webeditor = () => {
  const editorRef = useRef(null);
  const ydocRef = useRef(new Y.Doc());
  const providerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);

        const friendsList = await viewFriend();
        setFriends(friendsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);
  

  useEffect(() => {
    const roomId = "collaboration-room";
    const provider = new WebsocketProvider(
      "ws://localhost:5000/ws/",
      roomId,
      ydocRef.current
    );
    providerRef.current = provider;

    provider.on("status", (event) => {
      setConnectionStatus(event.status === "connected" ? "Connected" : "Disconnected");
    });

    provider.on("error", () => {
      setConnectionStatus("Disconnected");
    });

    return () => {
      provider.destroy();
      ydocRef.current.destroy();
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    const yText = ydocRef.current.getText("monaco");
    new MonacoBinding(
      yText,
      editor.getModel(),
      new Set(),
      providerRef.current.awareness
    );
  };

  return (
    <div>
      <div style={{ flex: 1, paddingLeft: "20px" }}>
        <h1>Collaborative Code Editor</h1>
        <Editor height="500px" language="javascript" theme="vs-dark" onMount={handleEditorDidMount} />
      </div>
    </div>
  );
};

export default Webeditor;
