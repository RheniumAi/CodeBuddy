import React from "react";
import Profile from "../../components/profile/Profile";
import Utility from "../../components/profile/Utility";
import Invite from "../../components/popups/Invite"

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 ">
      <Profile />
      <Utility />
      <Invite />
    </div>
  );
}

export default ProfilePage;
