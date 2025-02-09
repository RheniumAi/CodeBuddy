import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { getUserProfile } from "../../services/UserApi";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response); // Set user data from API
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <p className="text-white">Loading profile...</p>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      {/* Profile Section */}
      <div className="flex items-center w-full max-w-4xl">
        {/* Profile Picture */}
        <div className="avatar ml-[10%]">
          <div className="w-48 h-48 rounded-full ring ring-gray-300 ring-offset-white ring-offset-2"></div>
        </div>

        {/* Profile Details Card */}
        <div className="card bg-gray-900 bg-opacity-20 backdrop-blur-md shadow-lg w-full min-h-[200px] ml-6 p-6 border border-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-gray-300">{user.bio || "No bio available"}</p>

          {/* Friends & Friend Requests */}
          <div className="flex justify-between mt-4 text-gray-400">
            <p>
              Friends: <span className="font-semibold text-white">{user.friends.length}</span>
            </p>
            <p>
              Friend Requests: <span className="font-semibold text-white">{user.friendRequest.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-4 mt-4">
        <Button text="Edit Profile" className="bg-green-500 text-white hover:bg-green-600" />
        <Button text="Logout" className="bg-red-500 text-white hover:bg-red-600" />
      </div>
    </div>
  );
}

export default Profile;
