import React, { useEffect, useState } from "react";
import axios from "axios";

const Invite = ({ userId }) => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/invite-respond", {
          withCredentials: true, 
        });
        setInvites(response.data);
      } catch (error) {
        console.error("Error fetching invites:", error);
      }
    };

    fetchInvites();
  }, []); 

  // Function to accept or reject an invite
  const respondToInvite = async (inviteId, response) => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/invite-respond",
        { inviteId, userId, response },
        { withCredentials: true } 
      );
      setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));

      alert(`Invite ${response} successfully`);
    } catch (error) {
      console.error("Error responding to invite:", error);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Invitations</h2>
      {invites.length === 0 ? (
        <p>No pending invites</p>
      ) : (
        invites.map((invite) => (
          <div key={invite._id} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg mb-2">
            <span>From: {invite.sender.username}</span>
            <div>
              <button
                className="px-3 py-1 bg-green-600 rounded-lg mr-2"
                onClick={() => respondToInvite(invite._id, "accepted")}
              >
                Accept
              </button>
              <button
                className="px-3 py-1 bg-red-600 rounded-lg"
                onClick={() => respondToInvite(invite._id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Invite;
