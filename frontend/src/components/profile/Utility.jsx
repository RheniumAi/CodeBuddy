import React, { useState } from 'react';
import Button from '../common/Button'; 
import { toast } from 'react-hot-toast';

// Importing API calls to backend
import { addFriend } from '../../services/UserApi';

function Utility() {
  // Sending friend request by entering emai
  const [email, setEmail] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }

    try {
      const response = await addFriend(email);
      console.log('Successful', response);
      toast.success("Friend request sent successfully!");
    } catch (error) {
      console.error('Request failed:', error);
      toast.error(error.message || "Request failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Input Field */}
      <input 
        type="text" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email" 
        className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="flex gap-4">
        <Button text="Add Friend" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSubmit} />
        <Button text="Collaborate" className="bg-purple-500 text-white hover:bg-purple-600" />
      </div>
    </div>
  );
}

export default Utility;
