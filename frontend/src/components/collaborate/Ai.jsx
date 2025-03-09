import React, { useState, useRef, useEffect } from "react";
import { generateCode } from "../../services/CollaborateApi";

const Ai = ({ code, isAiOpen, closeAiPopup }) => {
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
      const errorMessage =
        error.error || "Failed to get AI response. Try again.";

      setMessages((prev) => [...prev, { text: errorMessage, sender: "ai" }]);
    }

    setInput("");
  };

  if (!isAiOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100">
              AI Code Assistant
            </h3>
          </div>
          <button
            onClick={closeAiPopup}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 h-[500px] flex flex-col gap-4">
          {/* AI Response Section */}
          <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
            <div className="prose prose-invert max-w-none">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.sender === "user" ? "chat-end" : "chat-start"
                  }`}
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
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to improve or explain code..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Ask
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Pro tip: Try "Optimize this function" or "Explain this algorithm"
            </p>
            <p className="text-xs text-red-500 mt-2">
              Note: To prevent misuse, users can ask up to 5 questions, with usage renewing every 5 hours."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;
