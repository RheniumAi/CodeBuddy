import React from 'react';

function Button({ text, onClick, className }) {
  return (
    <button 
      className={`px-4 py-2 bg-gray-300 rounded-md text-black font-semibold hover:bg-gray-400 transition ${className}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
