// Route for landing page. (Collaboration is made separately)

import express from 'express';
import {
  getUserProfile,
  uploadprofilepic,
  fetchimage,
  removeProfilePic,
  addFriend,
  viewFriend,
  removeFriend,
  respondToFriendRequest,
  getFriendRequests,
  updateBio,
} from '../controllers/user.controller.js';
import {protectRoute} from '../middleware/protectRoute.js'
const router = express.Router();

router.post("/uploadProfilePic",uploadprofilepic);
router.put("/update-bio", updateBio);
router.get("/getimage",fetchimage);
router.post("/removeProfilePic",removeProfilePic);
// Route to fetch user profile. Shows the details of the user
router.get('/profile', protectRoute, getUserProfile);

// Route to add a friend
router.post('/addFriend', protectRoute, addFriend);

// Route to view all friends
router.get('/viewFriend', protectRoute, viewFriend); 

// Route to accept or reject a friend request
router.post('/respondFriendRequest', protectRoute, respondToFriendRequest);

// Route to remove a friend from the friend list
router.post('/removeFriend', protectRoute, removeFriend);

// Route to  Show the list of friend request recieved
router.get('/friendRequests', protectRoute, getFriendRequests);

export default router;
