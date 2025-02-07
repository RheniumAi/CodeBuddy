import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="sticky top-0 bg-white shadow-md py-4 px-8 flex justify-between items-center z-50">
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/">CodeBuddy</Link>
      </div>

      <div className="flex space-x-6 text-gray-700 font-medium">
      <Link to="/" className="hover:text-blue-500 transition duration-300">Home</Link>
        <Link to="/about" className="hover:text-blue-500 transition duration-300">About</Link>
        <Link to="/login" className="hover:text-blue-500 transition duration-300">Login</Link>
        <Link to="/signup" className="hover:text-blue-500 transition duration-300">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;