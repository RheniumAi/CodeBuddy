import React, { useState } from 'react';
import Button from '../common/Button'; 
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Importing API calls to backend
import { addFriend } from '../../services/UserApi';

function Utility() {
  // Sending friend request by entering emai
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
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

      {/* Buttons */}
      <div className="join">
        <input className="input input-bordered join-item" placeholder="Search by Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button className="btn join-item rounded-r-full" onClick={handleSubmit}>Add</button>
      </div>
      
      <Button 
        text="Collaborate" 
        className="bg-purple-500 text-white hover:bg-purple-600" 
        onClick={() => navigate('/collaborate')}
      />

      
    </div>
  );
}

export default Utility;
