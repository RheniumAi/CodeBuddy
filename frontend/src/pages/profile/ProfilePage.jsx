import React from "react";
import Profile from "../../components/profile/Profile";
import Utility from "../../components/profile/Utility";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 ">
      <Profile />
      <Utility />
    </div>
  );
}

export default ProfilePage;
