import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";

import app from "../firebase";
const API_URL = "http://localhost:5000/api/user";



// To fetch personal profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, { // Fixed template literal
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user profile");
  }
};


// To add a friend
export const addFriend = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/addFriend`, { email }, { // Fixed template literal
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding friend:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add friend");
  }
};

// To view the list of friends (request received)
export const getFriendRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/friendRequests`, { 
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests received:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch friend requests received");
  }
};

// Accept or reject friend request
export const respondToFriendRequest = async (email, accepted) => {
  try {
    const response = await axios.post(`${API_URL}/respondFriendRequest`, { email, accepted }, { 
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error responding to friend request:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to respond to friend request");
  }
};

// To view the list of friends (accepted)
export const viewFriend = async () => {
  try {
    const response = await axios.get(`${API_URL}/viewFriend`, { 
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests accepted:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch friend requests accepted");
  }
};

// Removing friend from friend list (existing)
export const removeFriend = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/removeFriend`, { email }, { 
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing friend:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove friend");
  }
};
//removeprofilepic code
export const removeProfilePicture = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  try {
    // Remove from Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await deleteObject(storageRef);

    // Remove from Database
    await axios.post(`${API_URL}/removeProfilePic`, { userId });

    return { success: true, message: "Profile picture removed!" };
  } catch (error) {
    console.error("Error removing profile picture:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove profile picture");
  }
};
//uploadpicture code
export const uploadProfilePicture = async (userId, imageFile) => {
  if (!userId || !imageFile) throw new Error("User ID and image file are required");

  try {
    // Upload to Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(storageRef);

    // Update the backend with the new profile picture URL
    await axios.post(`${API_URL}/uploadProfilePic`, { userId, imageUrl: downloadUrl });

    return { success: true, imageUrl: downloadUrl, message: "Profile picture updated!" };
  } catch (error) {
    console.error("Error uploading profile picture:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to upload profile picture");
  }
};

//updatebio code 
export const updateUserBio = async (userId, bio) => {
  if (!userId) {
    console.error("User ID is undefined");
    return { ok: false, message: "User ID is required" };
  }

  try {
    const response = await fetch("http://localhost:5000/api/user/update-bio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bio }),
    });

    return response;
  } catch (error) {
    console.error("Error updating bio:", error);
    return { ok: false, message: "Network error" };
  }
};

