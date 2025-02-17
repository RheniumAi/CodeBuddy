import React from "react";
import { inviteFriend } from "./collaborateApi";

const Invite = ({ friendId, sessionId }) => {
  const sendInvite = async () => {
    await inviteFriend(friendId, sessionId);
    alert("Invite Sent!");
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Invite</h2>
      <button onClick={sendInvite} className="p-2 bg-blue-600 rounded-lg w-full">
        Send Invite
      </button>
    </div>
  );
};

export default Invite;
