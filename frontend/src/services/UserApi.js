// API calls to backend for all user components

import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

// To fetch personal profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
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
    const response = await axios.post(`${API_URL}/addFriend`, {email} ,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding friend:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add friend");
  }
}

// To view the list of friends (request recieved)
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
}

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
}

// Removing friend from friend list (existing)
export const removeFriend = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/removeFriend`, email, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing friend:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove friend");
  }
}

