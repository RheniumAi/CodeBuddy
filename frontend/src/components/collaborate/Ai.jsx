import React, { useState, useRef, useEffect } from "react";
import { generateCode } from "../../services/CollaborateApi";

const Ai = ({ code }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [isFirstQuery, setIsFirstQuery] = useState(true);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
        const prompt = isFirstQuery
            ? `This is my code: ${code} and this is my question: ${input}`
            : `This is my question: ${input}`;

        const response = await generateCode(prompt);

        const aiMessage = {
            text: response.response || `AI response to: "${input}"`,
            sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (isFirstQuery) setIsFirstQuery(false);
    } catch (error) {
        setMessages((prev) => [
            ...prev,
            { text: "Failed to get AI response. Try again.", sender: "ai" },
        ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-96 w-80 bg-[#1D232A] shadow-md rounded-lg p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`chat-bubble ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              } whitespace-pre-wrap`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          className="input input-bordered flex-1 bg-gray-800 text-white placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Ai;
