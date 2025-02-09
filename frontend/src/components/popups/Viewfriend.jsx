import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { viewFriend, removeFriend } from "../../services/UserApi";

const ViewFriend = ({ onClose }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await viewFriend();
        setFriends(response);
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error(error.message);
      }
    };
    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend({ friendId });
      toast.success("Friend removed successfully");
      setFriends((prevFriends) => prevFriends.filter((friend) => friend._id !== friendId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
        <div className="max-h-60 overflow-y-auto">
          {friends.length === 0 ? (
            <p className="text-gray-400">No friends added.</p>
          ) : (
            friends.map((friend) => (
              <div key={friend._id} className="flex justify-between items-center p-2 border-b border-gray-700">
                <span>{friend.username}</span>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition duration-200"
                  onClick={() => handleRemoveFriend(friend._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <button
          className="mt-4 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewFriend;