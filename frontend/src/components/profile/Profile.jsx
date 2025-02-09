import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

// Importing API calls to backend
import { getUserProfile } from "../../services/UserApi";
import { logoutUser } from "../../services/AuthApi";

// Importing components
import Button from "../common/Button";
import FriendRequests from "../popups/Friendrequest";
import Viewfriend from "../popups/Viewfriend";

//Toast
import { toast } from 'react-hot-toast';

function Profile() {
  // To display user profile
  const [user, setUser] = useState(null);
  // To display friend requests popup
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  // To display friends popup
  const [showFriends, setShowFriends] = useState(false);

  const navigate = useNavigate();

  // Fetch user details upon render
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Logout the logged in user
  const handleLogout = async () => {
    try {
      await logoutUser(); 
      toast.success("Logged Out");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  // Wait while details of logged in user is being fetched
  if (!user) {
    return <p className="text-white">Loading profile...</p>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex items-center w-full max-w-4xl">
        <div className="avatar ml-[10%]">
          <div className="w-48 h-48 rounded-full ring ring-gray-300 ring-offset-white ring-offset-2"></div>
        </div>

        <div className="card bg-gray-900 bg-opacity-20 backdrop-blur-md shadow-lg w-full min-h-[200px] ml-6 p-6 border border-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-gray-300">{user.bio || "No bio available"}</p>

          <div className="flex justify-between mt-4 text-gray-400">
            <p 
              className="cursor-pointer text-green-400 hover:text-green-500"
              onClick={() => setShowFriends(true)}
            >
              Friends: <span className="font-semibold text-white">{user.friends.length}</span>
            </p>
            <p 
              className="cursor-pointer text-blue-400 hover:text-blue-500"
              onClick={() => setShowFriendRequests(true)}
            >
              Friend Requests: <span className="font-semibold text-white">{user.friendRequest.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button text="Edit Profile" className="bg-green-500 text-white hover:bg-green-600" />
        <Button text="Logout" className="bg-red-500 text-white hover:bg-red-600" onClick={handleLogout} />
      </div>

      {/* Dynamic rendering of popup */}
      {showFriendRequests && <FriendRequests onClose={() => setShowFriendRequests(false)} />}
      {showFriends && <Viewfriend onClose={() => setShowFriends(false)} />}
    </div>
  );
}

export default Profile;