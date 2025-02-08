import React from 'react';
import Button from '../common/Button'; 

function Utility() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Input Field */}
      <input 
        type="text" 
        placeholder="Enter username" 
        className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="flex gap-4">
        <Button text="Add Friend" className="bg-blue-500 text-white hover:bg-blue-600" />
        <Button text="Collaborate" className="bg-purple-500 text-white hover:bg-purple-600" />
      </div>
    </div>
  );
}

export default Utility;
