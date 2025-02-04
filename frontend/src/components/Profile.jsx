import React from 'react';

function Profile() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center w-full max-w-2xl mt-8">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
        <img
          src="https://www.svgrepo.com/show/406522/man-technologist-medium-light-skin-tone.svg"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-6">
        <h2 className="text-2xl font-bold text-gray-800">Username</h2>
        <div className="mt-4 flex gap-6 text-blue-500 font-semibold">
          <a href="#" className="hover:underline transition duration-300">
            Friends
          </a>
          <a href="#" className="hover:underline transition duration-300">
            Friend Requests
          </a>
          <a href="#" className="hover:underline transition duration-300">
            Add friend
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
