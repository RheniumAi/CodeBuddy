import React, { useEffect, useState } from "react";
import { getFriendRequests, respondToFriendRequest } from "../../services/UserApi";
import { toast } from "react-hot-toast";

const FriendRequests = ({ onClose }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests on component mount
    const fetchRequests = async () => {
      try {
        const response = await getFriendRequests();
        setRequests(response.friendRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        toast.error(error.message);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (email, accepted) => {
    try {
      await respondToFriendRequest(email, accepted);
      toast.success(accepted ? "Friend request accepted!" : "Friend request rejected.");
      setRequests(requests.filter((req) => req.email !== email)); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-400">No friend requests.</p>
        ) : (
          requests.map((user) => (
            <div key={user.email} className="flex justify-between items-center p-2 border-b border-gray-700">
              <span>{user.username}</span>
              <div>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 transition duration-200 mr-2"
                  onClick={() => handleResponse(user.email, true)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition duration-200"
                  onClick={() => handleResponse(user.email, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}

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

export default FriendRequests;
