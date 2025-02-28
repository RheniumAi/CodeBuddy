import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiEdit2, FiUserPlus, FiUsers, FiLogOut, FiX } from "react-icons/fi";
import { getUserProfile, updateUserBio, removeProfilePicture, uploadProfilePicture } from "../../services/UserApi";
import { logoutUser } from "../../services/AuthApi";
import FriendRequests from "../popups/Friendrequest";
import Viewfriend from "../popups/Viewfriend";
import { toast } from "react-hot-toast";
import Modal from "../common/Model";
import { addFriend } from '../../services/UserApi';
import Button from '../common/Button'; 
import SkeletonLoader from "../common/SkeletonLoader";

function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [imageurl, setImageurl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState('');
  
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
        toast.error("Error loading profile");
      }
    };
    fetchUserProfile();
  }, []);

  const handleBioSave = async () => {
    if (!user?._id) return toast.error("User not found");
    try {
      await updateUserBio(user._id, bio);
      toast.success("Bio updated successfully!");
      setEditingBio(false);
    } catch (error) {
      toast.error("Failed to update bio");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    try {
      setUploading(true);
      const response = await uploadProfilePicture(user._id, selectedImage);
      setImageurl(response.imageUrl);
      toast.success("Profile picture updated!");
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
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email.trim()) {
        toast.error("Please enter an email address.");
        return;
      }
  
      try {
        const response = await addFriend(email);
        console.log('Successful', response);
        toast.success("Friend request sent successfully!");
      } catch (error) {
        console.error('Request failed:', error);
        toast.error(error.message || "Request failed. Please try again.");
      }
    };

  if (!user) return <SkeletonLoader type="profile" />;

  const handleLogout = async (e) => { 
    e.preventDefault();
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error(error.message || "Logout failed. Please try again.");
    }

  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-8"> 
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 mx-4 relative"
  >
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Profile
        </h1>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <FiLogOut className="text-2xl text-red-400" />
        </button>
      </div>

      {/* Profile Image Section */}
      <div className="group relative w-32 h-32 mx-auto mb-6 cursor-pointer" onClick={() => fileInputRef.current.click()}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center">
          <FiCamera className="text-2xl text-white" />
        </div>
        <img
          src={imageurl || "https://via.placeholder.com/128"}
          className="w-full h-full rounded-full object-cover border-4 border-gray-700"
          
        />
        <input type="file" ref={fileInputRef} hidden onChange={(e) => setSelectedImage(e.target.files[0])} />
      </div>

      {/* Image Upload Controls */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 justify-center mb-6"
        >
          <button
            onClick={handleImageUpload}
            disabled={uploading}
            className="px-4 py-2 bg-green-500 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? "Uploading..." : "Confirm Upload"}
          </button>
          <button
            onClick={() => setSelectedImage(null)}
            className="px-4 py-2 bg-gray-600 rounded-lg font-medium"
          >
            Cancel
          </button>
        </motion.div>
      )}
{/* User Information */}
<div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{user.username}</h2>
        <p className="text-gray-400 text-sm px-4 mb-2">
          {bio || "No bio available. Add one!"}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setEditingBio(true)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FiEdit2 /> Edit Profile
          </button>
        </div>
      </div>

      {/* Updated Edit Profile Modal */}
      <Modal isOpen={editingBio} onClose={() => setEditingBio(false)} className="z-50">

        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
        
        {/* Bio Editing Section */}
        <textarea
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  maxLength={150}
  className="w-full bg-gray-800 rounded-lg p-4 mb-4 resize-none h-32 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Tell us about yourself..."
  autoFocus // Adds automatic focus when modal opens
/>
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400 text-sm">{150 - bio.length} characters remaining</span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingBio(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleBioSave}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400"
            >
              Save Bio
            </button>
          </div>
        </div>

        {/* Profile Picture Removal Section */}
        
      </Modal>


      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={() => setShowFriendRequests(true)}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <FiUserPlus /> Friend Requests
        </button>
        <button
          onClick={() => setShowFriends(true)}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <FiUsers /> View Friends
        </button>
      </div>

      <div className="flex gap-2 w-full  mb-4">
    <input 
      className="w-full py-3 px-4 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      placeholder="Search by Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <button 
      className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-gray-100 transition-colors flex items-center gap-2"
      onClick={handleSubmit}
    >
      <FiUserPlus /> Add
    </button>
  </div>

  {/* Updated Collaborate Button */}
  <button
    onClick={() => navigate('/collaborate')}
    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-gray-100"
  >
    <FiUsers /> Collaborate
  </button>

      {/* Friend Requests Modal */}
      <Modal isOpen={showFriendRequests} onClose={() => setShowFriendRequests(false)}>
        <FriendRequests onClose={() => setShowFriendRequests(false)} />
      </Modal>

      {/* Friends List Modal */}
      <Modal isOpen={showFriends} onClose={() => setShowFriends(false)}>
        <Viewfriend onClose={() => setShowFriends(false)} />
      </Modal>
    </motion.div>
    </div>
  );
}

export default Profile;