import React from 'react';

function Suggestioncard({ username, onAddFriend }) {
  return (
    <div className="flex items-center justify-between bg-gray-300 rounded-lg p-3 mb-2 w-full">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-500 rounded-full mr-3"></div>
        <span className="font-semibold">{username}</span>
      </div>
      <button 
        className="w-6 h-6 bg-green-500 rounded-md hover:bg-green-600 transition"
        onClick={onAddFriend}
      >
      </button>
    </div>
  );
}

export default Suggestioncard;
