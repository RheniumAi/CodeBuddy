import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserProfile, updateUserBio,removeProfilePicture,uploadProfilePicture } from "../../services/UserApi";
import { logoutUser } from "../../services/AuthApi";
import FriendRequests from "../popups/Friendrequest";
import Viewfriend from "../popups/Viewfriend";
import { toast } from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import app from "../../firebase";

function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [imageurl, setImageurl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response) {
          setUser(response);
          setBio(response.bio);
          setImageurl(response.profilePic || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleBioSave = async () => {
    if (!user || !user._id) return toast.error("User not found");

    try {
      const response = await updateUserBio(user._id, bio);
      if (response.ok) {
        toast.success("Bio updated successfully!");
        setEditingBio(false);
      } else {
        toast.error("Failed to update bio");
      }
    } catch (error) {
      toast.error("Failed to update bio");
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  
  const uploadImage = async () => {
    if (!selectedImage) return toast.error("No image selected!");
  
    try {
      setUploading(true);
      const response = await uploadProfilePicture(user._id, selectedImage);
  
      setImageurl(response.imageUrl);
      localStorage.setItem("profileImage", response.imageUrl);
      toast.success(response.message);
  
      // 🔹 Hide the button after successful upload
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };
  

  const handleRemoveImage = async () => {
    if (!imageurl) return toast.error("No profile picture to remove!");
  
    try {
      setRemoving(true);
      await removeProfilePicture(user._id);
  
      setImageurl("");
      localStorage.removeItem("profileImage");
      toast.success("Profile picture removed!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRemoving(false);
    }
  };

  if (!user) {
    return <p className="text-white text-xl animate-pulse">Loading profile...</p>;
  }

  return (
    <motion.div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl shadow-xl w-96 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-white mt-4">{user.username || "Unknown User"}</h2>

      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
      <div className="cursor-pointer w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-700 mt-4" onClick={handleProfileClick}>
  {imageurl ? <img src={imageurl} className="w-full h-full object-cover" alt="Profile" /> : <span>Click to Upload</span>}
</div>

{selectedImage && (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
    onClick={uploadImage}
  >
    {uploading ? "Uploading..." : "Upload Image"}
  </button>
)}



      {/* EDIT PROFILE BUTTON */}
      <button
        className="mt-4 bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600"
        onClick={() => setShowEditPopup(true)}
      >
        Edit Profile
      </button>

      {/* EDIT PROFILE POPUP */}
      {showEditPopup && (
        <div className="absolute top-20 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <button className="block text-left px-4 py-2 w-full hover:bg-gray-700 rounded" onClick={() => setEditingBio(true)}>
            Edit Bio
          </button>
          {imageurl && (
            <button className="block text-left px-4 py-2 w-full hover:bg-gray-700 rounded" onClick={handleRemoveImage}>
              Remove Profile Picture
            </button>
          )}
          <button className="block text-left px-4 py-2 w-full hover:bg-gray-700 rounded" onClick={() => setShowEditPopup(false)}>
            Close
          </button>
        </div>
      )}

      <div className="mt-4 w-full px-4">
        {editingBio ? (
          <>
            <textarea className="border p-2 w-full rounded bg-gray-800 text-white" value={bio} onChange={(e) => setBio(e.target.value)} />
            <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded w-full" onClick={handleBioSave}>
              Save Bio
            </button>
          </>
        ) : (
          <p className="text-gray-300 text-center">{bio || "No bio added"}</p>
        )}
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600" onClick={() => setShowFriendRequests(true)}>
        Show Friend Requests
      </button>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600" onClick={() => setShowFriends(true)}>
        Show Friends
      </button>

      {showFriendRequests && <FriendRequests onClose={() => setShowFriendRequests(false)} />}
      {showFriends && <Viewfriend onClose={() => setShowFriends(false)} />}

      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600" onClick={() => navigate("/login")}>
        Logout
      </button>
    </motion.div>
  );
}

export default Profile;
