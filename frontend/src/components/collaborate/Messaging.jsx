import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

function Messaging() {
  return (
    <div className="flex flex-col h-[500px] w-[350px] border rounded-lg shadow-lg p-4 bg-base-100">
      {/* Chat Messages Section */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <div className="chat chat-start">
          <div className="chat-bubble">Hello! How are you?</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-primary">I'm good, thanks! You?</div>
        </div>
      </div>

      {/* Input Box Section */}
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-1 mr-2"
        />
        <button className="btn btn-primary">
          <FaPaperPlane className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default Messaging;
