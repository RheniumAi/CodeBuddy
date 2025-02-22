// Model for the room (for later use)
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  users: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: [] 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Room = mongoose.model("Room", RoomSchema);

