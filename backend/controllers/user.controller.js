import { User } from "../models/User.js";
import mongoose from "mongoose"; 


// Fetching user profile
const getUserProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Profile Response:", user);  // Debugging

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

//imageupload code
const uploadprofilepic= async (req, res) => {
  console.log("Hitted the upload route");
  console.log("Request Body:", req.body);

  let { userId, imageUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing user ID" });
  }

 
  try {
    userId = new mongoose.Types.ObjectId(userId);
  } catch (error) {
    console.log("Invalid userId format:", userId);
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true } // ✅ Returns the updated document
    );

    if (!user) {
      console.log("User not found in database:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated User:", user); // ✅ Log the updated user
    res.json({ status: "ok", message: "Profile picture updated", user });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};
 //fetchimage
  const fetchimage=async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("username bio profilePic");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  };
// Adding an user to friend by their email
const addFriend = async (req, res) => {
  const { email } = req.body;
  const userId = req.user._id;

  try {
    const friend = await User.findOne({ email });
    if (!friend) return res.status(404).json({ message: "User not found" });

    if (friend._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    if (friend.friendRequest.includes(userId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    if (friend.friends.includes(userId)) {
      return res.status(400).json({ message: "User is already in your friend list" });
    }
    await User.findByIdAndUpdate(friend._id, { $push: { friendRequest: userId } }, { new: true });

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Error adding friend" });
  }
};

// Fetching the list of friends (accepted)
const viewFriend = async (req, res) => {
  const userId = req.user._id; 

  try {
    const user = await User.findById(userId).select("friends").populate("friends", "username email"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends" });
  }
};

// Accept or reject friend request
const respondToFriendRequest = async (req, res) => {
  const userId = req.user._id; 
  const { email, accepted } = req.body; 

  try {
    const friend = await User.findOne({ email });

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    const friendId = friend._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.friendRequest.includes(friendId)) {
      return res.status(400).json({ message: "No friend request found from this user" });
    }

    if (accepted) {  
      if (!user.friends.includes(friendId)) {
        await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $push: { friends: userId } });
      }
    }

    // Remove friend request from both users
    await User.findByIdAndUpdate(userId, { $pull: { friendRequest: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendRequest: userId } });

    res.status(200).json({ message: `Friend request ${accepted ? "accepted" : "rejected"} successfully` });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ message: "Error processing friend request" });
  }
};

// Removing friend from friend list (existing)
const removeFriend = async (req, res) => {
  const userId = req.user._id; 
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User or friend not found" });

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is not in your friend list" });
    }

    // Remove from both users' friends lists
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend" });
  }
};

// Show the list of friend request recieved
const getFriendRequests = async (req, res) => {
  const userId = req.user._id;  // Logged-in user

  try {
    const user = await User.findById(userId).populate("friendRequest", "username email");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ friendRequests: user.friendRequest });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Error fetching friend requests" });
  }
};

const updateBio = async (req, res) => {
  const { userId, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true } // ✅ Return the updated user
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Error updating bio" });
  }
};


const updateProfileImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user._id); // ✅ Use `_id` safely
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({ profileImage: user.profileImage, message: "Profile image updated successfully" });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const removeProfilePic=async (req, res) => {
  const { userId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { profilePic: "" });
    res.json({ status: "ok", message: "Profile picture removed" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to remove picture" });
  }
};

export { getUserProfile,removeProfilePic,uploadprofilepic,fetchimage,updateProfileImage,updateBio, addFriend, viewFriend, removeFriend, respondToFriendRequest, getFriendRequests };
